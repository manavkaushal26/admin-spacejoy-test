import React from "react";
import { Card, Row, Tag, Col, Avatar, Typography, Skeleton } from "antd";
import { UserProjectType } from "@customTypes/dashboardTypes";
import styled, { css } from "styled-components";
import ProgressBar from "@sections/Dashboard/progressBar";
import { CustomDiv, StyledTag } from "./styled";
import moment from "moment";
import { getValueSafely } from "@utils/commonUtils";
const { Text } = Typography;

const UserCard = styled(Card)<{active: boolean}>`
	background: transparent;
	border: none;
	${({active}) => active && css`
		background: ${({theme})=>theme.colors.mild.antblue};
		border-right: 3px solid ${({theme})=>theme.colors.antblue};
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
	`};
	:hover {
			background: ${({theme})=>theme.colors.mild.antblue};
			border-right: 3px solid ${({theme})=>theme.colors.antblue};
			}
`;

import { projectConfig } from '@utils/config';

const UserProjectCard = ({
	userProjectData,
	handleSelectCard,
	selectedUser,
}: {
	userProjectData: UserProjectType;
	handleSelectCard: (user: string) => void;
	selectedUser: string;
}) => {
	const {
		name: room,
		status,
		currentPhase: {
			name: { internalName: phase }
		},
		createdAt
	} = userProjectData;
	console.log(createdAt);
	return (
		<UserCard
			size='small'
			active={selectedUser===userProjectData._id}
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
						<CustomDiv width="15%"  overflow="visible">
							<Avatar>{getValueSafely<string>(()=>{return room[0]}, 'N/A').toUpperCase()}</Avatar>
						</CustomDiv>
						<CustomDiv width="75%">
							<Text strong><CustomDiv width="100%" textTransform="capitalize">{getValueSafely<string>(()=>{return room}, 'N/A')}</CustomDiv></Text>
						</CustomDiv>
						<CustomDiv width="10%" justifyContent="flex-end" type='flex' inline>
							<ProgressBar
								status={status}
								endTime={moment(createdAt)
									.add(projectConfig.lifetime, "days")}
								width={30}
							/>
						</CustomDiv>
					</Row>
				</CustomDiv>

				<Row type="flex"  gutter={1}>
					<Col span={24}>
						<Row type="flex">
								<CustomDiv width="15%"/>
								<StyledTag color="magenta">Phase: {phase}</StyledTag>
								<StyledTag>Status: {status}</StyledTag>
						</Row>
					</Col>
				</Row>
			</Row>
		</UserCard>
	);
};

export default UserProjectCard;
