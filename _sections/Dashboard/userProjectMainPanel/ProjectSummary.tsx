import {
	AlertOutlined,
	CheckCircleTwoTone,
	CloseCircleTwoTone,
	LoadingOutlined,
	PauseCircleOutlined,
	PlayCircleOutlined,
} from "@ant-design/icons";
import { delayProjectApi, editProjectApi, startProjectApi } from "@api/projectApi";
import ProgressBar from "@components/ProgressBar";
import { DetailedProject, HumanizePhaseInternalNames, PhaseInternalNames } from "@customTypes/dashboardTypes";
import PauseProjectModal from "@sections/Dashboard/ProjectPauseModal";
import {
	convertDaysToMilliseconds,
	convertMillisecondsToDays,
	getColorsForPackages,
	getValueSafely,
} from "@utils/commonUtils";
import fetcher from "@utils/fetcher";
import { Avatar, Button, Col, Input, notification, Popconfirm, Radio, Row, Spin, Tag, Typography } from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { getTagColor, StyledTag, StyledTagInteractive } from "../styled";
const { Title, Text } = Typography;

interface ProjectSummaryProps {
	projectData?: DetailedProject;
	setProjectData?: React.Dispatch<React.SetStateAction<DetailedProject>>;
	fetchAndPopulateProjectData?: () => void;
}

const SilentTitle = styled(Title)`
	text-transform: capitalize;
	margin-bottom: 0 !important;
`;

