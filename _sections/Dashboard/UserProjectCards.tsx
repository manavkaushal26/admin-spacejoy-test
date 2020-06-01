import SidebarCard from "@components/SidebarCards";
import { UserProjectType, PhaseInternalNames } from "@customTypes/dashboardTypes";
import { getColorsForPackages, getValueSafely, convertMillisecondsToDays } from "@utils/commonUtils";
import React, { useMemo } from "react";
import moment from "moment";

const UserProjectCard: React.FC<{
	userProjectData: UserProjectType;
	handleSelectCard: (user: string) => void;
	selectedUser: string;
}> = ({ userProjectData, handleSelectCard, selectedUser }) => {
	const {
		_id: projectId,
		name: room,
		startedAt,
		customerName,
		currentPhase: {
			name: { internalName: phase },
			startTime: phaseStartTime,
		},
		quizStatus,
		delay: { isDelayed, minDurationInMs, maxDurationInMs },
		endedAt,
		status,
	} = userProjectData;

	const items = getValueSafely(() => userProjectData.order.items, []);
	const minDelay = convertMillisecondsToDays(minDurationInMs);
	const maxDelay = convertMillisecondsToDays(maxDurationInMs);

	const delayText = `${minDelay} - ${maxDelay}`;
	const subHeading = room.replace(" Design", "");

	// --------------------endTime Calculation--------------------------

	const endTime = useMemo(() => {
		if (phase === PhaseInternalNames.designsInRevision) {
			return moment(phaseStartTime).add(5 + maxDelay, "days");
		}
		if (endedAt) {
			return moment(endedAt).add(maxDelay, "days");
		}
		return null;
	}, [endedAt, startedAt]);

	const duration = moment.duration((endTime || moment()).diff(moment()));
	const daysLeft = duration.get("days");

	// --------------------endTime Calculation--------------------------

	const quizCompletionStatus = quizStatus?.currentState;

	return (
		<SidebarCard
			isDelayed={isDelayed}
			delayText={delayText}
			avatarText={getValueSafely(() => items.map(item => item.name)[0][0], "N/A")}
			title={getValueSafely(() => customerName, "N/A")}
			subHeading={subHeading}
			phase={phase}
			endTime={endTime}
			avatarStyle={getColorsForPackages(items)}
			uniqueId={projectId}
			daysLeft={daysLeft}
			status={status}
			onClick={handleSelectCard}
			selectedId={selectedUser}
			quizCompletionStatus={quizCompletionStatus}
		/>
	);
};

export default UserProjectCard;
