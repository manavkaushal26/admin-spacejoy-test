import { LoadingOutlined } from "@ant-design/icons";
import { HumanizePhaseInternalNames, Phase, PhaseInternalNames } from "@customTypes/dashboardTypes";
import DetailText from "@sections/RenderEngine/DetailText";
import { Timeline } from "antd";
import moment from "moment";
import React from "react";
const PhaseTimeline: React.FC<{ completedPhases: Phase[]; currentPhase?: Phase }> = ({
	completedPhases,
	currentPhase,
}) => {
	return (
		<Timeline mode='left'>
			{completedPhases.map(phase => {
				return (
					<Timeline.Item color='green' position='right' key={phase._id}>
						<DetailText name='Phase' value={HumanizePhaseInternalNames[phase.name?.internalName]} />
						<DetailText name='On' value={moment(phase.startTime).format("MM-DD-YYYY")} />
					</Timeline.Item>
				);
			})}
			{currentPhase && (
				<Timeline.Item
					key={currentPhase._id}
					{...(currentPhase.name.internalName === PhaseInternalNames.designReady ||
					currentPhase.name.internalName === PhaseInternalNames.shop
						? { color: "green" }
						: { dot: <LoadingOutlined /> })}
				>
					<DetailText name='Phase' value={HumanizePhaseInternalNames[currentPhase.name?.internalName]} />
					<DetailText name='On' value={moment(currentPhase.startTime).format("MM-DD-YYYY")} />
				</Timeline.Item>
			)}
		</Timeline>
	);
};

export default PhaseTimeline;
