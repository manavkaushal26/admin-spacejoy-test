import SidebarCard from "@components/SidebarCards";
import { UserProjectType, PhaseInternalNames } from "@customTypes/dashboardTypes";
import { getColorsForPackages, getNumberOfDays, getValueSafely } from "@utils/commonUtils";
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
		status,
	} = userProjectData;

	const items = getValueSafely(() => userProjectData.order.items, []);

	const startedTime = phase === PhaseInternalNames.designsInRevision ? phaseStartTime : startedAt;
	const noOfDays = phase === PhaseInternalNames.designsInRevision ? 5 : getNumberOfDays(items);
	const sidebarData = {
		avatarText: getValueSafely(() => items[0][0], "N/A"),
		title: getValueSafely(() => customerName, "N/A"),
		subHeading: room,
		uniqueId: projectId,
		phase,
		startedAt: startedTime,
		status,
		avatarStyle: getColorsForPackages(items),
		onClick: handleSelectCard,
		selectedId: selectedUser,
		onStartClick,
		noOfDays,
	};

	return <SidebarCard {...sidebarData} />;
};

export default UserProjectCard;
