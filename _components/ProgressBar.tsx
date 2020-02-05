import { Status } from "@customTypes/userType";
import { projectConfig } from "@utils/config";
import { Progress } from "antd";
import moment, { Moment } from "moment";
import React from "react";
import { completedPhases, PhaseInternalNames } from "@customTypes/dashboardTypes";

interface ProgressBarProps {
	phase: PhaseInternalNames;
	endTime: Moment;
	width?: number;
}

const getProgressBarText = (days: number): string => {
	const displayDays = days < 0 ? 0 : days;
	return `${displayDays}`;
};

const ProgressBar: React.FC<ProgressBarProps> = ({ phase, endTime, width = 33 }): JSX.Element => {
	const duration = moment.duration(endTime.diff(moment()));
	const days = duration.get("days");
	const progressPercentage = (days / projectConfig.lifetime) * 100;
	let progressStatus: "normal" | "exception" = "normal";
	if (completedPhases.includes(phase)) {
		return <Progress percent={100} type="circle" width={width} />;
	}
	if (days < 0) {
		progressStatus = "exception";
	}
	return (
		<Progress
			trailColor={progressStatus === "exception" ? `#f30000` : ""}
			percent={progressStatus === "exception" ? 100 : progressPercentage}
			status={progressStatus}
			format={() => getProgressBarText(days)}
			type="circle"
			width={width}
		/>
	);
};

export default ProgressBar;
