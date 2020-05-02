import ProgressBar from "@components/ProgressBar";
import { DetailedProject, HumanizePhaseInternalNames, PhaseInternalNames } from "@customTypes/dashboardTypes";
import {
	getColorsForPackages,
	getValueSafely,
	convertDaysToMilliseconds,
	convertMillisecondsToDays,
} from "@utils/commonUtils";
import { Avatar, Col, Row, Typography, Button, Popconfirm, Input, notification, Icon, Radio, Tag } from "antd";
import moment from "moment";
import React, { useMemo, useState, useEffect } from "react";
import styled from "styled-components";
import { delayProjectApi } from "@api/projectApi";
import fetcher from "@utils/fetcher";
import { getTagColor, StyledTag } from "../styled";

const { Title, Text } = Typography;

interface ProjectSummaryProps {
	projectData?: DetailedProject;
	setProjectData?: React.Dispatch<React.SetStateAction<DetailedProject>>;
}

const SilentTitle = styled(Title)`
	text-transform: capitalize;
	margin-bottom: 0 !important;
`;

const VerticallyPaddedDiv = styled.div`
	padding: 1.5rem 0 0 0;
`;

const ProjectSummary: React.FC<ProjectSummaryProps> = ({ projectData, setProjectData }): JSX.Element => {
	// const { phase, task, status, avatar, name } = userProjectData;
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
	} = projectData;

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
			return moment(phaseStartTime).add(5, "days");
		}
		if (endedAt) {
			return moment(endedAt);
		}
		return null;
	}, [endedAt, startedAt]);
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
			icon: <Icon type="loading" />,
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
						icon: <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />,
						description: "Delay has been set Successfully",
					});
				}
			} catch (e) {
				notification.open({
					key: "Delay",
					message: "Error",
					icon: <Icon type="close-circle" theme="twoTone" twoToneColor="#f5222d" />,
					description: "There was a problem setting delay",
				});
			}
		} else {
			notification.open({
				key: "Delay",
				message: "Error",
				icon: <Icon type="close-circle" theme="twoTone" twoToneColor="#f5222d" />,
				description: "There was a problem setting delay",
			});
		}
	};

	const isDelayed = getValueSafely(() => projectData.delay.isDelayed, false);
	return (
		<VerticallyPaddedDiv>
			<Row type="flex" justify="space-between" align="middle" gutter={[8, 8]}>
				<Col offset={1}>
					<Row type="flex" gutter={[16, 8]}>
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
									<Text>{room}</Text>
								</Col>
							</Row>
						</Col>
					</Row>
				</Col>
				<Col>
					<Row type="flex" gutter={[4, 4]}>
						<Col>
							<StyledTag color={getTagColor(phase)}>Phase: {HumanizePhaseInternalNames[phase]}</StyledTag>
						</Col>
						<Col>
							<StyledTag color={getTagColor(status)}>Status: {status}</StyledTag>
						</Col>
					</Row>
				</Col>
				<Col>
					{endTime && (
						<Row align="middle" type="flex" gutter={[16, 8]}>
							<Col>
								<ProgressBar width={33} phase={phase} endTime={endTime} />
							</Col>
							<Col>
								<Text>
									Ends on:{" "}
									{moment(endTime)
										.add(delayValue.max, "days")
										.format("MM-DD-YYYY")}{" "}
									at {moment(endTime).format("HH:mm")}
								</Text>
							</Col>
						</Row>
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
															<Input type="number" onChange={onDelayValueChange} value={delayValue.min} name="min" />
														</Col>
													</Row>
												</Col>
												<Col span={12}>
													<Row gutter={[4, 4]}>
														<Col>
															<Text>Max</Text>
														</Col>
														<Col>
															<Input type="number" onChange={onDelayValueChange} value={delayValue.max} name="max" />
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
																name="notifyCustomer"
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
								<Button type="primary">Delay Project</Button>
							</Popconfirm>
						) : (
							<Tag color="red">
								Delayed by {delayValue.min} - {delayValue.max} days
							</Tag>
						)}
					</Col>
				)}
			</Row>
		</VerticallyPaddedDiv>
	);
};

export default ProjectSummary;
