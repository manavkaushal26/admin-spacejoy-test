import React, { useState, useEffect, useMemo } from "react";
import { Col, Card, Row, Typography, Icon, Popconfirm, Progress } from "antd";
import { AllJobs, RenderEngineStatus } from "@customTypes/renderEngineTypes";

const { Text } = Typography;

interface JobCard {
	job: AllJobs;
	onClick: (job: AllJobs) => void;
	startJob: (jobId: string) => void;
	onDelete: (jobId: string) => void;
	socket: SocketIOClient.Socket;
}

interface JobWithProgress extends AllJobs {
	progress: number;
}

const JobCard: React.FC<JobCard> = ({ job: jobInitialData, onClick, startJob, onDelete, socket }) => {
	const [job, setJob] = useState<JobWithProgress>({
		...jobInitialData,
		progress: jobInitialData.status === "completed" ? 100 : 0,
	});
	const [progressError, setProgressError] = useState<boolean>(false);

	const [socketConnected, setSocketConnected] = useState<boolean>(false);

	useEffect(() => {
		if (socketConnected) {
			// eslint-disable-next-line no-console
			console.log("Socket Connected!!!");
		} else {
			// eslint-disable-next-line no-console
			console.log("Socket Disconnected!!!");
		}
	}, [socketConnected]);

	useEffect(() => {
		if (job.status === RenderEngineStatus.waiting || job.status === RenderEngineStatus.active) {
			if (job.qid) {
				socket.emit("subscribe", job.qid);
				setSocketConnected(true);
				socket.on("Job.Progress", ({ id, progress }) => {
					if (job.qid === id) {
						setJob({
							...job,
							progress,
						});
					}
				});
				socket.on("Job.Complete", ({ id }) => {
					if (job.qid === id) {
						setJob({
							...job,
							status: RenderEngineStatus.completed,
							progress: 100,
						});
					}
				});
				socket.on("Job.Failed", (id, err) => {
					if (job._id === id) {
						setProgressError(true);
					}
				});
			}
		}
		return (): void => {
			socket.removeAllListeners();
		};
	}, [job.status]);
	const progressStatus = useMemo(() => {
		if (progressError) {
			return "exception";
		}
		if (job.status === RenderEngineStatus.waiting || job.status === RenderEngineStatus.active) {
			return "active";
		}
		if (job.status === RenderEngineStatus.failed) {
			return "exception";
		}
		return null;
	}, [job.status]);
	return (
		<Col sm={12} md={8} lg={6} onClick={(): void => onClick(job)}>
			<Card
				hoverable
				actions={[
					<Icon
						type="experiment"
						key="render"
						onClick={(e): void => {
							e.stopPropagation();
							startJob(job._id);
						}}
					/>,
					<Popconfirm
						title="Are you Sure?"
						onConfirm={(e): void => {
							e.stopPropagation();
							onDelete(job._id);
						}}
						key="delete"
					>
						<Icon onClick={e => e.stopPropagation()} type="delete" />
					</Popconfirm>,
				]}
			>
				<Card.Meta
					title={job.name}
					description={
						<Row>
							<Col>
								<Row style={{ flexFlow: "row", whiteSpace: "pre", overflow: "hidden" }} gutter={[4, 4]} type="flex">
									<Col>
										<Text>Description:</Text>
									</Col>
									<Col>
										<Text style={{ width: "100%" }} ellipsis>
											{job.description}
										</Text>
									</Col>
								</Row>
							</Col>
							{job.status !== RenderEngineStatus.pending && (
								<Col>
									<Row style={{ flexFlow: "row", whiteSpace: "pre", overflow: "hidden" }} gutter={[4, 4]} type="flex">
										<Progress
											percent={job.progress}
											size="small"
											{...(progressStatus ? { status: progressStatus } : {})}
										/>
									</Row>
								</Col>
							)}
							<Col>
								<Row type="flex" gutter={[4, 4]}>
									<Col>
										<Text>
											<small>Status: </small>
										</Text>
									</Col>

									<Col>
										<Text>
											<small>{job.status}</small>
										</Text>
									</Col>
								</Row>
							</Col>
							<Col>
								<Row type="flex" gutter={[4, 4]}>
									<Col>
										<Text>
											<small>Created at: </small>
										</Text>
									</Col>

									<Col>
										<Text>
											<small>{job.createdAt.split("T")[0]}</small>
										</Text>
									</Col>
								</Row>
							</Col>
						</Row>
					}
				/>
			</Card>
		</Col>
	);
};

export default JobCard;
