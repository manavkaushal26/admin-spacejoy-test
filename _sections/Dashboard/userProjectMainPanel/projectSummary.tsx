import React from "react";
import { UserProjectType } from "@customTypes/dashboardTypes";
import { Row, Col, Avatar, Typography } from "antd";
import styled from "styled-components";
import ProgressBar from "@sections/Dashboard/progressBar";
import { StyledTag, VerticalPaddedDiv, CustomDiv } from "../styled";
import moment from "moment";
import { Status } from "@customTypes/userType";
import { PaddedDiv } from "@sections/Header/styled";

const { Title } = Typography;

interface ProjectSummaryProps {
	userProjectData?: string;
}

const SilentTitle = styled(Title)`
	margin-bottom: 0 !important;
`;

const getLongTimeString = (endTime: number): string => {
	const duration = moment.duration(moment(endTime).diff(moment()));
	return `${duration.get("days")} Days, ${duration.get("hours")} Hours left`;
};

const ProjectSummary: React.FC<ProjectSummaryProps> = ({ userProjectData }): JSX.Element => {
	// const { phase, task, status, avatar, name } = userProjectData;
	return (
		<Row type="flex" align="middle" gutter={1}>
			<Col sm={24} md={24} lg={24} xl={8}>
				<CustomDiv py="15px">
					<Row type="flex" justify="start" align="middle">
						<CustomDiv textOverflow="initial" width="25%" inline px="10px">
							<Avatar size={48} src="{avatar}">
								{/* {name[0]} */}N
							</Avatar>
						</CustomDiv>
						<CustomDiv width="75%" inline px="5%">
							<SilentTitle level={3}>First insanely Second</SilentTitle>
						</CustomDiv>
					</Row>
				</CustomDiv>
			</Col>
			<Col sm={24} md={24} lg={12} xl={8}>
				<CustomDiv py="15px">
					<Col span={8}>
						<StyledTag color="magenta">Phase: {"phase"}</StyledTag>
					</Col>
					<Col span={8}>
						<StyledTag>Status: {"status"}</StyledTag>
					</Col>
					<Col span={8}>
						<StyledTag>Task: {"task"}</StyledTag>
					</Col>
				</CustomDiv>
			</Col>
			<Col sm={24} md={24} lg={12} xl={8}>
				<CustomDiv py="15px">
					<Row align="middle" type="flex" justify="center">
						<Col span={6}>
							<ProgressBar
								width={33}
								status={Status.active}
								endTime={moment()
									.add(2, "days")
									.valueOf()}
							/>
						</Col>
						<Col span={16}>
							{getLongTimeString(
								moment()
									.add(2, "days")
									.valueOf()
							)}
						</Col>
					</Row>
				</CustomDiv>
			</Col>
		</Row>
	);
};

export default ProjectSummary;
