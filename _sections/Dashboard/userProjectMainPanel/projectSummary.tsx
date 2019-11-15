import React from "react";
import { UserProjectType } from "@customTypes/dashboardTypes";
import { Row, Col, Avatar, Typography} from "antd";
import styled from "styled-components";
import ProgressBar from "@sections/Dashboard/progressBar";
import { StyledTag, VerticalPaddedDiv } from "../styled";
import moment from "moment";

const { Title } = Typography;

interface ProjectSummaryProps {
	userProjectData: UserProjectType;
}

const SilentTitle = styled(Title)`
	margin-bottom: 0 !important;
`;

const getLongTimeString = (endTime: number): string => {
	const duration = moment.duration(moment(endTime).diff(moment()));
	return `${duration.get("days")} Days, ${duration.get("hours")} Hours left`;
};

const ProjectSummary: React.FC<ProjectSummaryProps> = ({ userProjectData }): JSX.Element => {
	const { phase, task, status, avatar, name } = userProjectData;

	return (
		<Row type="flex" align="middle" gutter={1}>
			<Col sm={24} md={24} lg={10} xl={7}>
				<VerticalPaddedDiv>
					<Row type="flex" justify="space-between" align="middle">
						<Col span={4}>
							<Avatar size={48} src={avatar}>
								{name[0]}
							</Avatar>
						</Col>
						<Col span={19}>
							<SilentTitle level={2}>{name}</SilentTitle>
						</Col>
					</Row>
				</VerticalPaddedDiv>
			</Col>
			<Col sm={24} md={24} lg={14} xl={8}>
				<VerticalPaddedDiv>
					<Col span={8}>
						<StyledTag color="magenta">Phase: {phase}</StyledTag>
					</Col>
					<Col span={8}>
						<StyledTag>Status: {status}</StyledTag>
					</Col>
					<Col span={8}>
						<StyledTag>Task: {task}</StyledTag>
					</Col>
				</VerticalPaddedDiv>
			</Col>
			<Col sm={24} md={24} lg={12} xl={8}>
				<VerticalPaddedDiv>
						<Row align="middle" type="flex" justify="center">
							<Col span={6}>
								<ProgressBar width={33} status={status} endTime={endTime} />
							</Col>
							<Col span={16}>{getLongTimeString(endTime)}</Col>
						</Row>
				</VerticalPaddedDiv>
			</Col>
		</Row>
	);
};

export default ProjectSummary;
