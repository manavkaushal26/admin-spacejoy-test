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

const HumanizeRenderStatus = {
	[RenderEngineStatus.active]: "Rendering",
	[RenderEngineStatus.pending]: "Job Created",
	[RenderEngineStatus.completed]: "Completed",
	[RenderEngineStatus.failed]: "Failed",
	[RenderEngineStatus.cancelled]: "Cancelled",
	[RenderEngineStatus.waiting]: "In Render Queue",
	[RenderEngineStatus.suspended]: "Suspended",
};

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
						const status = {
							status: job.status,
						};
						if (job.status === RenderEngineStatus.waiting) {
							status.status = RenderEngineStatus.active;
						}
						setJob({
							...job,
							progress,
							...status,
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
						socket.removeAllListeners();
					}
				});
				socket.on("Job.Failed", id => {
					if (job._id === id) {
						setProgressError(true);
						socket.removeAllListeners();
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
					...(job.status !== RenderEngineStatus.active && job.status !== RenderEngineStatus.waiting
						? [
								<Popconfirm
									title="Are you Sure?"
									onCancel={(e): void => {
										e.stopPropagation();
									}}
									onConfirm={(e): void => {
										e.stopPropagation();
										startJob(job._id);
									}}
									disabled={job.status === RenderEngineStatus.pending}
									key="delete"
								>
									<Icon
										type="experiment"
										key="render"
										{...(job.status === RenderEngineStatus.completed
											? {
													onClick: (e): void => {
														e.stopPropagation();
													},
											  }
											: {
													onClick: (e): void => {
														e.stopPropagation();
														startJob(job._id);
													},
											  })}
									/>
								</Popconfirm>,
						  ]
						: []),
					<Popconfirm
						title="Are you Sure?"
						onCancel={(e): void => {
							e.stopPropagation();
						}}
						onConfirm={(e): void => {
							e.stopPropagation();
							onDelete(job._id);
						}}
						key="delete"
					>
						<Icon onClick={(e): void => e.stopPropagation()} type="delete" />
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
											<small>{HumanizeRenderStatus[job.status]}</small>
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
