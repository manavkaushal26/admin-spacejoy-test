import { HumanizePhaseInternalNames, UserProjectType, PhaseInternalNames } from "@customTypes/dashboardTypes";
import ProgressBar from "@sections/Dashboard/ProgressBar";
import { getValueSafely, getNumberOfDays, getColorsForPackages } from "@utils/commonUtils";
import { Avatar, Card, Col, Row, Typography, Button } from "antd";
import moment from "moment";
import React from "react";
import styled, { css } from "styled-components";
import { start } from "repl";
import { CustomDiv, getTagColor, StyledTag } from "./styled";

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
const initialPhases = [PhaseInternalNames.requirement, PhaseInternalNames.designConcept];

const RoomNameText = styled(Text)`
	position: relative;
	font-size: 0.8em;
	top: -3px;
`;

const UserProjectCard: React.FC<{
	userProjectData: UserProjectType;
	handleSelectCard: (user: string) => void;
	selectedUser: string;
	onStartClick: (projectId: string) => void;
}> = ({ userProjectData, handleSelectCard, selectedUser, onStartClick }) => {
	const {
		_id: projectId,
		name: room,
		startedAt,
		customerName,
		currentPhase: {
			name: { internalName: phase },
		},
		order: { items },
		status,
		createdAt,
	} = userProjectData;

	return (
		<UserCard
			size="small"
			active={selectedUser === userProjectData._id}
			hoverable
			style={{ width: "100%" }}
			onClick={e => {
				e.preventDefault();
				return handleSelectCard(userProjectData._id);
			}}
		>
			<Row>
				<CustomDiv>
					<Row type="flex" align="middle">
						<CustomDiv width="15%" overflow="visible">
							<Avatar style={getColorsForPackages(items)}>
								{getValueSafely<string>(() => {
									return customerName[0];
								}, "N/A").toUpperCase()}
							</Avatar>
						</CustomDiv>
						<CustomDiv width="75%" type="flex" flexDirection="column">
							<Text strong>
								<CustomDiv width="100%" textTransform="capitalize">
									{getValueSafely<string>(() => {
										return customerName;
									}, "N/A")}
								</CustomDiv>
							</Text>
							<RoomNameText>{room}</RoomNameText>
						</CustomDiv>
						<CustomDiv width="10%" justifyContent="flex-end" type="flex" inline>
							{initialPhases.includes(phase) && !startedAt ? (
								<Button
									onClick={e => {
										e.stopPropagation();
										onStartClick(projectId);
									}}
									style={{ padding: "0px 6px", height: "auto" }}
									type="default"
								>
									<Text>Start</Text>
								</Button>
							) : (
								<ProgressBar
									status={status}
									endTime={
										startedAt
											? moment(startedAt).add(getNumberOfDays(items), "days")
											: moment(createdAt).add(getNumberOfDays(items), "days")
									}
									width={30}
								/>
							)}
						</CustomDiv>
					</Row>
				</CustomDiv>
				<Row type="flex" gutter={1}>
					<Col span={24}>
						<CustomDiv type="flex" flexWrap="no-wrap">
							<CustomDiv width="15%" />
							<StyledTag color={getTagColor(phase)}>Phase: {HumanizePhaseInternalNames[phase]}</StyledTag>
							<StyledTag color={getTagColor(status)}>Status: {status}</StyledTag>
						</CustomDiv>
					</Col>
				</Row>
			</Row>
		</UserCard>
	);
};

export default UserProjectCard;
