import { AllJobs, RenderEngineStatus } from "@customTypes/renderEngineTypes";
import { Card, Col, Icon, Popconfirm, Progress, Row, Typography } from "antd";
import React, { useEffect, useMemo, useState } from "react";

const { Text } = Typography;

interface JobCard {
	job: AllJobs;
	onClick: (job: AllJobs) => void;
	startJob: (jobId: string) => void;
	onDelete: (jobId: string) => void;
	socket: SocketIOClient.Socket;
}

interface ProgressData {
	id: string;
	completion: number;
	action: "fetch" | "download" | "pre-render" | "render";
	sample: {
		done: string;
		total: string;
		percent: string;
	};
	time: {
		elapsed: string;
		remaining: string;
	};
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
	const [job, setJob] = useState<AllJobs>({
		...jobInitialData,
	});
	const [progressError, setProgressError] = useState<boolean>(false);
	const [progressData, setProgressData] = useState<Partial<ProgressData>>(null);
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
				socket.on("Job.Progress", progressInfo => {
					console.log("Job.Progress", progressInfo);
					if (job.qid === progressInfo.id) {
						const status = {
							status: job.status,
						};
						if (job.status === RenderEngineStatus.waiting) {
							status.status = RenderEngineStatus.active;
						}
						setProgressData({
							sample: {
								...progressData?.sample,
								done: progressInfo?.sample.done || progressInfo?.sample.done,
								total: progressInfo?.sample.total || progressInfo?.sample.total,
							},
						});
					}
				});
				socket.on("Job.Complete", message => {
					console.log("Job.Complete", message);
					if (job.qid === message.id) {
						setProgressData({
							sample: {
								done: "100",
								total: "100",
								percent: "100",
							},
						});
						setJob({
							...job,
							status: RenderEngineStatus.completed,
						});
						socket.removeAllListeners();
					}
				});
				socket.on("Job.Failed", id => {
					console.log("Job.Failed", id);
					if (job._id === id) {
						setProgressError(true);
						socket.removeAllListeners();
					}
				});
			}
		}
		return (): void => {
			socket.removeAllListeners();
			setSocketConnected(false);
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
						<Row gutter={[8, 8]}>
							<Col>
								<Row style={{ flexFlow: "row", whiteSpace: "pre", overflow: "hidden" }} gutter={[4, 4]} type="flex">
									<Col>
										<Text>Description:</Text>
									</Col>
									<Col>
										<Text style={{ width: "100%" }} ellipsis>
											{job.description || "No Description"}
										</Text>
									</Col>
								</Row>
							</Col>
							{job.status !== RenderEngineStatus.pending ? (
								<Col>
									<Progress
										percent={
											job.status === RenderEngineStatus.completed
												? 100
												: parseFloat(progressData?.sample?.total) || progressData?.completion || 0
										}
										size="small"
										{...(progressStatus ? { status: progressStatus } : {})}
									/>
								</Col>
							) : (
								<Col>
									<Text>
										<small>Not yet Started</small>
									</Text>
								</Col>
							)}
							{job.status === RenderEngineStatus.pending || job.status === RenderEngineStatus.completed ? (
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
							) : (
								<Col>
									<Row type="flex" justify="space-between">
										<Col>
											<Row type="flex" gutter={[4, 4]}>
												<Col>
													<Text>
														<small>Time Elapsed: </small>
													</Text>
												</Col>

												<Col>
													<Text>
														<small>{progressData?.time.elapsed || 0}</small>
													</Text>
												</Col>
											</Row>
										</Col>
										<Col>
											<Row type="flex" gutter={[4, 4]}>
												<Col>
													<Text>
														<small>Time Remaining: </small>
													</Text>
												</Col>

												<Col>
													<Text>
														<small>{progressData?.time.remaining || 0}</small>
													</Text>
												</Col>
											</Row>
										</Col>
									</Row>
								</Col>
							)}
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
