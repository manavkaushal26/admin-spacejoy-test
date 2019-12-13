import { UserProjectType } from "@customTypes/dashboardTypes";
import ProgressBar from "@sections/Dashboard/ProgressBar";
import { getValueSafely } from "@utils/commonUtils";
import { projectConfig } from "@utils/config";
import { Avatar, Card, Col, Row, Typography } from "antd";
import moment from "moment";
import React from "react";
import styled, { css } from "styled-components";
import { CustomDiv, StyledTag, getTagColor } from "./styled";
const { Text } = Typography;

const UserCard = styled(Card)<{ active: boolean }>`
	background: transparent;
	border: none;
	${({ active }) =>
		active &&
		css`
			background: ${({ theme }) => theme.colors.mild.antblue};
			border-right: 3px solid ${({ theme }) => theme.colors.antblue};
			box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
		`};
	:hover {
		background: ${({ theme }) => theme.colors.mild.antblue};
		border-right: 3px solid ${({ theme }) => theme.colors.antblue};
	}
`;

const UserProjectCard = ({
	userProjectData,
	handleSelectCard,
	selectedUser
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
	return (
		<UserCard
			size="small"
			active={selectedUser === userProjectData._id}
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
						<CustomDiv width="15%" overflow="visible">
							<Avatar>
								{getValueSafely<string>(() => {
									return room[0];
								}, "N/A").toUpperCase()}
							</Avatar>
						</CustomDiv>
						<CustomDiv width="75%">
							<Text strong>
								<CustomDiv width="100%" textTransform="capitalize">
									{getValueSafely<string>(() => {
										return room;
									}, "N/A")}
								</CustomDiv>
							</Text>
						</CustomDiv>
						<CustomDiv width="10%" justifyContent="flex-end" type="flex" inline>
							<ProgressBar status={status} endTime={moment(createdAt).add(projectConfig.lifetime, "days")} width={30} />
						</CustomDiv>
					</Row>
				</CustomDiv>

				<Row type="flex" gutter={1}>
					<Col span={24}>
						<CustomDiv type="flex" wrap="no-wrap">
							<CustomDiv width="15%" />
							<StyledTag color={getTagColor(phase)}>Phase: {phase}</StyledTag>
							<StyledTag color={getTagColor(status)}>Status: {status}</StyledTag>
						</CustomDiv>
					</Col>
				</Row>
			</Row>
		</UserCard>
	);
};

export default UserProjectCard;
