import ProgressBar from "@components/ProgressBar";
import {
	completedPhases,
	DetailedProject,
	HumanizePhaseInternalNames,
	PhaseInternalNames,
} from "@customTypes/dashboardTypes";
import { getColorsForPackages, getNumberOfDays, getValueSafely } from "@utils/commonUtils";
import { Avatar, Col, Row, Typography } from "antd";
import moment from "moment";
import React from "react";
import styled from "styled-components";
import { getTagColor, StyledTag } from "../styled";

const { Title, Text } = Typography;

interface ProjectSummaryProps {
	projectData?: Partial<DetailedProject>;
}

const SilentTitle = styled(Title)`
	text-transform: capitalize;
	margin-bottom: 0 !important;
`;

const VerticallyPaddedDiv = styled.div`
	padding: 1.5rem 0 0 0;
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
			startTime: phaseStartedAt,
		},
	} = projectData;

	const items = getValueSafely(() => projectData.order.items, []);

	const startTime = startedAt || createdAt;

	const endTime =
		phase === PhaseInternalNames.designsInRevision
			? moment(phaseStartedAt).add(5, "days")
			: moment(startTime).add(getNumberOfDays(items), "days");
	const displayName = getValueSafely(() => {
		return customer.profile.name;
	}, room);
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
					<Row align="middle" type="flex" gutter={[16, 8]}>
						<Col>
							<ProgressBar width={33} phase={phase} endTime={endTime} />
						</Col>
						<Col>{!completedPhases.includes(phase) && <Text>{getLongTimeString(endTime.valueOf())}</Text>}</Col>
					</Row>
				</Col>
			</Row>
		</VerticallyPaddedDiv>
	);
};

export default ProjectSummary;