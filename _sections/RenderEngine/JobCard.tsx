import { AllJobs, RenderEngineStatus } from "@customTypes/renderEngineTypes";
import { Card, Col, Icon, notification, Popconfirm, Progress, Row, Typography } from "antd";
import React, { useEffect, useMemo, useState } from "react";

const { Text } = Typography;

interface JobCard {
	job: AllJobs;
	onClick: (job: AllJobs) => void;
	startJob: (jobId: string) => void;
	onDelete: (jobId: string) => void;
	socket: SocketIOClient.Socket;
	cancelJob: (jobId: string) => void;
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

const JobCard: React.FC<JobCard> = ({ job: jobInitialData, onClick, startJob, onDelete, socket, cancelJob }) => {
	const [job, setJob] = useState<AllJobs>({
		...jobInitialData,
	});
	const [progressError, setProgressError] = useState<boolean>(false);
	const [progressData, setProgressData] = useState<Partial<ProgressData>>(null);

	useEffect(() => {
		if (job.status === RenderEngineStatus.waiting || job.status === RenderEngineStatus.active) {
			if (job.qid) {
				socket.emit("subscribe", job.qid);

				socket.on("Job.Start", data => {
					if (job.qid === data.id) {
						notification.warn({ message: `Job ${job.qid} has started.` });
					}
				});

				socket.on("Job.Progress", progressInfo => {
					if (job.qid === progressInfo.id) {
						const status = {
							status: job.status,
						};
						if (job.status === RenderEngineStatus.waiting) {
							status.status = RenderEngineStatus.active;
						}
						setProgressData({
							...progressInfo,
							sample: {
								...progressData?.sample,
								done: progressInfo?.sample?.done || progressData?.sample?.done,
								total: progressInfo?.sample?.total || progressData?.sample?.total,
								percent: progressInfo?.sample?.percent || progressData?.sample?.percent,
							},
							time: {
								elapsed: progressInfo.time?.elapsed || progressData?.time?.elapsed,
								remaining: progressInfo.time?.remaining || progressData?.time?.remaining,
							},
						});
					}
				});
				socket.on("Job.Complete", message => {
					if (job.qid === message.id) {
						// console.log("Job.Complete", message);

						if (job.qid === message.id) {
							notification.success({ message: `Job ${job.qid} has completed.` });
						}
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
						socket.emit("unsubscribe", job.qid);
					}
				});
				socket.on("Job.Failed", id => {
					if (job._id === id) {
						if (job.qid === id) {
							notification.error({ message: `Job ${job.qid} has failed.` });
						}
						setJob({
							...job,
							status: RenderEngineStatus.failed,
						});
						setProgressData(previousState => ({ ...previousState, completion: 100 }));
						setProgressError(true);
						socket.removeAllListeners();
					}
				});
				socket.on("Job.Complete", id => {
					if (job._id === id) {
						setJob({
							...job,
							status: RenderEngineStatus.completed,
						});
						setProgressData(previousState => ({
							...previousState,
							completion: 100,
						}));
						setProgressError(false);
						socket.emit("unsubscribe", job.qid);
					}
				});
			}
		}
		return (): void => {
			socket.emit("unsubscribe", job.qid);
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
	}, [job.status, progressData?.completion]);

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
										setProgressData(null);
										startJob(job._id);
									}}
									key="render"
								>
									<Icon type="video-camera" onClick={(e): void => e.stopPropagation()} key="render" />
								</Popconfirm>,
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
						  ]
						: []),
					...(job.status === RenderEngineStatus.active || job.status === RenderEngineStatus.waiting
						? [
								<Popconfirm
									title="Are you Sure?"
									onCancel={(e): void => {
										e.stopPropagation();
									}}
									onConfirm={(e): void => {
										e.stopPropagation();
										cancelJob(job._id);
									}}
									key="delete"
								>
									<Icon type="close" onClick={(e): void => e.stopPropagation()} key="render" />
								</Popconfirm>,
						  ]
						: []),
				]}
			>
				<Card.Meta
					title={job.name}
					description={
						<Row gutter={[4, 4]}>
							<Col span={12}>
								<Row type="flex" gutter={[4, 4]}>
									<Col>
										<Text>
											<small>Job Id: </small>
										</Text>
									</Col>
									<Col>
										<Text>
											<small>{job.qid || "Not started"}</small>
										</Text>
									</Col>
								</Row>
							</Col>
							<Col span={12}>
								<Row style={{ flexFlow: "row", whiteSpace: "pre", overflow: "hidden" }} gutter={[4, 4]} type="flex">
									<Col>
										<Text>
											<small>Sample count:</small>
										</Text>
									</Col>
									<Col>
										<Text style={{ width: "100%" }} ellipsis>
											<small>{job.options.samples}</small>
										</Text>
									</Col>
								</Row>
							</Col>

							<Col span={24}>
								<Row type="flex" gutter={[4, 4]}>
									<Col>
										<Text>
											<small>Action: </small>
										</Text>
									</Col>
									<Col>
										<Text>
											<small>{progressData?.action || "Not running"}</small>
										</Text>
									</Col>
								</Row>
							</Col>
							<Col>
								<Progress
									percent={job.status === RenderEngineStatus.completed ? 100 : progressData?.completion}
									size="small"
									{...(progressStatus ? { status: progressStatus } : {})}
								/>
							</Col>

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
								<>
									<Col>
										<Row type="flex" gutter={[4, 4]}>
											<Col>
												<Text>
													<small>Time Elapsed:</small>
												</Text>
											</Col>

											<Col>
												<Text>
													<small>{progressData?.time?.elapsed || 0}</small>
												</Text>
											</Col>
										</Row>
									</Col>
									<Col>
										<Row type="flex" gutter={[4, 4]}>
											<Col>
												<Text>
													<small>Time Remaining:</small>
												</Text>
											</Col>

											<Col>
												<Text>
													<small>{progressData?.time?.remaining || 0}</small>
												</Text>
											</Col>
										</Row>
									</Col>
								</>
							)}
							{(job.status === RenderEngineStatus.pending || job.status === RenderEngineStatus.completed) && (
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
							)}
						</Row>
					}
				/>
			</Card>
		</Col>
	);
};

export default JobCard;
