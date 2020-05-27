import SidebarCard from "@components/SidebarCards";
import { UserProjectType, PhaseInternalNames } from "@customTypes/dashboardTypes";
import { getColorsForPackages, getNumberOfDays, getValueSafely, convertMillisecondsToDays } from "@utils/commonUtils";
import React from "react";

const UserProjectCard: React.FC<{
	userProjectData: UserProjectType;
	handleSelectCard: (user: string) => void;
	selectedUser: string;
	index: number;
}> = ({ userProjectData, handleSelectCard, index, selectedUser }) => {
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
	)} days`;

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
		index,
		endedAt,
		avatarStyle: getColorsForPackages(items),
		onClick: handleSelectCard,
		selectedId: selectedUser,
		noOfDays,
	};

	return <SidebarCard {...sidebarData} />;
};

export default UserProjectCard;
