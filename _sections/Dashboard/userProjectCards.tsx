import React, { ReactNode } from "react";
import { Card, Row, Tag, Col, Avatar, Typography, Skeleton } from "antd";
import { UserProjectType } from "@customTypes/dashboardTypes";
import styled from "styled-components";
import ProgressBar from "@sections/Dashboard/progressBar";
import { Status } from "@customTypes/userType";
import { BottomPaddedDiv, CustomDiv } from "./styled";
import moment from "moment";
const { Text } = Typography;

const StyledTag = styled(Tag)`
	text-align: center;
	width: 100%;
	overflow: hidden;
	text-overflow: ellipsis;
`;

const UserProjectCard = ({
	userProjectData,
	handleSelectCard,
	loading = false
}: {
	userProjectData: UserProjectType;
	handleSelectCard: (user: string) => void;
	loading?: boolean;
}) => {
	const {
		name: room,
		status,
		avatar,
		currentPhase: {
			name: { internalName: phase }
		},
		customer: name
	} = userProjectData;

	return (
		<Card
			hoverable
			style={{ width: "100%" }}
			onClick={e => {
				e.preventDefault();
				handleSelectCard(userProjectData._id);
			}}
		>
			<Row>
				<CustomDiv pb="15px">
					<Row type="flex" align="middle">
						<CustomDiv width="20%">
							<Avatar src={avatar}>{name[0]}</Avatar>
						</CustomDiv>
						<CustomDiv width="60%">
							<Text strong>{name}</Text>
						</CustomDiv>
						<CustomDiv width="20%">
							<ProgressBar
								status={status}
								endTime={moment()
									.add(4, "days")
									.valueOf()}
								width={30}
							/>
						</CustomDiv>
					</Row>
				</CustomDiv>

				<Row type="flex" gutter={1}>
					<Col span={24}>
						<Row type="flex" gutter={2}>
							<Col span={8}>
								<StyledTag color="magenta">Phase: {phase}</StyledTag>
							</Col>
							<Col span={8}>
								<StyledTag>Status: {status}</StyledTag>
							</Col>
							<Col span={8}>
								<StyledTag>Task: Design</StyledTag>
							</Col>
						</Row>
					</Col>
				</Row>
			</Row>
		</Card>
	);
};

export default UserProjectCard;
