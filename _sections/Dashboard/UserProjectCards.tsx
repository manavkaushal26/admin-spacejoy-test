import { HumanizePhaseInternalNames, PhaseInternalNames, UserProjectType } from "@customTypes/dashboardTypes";
import ProgressBar from "@components/ProgressBar";
import { getColorsForPackages, getNumberOfDays, getValueSafely } from "@utils/commonUtils";
import { Avatar, Button, Card, Col, Row, Typography } from "antd";
import moment from "moment";
import React from "react";
import styled, { css } from "styled-components";

import SidebarCard from "@components/SidebarCards";
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
		status,
	} = userProjectData;

	const items = getValueSafely(() => userProjectData.order.items, []);

	const sidebarData = {
		avatarText: getValueSafely(() => customerName[0], "N/A"),
		title: getValueSafely(() => customerName, "N/A"),
		subHeading: room,
		uniqueId: projectId,
		phase,
		startedAt,
		status,
		avatarStyle: getColorsForPackages(items),
		onClick: handleSelectCard,
		selectedId: selectedUser,
		onStartClick,
		noOfDays: getNumberOfDays(items),
	};

	return <SidebarCard {...sidebarData} />;
};

export default UserProjectCard;