const VerticallyPaddedDiv = styled.div`
	padding: 1.5rem 0 0 0;
`;
const Comment = styled.div`
	font-size: 0.8rem;
	margin-top: 8px;
	max-width: 210px;
	padding: 8px;
	border-radius: 4px;
	background-color: #ffdddd;
	border: 1px solid red;
`;
const ProjectSummary: React.FC<ProjectSummaryProps> = ({
	projectData,
	setProjectData,
	fetchAndPopulateProjectData,
}): JSX.Element => {
	// const { phase, task, status, avatar, name } = userProjectData;
	const [projectPauseStatus, setProjectPauseStatus] = useState(false);
	const [isPauseModalOpen, setPauseModalFlag] = useState(false);
	const [pauseComments, setPauseComments] = useState("");
	const togglePauseModal = () => {
		setPauseModalFlag(!isPauseModalOpen);
	};
	const closePauseModal = () => {
		setPauseModalFlag(false);
	};
	const updateProjectStatus = async (designerComment: string) => {
		const { _id: id } = projectData;
		const endPoint = `/v1/projects/${id}/pauseEvents`;
		const body = {
			...(designerComment.length && { comment: designerComment }),
			pause: !projectPauseStatus,
			adjustDelivery: true,
		};
		try {
			const res = await fetcher({ endPoint, method: "POST", body });

			const { data, statusCode } = res;
			if (statusCode <= 301) {
				setProjectPauseStatus(!projectPauseStatus);
				const successText = projectPauseStatus ? "resume" : "pause";
				notification.open({
					key: "Pause",
					message: "Successful",
					icon: <CheckCircleTwoTone twoToneColor='#52c41a' />,
					description: `Project ${successText}d successfully`,
				});
				fetchAndPopulateProjectData();
			} else {
				const { message } = data;
				throw new Error(message);
			}
		} catch (e) {
			notification.open({
				key: "Pause",
				message: "Failure",
				icon: <CloseCircleTwoTone twoToneColor='#f5222d' />,
				description: e.message,
			});
		} finally {
			setPauseModalFlag(false);
		}
	};
	const getPauseDataForProject = async (projectId: string) => {
		const endPoint = `/v1/projects/${projectId}/pauseEvents`;
		const res = await fetcher({ endPoint, method: "GET" });
		const { data, statusCode } = res;
		if (statusCode <= 301) {
			const { pauseEvent: { comments = [] } = {} } = data;
			setPauseComments(comments[0] || "");
		} else {
			throw new Error();
		}
	};
	useEffect(() => {
		setProjectPauseStatus(projectData.pause);
		if (projectData.pause) {
			getPauseDataForProject(projectData._id);
		}
	}, [projectData.pause]);

	const {
		name: room,
		status,
		customer,
		startedAt,
		endedAt,
		currentPhase: {
			name: { internalName: phase },
			startTime: phaseStartTime,
		},
		isDelivered,
	} = projectData;
	const [roomNameLoading, setRoomNameLoading] = useState<boolean>(false);

	const router = useRouter();

	const [delayValue, setDelayValue] = useState<{
		min: number;
		max: number;
		notifyCustomer: boolean;
	}>({
		min: 0,
		max: 0,
		notifyCustomer: false,
	});

	const items = getValueSafely(() => projectData.order.items, []);

	const endTime = useMemo(() => {
		if (phase === PhaseInternalNames.designsInRevision) {
			return moment(phaseStartTime).add(5 + delayValue.max, "days");
		}
		if (endedAt) {
			return moment(endedAt).add(delayValue.max, "days");
		}
		return null;
	}, [endedAt, startedAt, delayValue]);

	const duration = moment.duration((endTime || moment()).diff(moment()));
	const daysLeft = duration.get("days");

	const displayName = getValueSafely(() => {
		return customer.profile.name;
	}, room);

	const onDelayValueChange = (e): void => {
		const {
			target: { name, value },
		} = e;
		if (name !== "notifyCustomer") {
			setDelayValue(prevValue => ({
				...prevValue,
				[name]: parseFloat(value),
			}));
			return;
		}
		setDelayValue(prevValue => ({
			...prevValue,
			[name]: value,
		}));
	};

	useEffect(() => {
		setDelayValue({
			min: convertMillisecondsToDays(projectData.delay.minDurationInMs),
			max: convertMillisecondsToDays(projectData.delay.maxDurationInMs),
			notifyCustomer: true,
		});
	}, [projectData]);

	const onDelayConfirm = async (): Promise<void> => {
		notification.open({
			key: "Delay",
			message: "Please Wait",
			icon: <LoadingOutlined />,
			description: "Setting Delay",
		});
		if (delayValue.min < delayValue.max) {
			const endPoint = delayProjectApi(projectData._id);
			const body = {
				minDurationInMs: convertDaysToMilliseconds(delayValue.min),
				maxDurationInMs: convertDaysToMilliseconds(delayValue.max),
				shouldNotify: delayValue.notifyCustomer,
			};
			const response: DetailedProject = await fetcher({ endPoint, method: "PUT", body: { data: body } });
			try {
				if (response.delay) {
					setProjectData({
						...projectData,
						delay: {
							...response.delay,
						},
					});
					notification.open({
						key: "Delay",
						message: "Successful",
						icon: <CheckCircleTwoTone twoToneColor='#52c41a' />,
						description: "Delay has been set Successfully",
					});
				}
			} catch (e) {
				notification.open({
					key: "Delay",
					message: "Error",
					icon: <CloseCircleTwoTone twoToneColor='#f5222d' />,
					description: "There was a problem setting delay",
				});
			}
		} else {
			notification.open({
				key: "Delay",
				message: "Error",
				icon: <CloseCircleTwoTone twoToneColor='#f5222d' />,
				description: "There was a problem setting delay",
			});
		}
	};

	const onStartClick = async (): Promise<void> => {
		const endpoint = startProjectApi(projectData._id);

		const response = await fetcher({
			endPoint: endpoint,
			method: "PUT",
			body: { data: {} },
		});
		if (response.statusCode <= 300) {
			setProjectData({ ...projectData, endedAt: response.data.endedAt, startedAt: response.data.startedAt });
			notification.success({ message: "Project Started Successfully" });
		} else {
			notification.error({ message: response.message });
		}
	};

	const changeName = async editedName => {
		const endPoint = editProjectApi(projectData?._id);
		const body = { data: { name: editedName } };
		setRoomNameLoading(true);
		try {
			const response = await fetcher({ endPoint, method: "PUT", body });
			if (response.statusCode <= 300) {
				setProjectData({ ...projectData, ...body.data });
			} else {
				throw new Error();
			}
		} catch (e) {
			notification.error({ message: "Something went wrong" });
		}
		setRoomNameLoading(false);
	};
	const alignVal = projectPauseStatus ? "top" : "middle";
	const isDelayed = getValueSafely(() => projectData.delay.isDelayed, false);
	return (
		<VerticallyPaddedDiv>
			<Row justify='space-between' align={alignVal} gutter={[8, 8]}>
				<Col offset={1}>
					<Row gutter={[16, 8]} align='top'>
						<Col>
							<Avatar size={48} style={getColorsForPackages(items)}>
								{displayName[0].toUpperCase()}
							</Avatar>
						</Col>
						<Col>
							<Row>
								<Col span={24}>
									<SilentTitle ellipsis level={3}>
										{displayName}
									</SilentTitle>
								</Col>
								<Col span={24}>
									<Spin spinning={roomNameLoading}>
										<Text editable={{ onChange: changeName }}>{room}</Text>
									</Spin>
								</Col>
							</Row>
						</Col>
					</Row>
				</Col>
				{endTime && (
					<Col>
						<Row gutter={[4, 4]}>
							<Col>
								<div onClick={togglePauseModal}>
									{projectPauseStatus ? (
										<>
											<StyledTagInteractive>
												<PlayCircleOutlined />
												<span>Resume Project</span>
											</StyledTagInteractive>
											<Comment>
												<AlertOutlined />
												<span style={{ paddingLeft: "8px", verticalAlign: "middle" }}>{pauseComments}</span>
											</Comment>
										</>
									) : (
										<StyledTagInteractive>
											<PauseCircleOutlined />
											<span>Pause Project</span>
										</StyledTagInteractive>
									)}
								</div>
							</Col>
						</Row>
					</Col>
				)}

				<Col>
					<Row gutter={[4, 4]}>
						<Col>
							<StyledTag color={getTagColor(phase)}>Phase: {HumanizePhaseInternalNames[phase]}</StyledTag>
						</Col>
						<Col>
							<StyledTag color={getTagColor(status)}>Status: {status}</StyledTag>
						</Col>
					</Row>
				</Col>

				<Col>
					{endTime ? (
						<Row align='middle' gutter={[16, 8]}>
							<Col>
								<ProgressBar phase={phase} size={22} days={daysLeft} />
							</Col>
							<Col>
								<Text>
									Ends on: {moment(endTime).format("MM-DD-YYYY")} at {moment(endTime).format("HH:mm")}
								</Text>
							</Col>
						</Row>
					) : (
						<Button type='primary' onClick={onStartClick}>
							Start Project
						</Button>
					)}
				</Col>
				{endTime && (
					<Col>
						{!isDelayed ? (
							<Popconfirm
								onConfirm={onDelayConfirm}
								title={
									<Row gutter={[16, 16]}>
										<Col>Set delay details</Col>
										<Col>
											<Row gutter={[8, 8]}>
												<Col span={12}>
													<Row gutter={[4, 4]}>
														<Col>
															<Text>Min</Text>
														</Col>
														<Col>
															<Input type='number' onChange={onDelayValueChange} value={delayValue.min} name='min' />
														</Col>
													</Row>
												</Col>
												<Col span={12}>
													<Row gutter={[4, 4]}>
														<Col>
															<Text>Max</Text>
														</Col>
														<Col>
															<Input type='number' onChange={onDelayValueChange} value={delayValue.max} name='max' />
														</Col>
													</Row>
												</Col>
												<Col span={24}>
													<Row gutter={[4, 4]}>
														<Col>
															<Text>Notify Customer</Text>
														</Col>
														<Col>
															<Radio.Group
																value={delayValue.notifyCustomer}
																onChange={onDelayValueChange}
																name='notifyCustomer'
															>
																<Radio value>Yes</Radio>
																<Radio value={false}>No</Radio>
															</Radio.Group>
														</Col>
													</Row>
												</Col>
											</Row>
										</Col>
									</Row>
								}
							>
								<Button type='primary'>Delay Project</Button>
							</Popconfirm>
						) : (
							<Tag color='red'>
								Delayed by {delayValue.min} - {delayValue.max} days
							</Tag>
						)}
					</Col>
				)}
				<Col>
					<Text>
						<CloseCircleTwoTone
							style={{ fontSize: "2.5rem" }}
							onClick={() => {
								router.push("/dashboard");
								setProjectData(null);
							}}
						/>
					</Text>
				</Col>
			</Row>
			<PauseProjectModal
				visible={isPauseModalOpen}
				onOk={updateProjectStatus}
				onCancel={closePauseModal}
				currentPauseStatus={projectPauseStatus}
			/>
		</VerticallyPaddedDiv>
	);
};

export default ProjectSummary;
