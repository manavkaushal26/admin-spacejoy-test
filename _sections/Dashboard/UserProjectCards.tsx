import SidebarCard from "@components/SidebarCards";
import { UserProjectType, PhaseInternalNames } from "@customTypes/dashboardTypes";
import { getColorsForPackages, getNumberOfDays, getValueSafely, convertMillisecondsToDays } from "@utils/commonUtils";
import React from "react";

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
			startTime: phaseStartTime,
		},
		delay: { isDelayed, minDurationInMs, maxDurationInMs },
		endedAt,
		status,
	} = userProjectData;

	const items = getValueSafely(() => userProjectData.order.items, []);

	const delayText = `Delayed by ${convertMillisecondsToDays(minDurationInMs)} - ${convertMillisecondsToDays(
		maxDurationInMs
	)}`;

	const startedTime = startedAt;
	const noOfDays = phase === PhaseInternalNames.designsInRevision ? 5 : getNumberOfDays(items);
	const sidebarData = {
		isDelayed,
		delayText,
		avatarText: getValueSafely(() => items.map(item => item.name)[0][0], "N/A"),
		title: getValueSafely(() => customerName, "N/A"),
		subHeading: room,
		uniqueId: projectId,
		phase,
		startedAt: startedTime,
		phaseStartTime,
		status,
		endedAt,
		avatarStyle: getColorsForPackages(items),
		onClick: handleSelectCard,
		selectedId: selectedUser,
		onStartClick,
		noOfDays,
	};

	return <SidebarCard {...sidebarData} />;
};

export default UserProjectCard;
