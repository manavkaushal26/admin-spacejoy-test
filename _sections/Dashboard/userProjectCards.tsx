import React, { ReactNode } from "react";
import { Card, Row, Tag, Col, Avatar, Typography, Skeleton } from "antd";
import { UserProjectType } from "@customTypes/dashboardTypes";
import styled from "styled-components";
import ProgressBar from "@sections/Dashboard/progressBar";
import { Status } from "@customTypes/userType";
import { BottomPaddedDiv } from "./styled";
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
			<Skeleton loading={loading}>
				<Row>
					<BottomPaddedDiv>
						<Row type="flex" align="middle">
							<Col span={4}>
								<Avatar src={avatar}>{name[0]}</Avatar>
							</Col>
							<Col span={20}>
								<Row type="flex" align="middle" justify="space-between">
									<Text strong>{name}</Text>
									<ProgressBar status={status} endTime={moment().add(4, 'days').valueOf()} width={30}/>
								</Row>
							</Col>
						</Row>
					</BottomPaddedDiv>

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
			</Skeleton>
		</Card>
	);
};

export default UserProjectCard;
