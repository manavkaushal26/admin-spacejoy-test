import { DetailedProject, HumanizePhaseInternalNames } from "@customTypes/dashboardTypes";
import { Status } from "@customTypes/userType";
import ProgressBar from "@sections/Dashboard/ProgressBar";
import { getValueSafely, getNumberOfDays, getColorsForPackages } from "@utils/commonUtils";
import { Avatar, Col, Row, Typography } from "antd";
import moment from "moment";
import React from "react";
import styled from "styled-components";
import { CustomDiv, getTagColor, StyledTag } from "../styled";

const { Title, Text } = Typography;

interface ProjectSummaryProps {
	projectData?: Partial<DetailedProject>;
}

const SilentTitle = styled(Title)`
	text-transform: capitalize;
	margin-bottom: 0 !important;
`;

const getLongTimeString = (endTime: number): string => {
	const duration = moment.duration(moment(endTime).diff(moment()));
	const days = duration.get("days") >= 0 ? duration.get("days") : 0;
	const hours = duration.get("hours") >= 0 ? duration.get("hours") : 0;

	return `${days} Days, ${hours} Hours left`;
};

const ProjectSummary: React.FC<ProjectSummaryProps> = ({ projectData }): JSX.Element => {
	// const { phase, task, status, avatar, name } = userProjectData;
	const {
		name: room,
		status,
		customer,
		createdAt,
		startedAt,
		currentPhase: {
			name: { internalName: phase },
		},
		order: { items },
	} = projectData;

	const endTime = startedAt
		? moment(startedAt).add(getNumberOfDays(items), "days")
		: moment(createdAt).add(getNumberOfDays(items), "days");

	const displayName = getValueSafely(() => {
		return customer.profile.name;
	}, room);
	return (
		<Row type="flex" align="middle" gutter={1}>
			<Col sm={24} md={24} lg={24} xl={10}>
				<CustomDiv width="100%" inline type="flex" textOverflow="ellipsis" py="16px" align="center">
					<CustomDiv textOverflow="ellipsis" inline type="flex" px="12px">
						<Avatar size={48} style={getColorsForPackages(items)}>
							{displayName[0].toUpperCase()}
						</Avatar>{" "}
					</CustomDiv>
					<CustomDiv type="flex" inline flexDirection="column">
						<SilentTitle ellipsis level={3}>
							{displayName}
						</SilentTitle>
						<Text>{room}</Text>
					</CustomDiv>
				</CustomDiv>
			</Col>
			<Col sm={24} md={12} lg={12} xl={6}>
				<CustomDiv width="100%" py="16px">
					<StyledTag color={getTagColor(phase)}>Phase: {HumanizePhaseInternalNames[phase]}</StyledTag>
					<StyledTag color={getTagColor(status)}>Status: {status}</StyledTag>
				</CustomDiv>
			</Col>
			<Col sm={24} md={12} lg={12} xl={8}>
				<CustomDiv width="100%" py="16px">
					<Row align="middle" type="flex" justify="center">
						<Col span={24}>
							<CustomDiv px="12px" type="flex" inline>
								<ProgressBar width={33} status={Status.active} endTime={endTime} />
							</CustomDiv>
							<Text>{getLongTimeString(endTime.valueOf())}</Text>
						</Col>
					</Row>
				</CustomDiv>
			</Col>
		</Row>
	);
};

export default ProjectSummary;
