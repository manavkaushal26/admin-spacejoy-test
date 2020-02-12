import { DetailedDesign, PhaseType } from "@customTypes/dashboardTypes";
import { CustomDiv } from "@sections/Dashboard/styled";
import RoomUploadStep from "@sections/Dashboard/userProjectMainPanel/pipelineTab/Stage/RoomUploadStep";
import { StepDiv } from "@sections/Dashboard/userProjectMainPanel/pipelineTab/styled";
import { Typography } from "antd";
import React from "react";
import Design3D from "./Design3D";
import DesignFinalization from "./DesignFinalization";
import MoodboardAndFloorPlanStep from "./MoodboardAndFloorPlanStep";
import RenderStep from "./RenderStep";

const { Text } = Typography;
interface Stage {
	designData: DetailedDesign;
	phaseData: PhaseType;
	stage: string;
	setDesignData: React.Dispatch<React.SetStateAction<DetailedDesign>>;
	projectId: string;
}

export default function Stage(props: Stage): JSX.Element {
	const { designData, phaseData, stage, setDesignData, projectId } = props;

	switch (stage) {
		case "concept":
			return <MoodboardAndFloorPlanStep designData={designData} setDesignData={setDesignData} />;
		case "modelling":
			return <RoomUploadStep projectId={projectId} designData={designData} setDesignData={setDesignData} />;
		case "design3D":
			return <Design3D />;
		case "render":
			return <RenderStep designData={designData} setDesignData={setDesignData} phaseData={phaseData} />;
		case "revision":
			return <DesignFinalization designData={designData} setDesignData={setDesignData} />;
		default:
			return (
				<CustomDiv px="1rem" py="1rem">
					<StepDiv>
						<CustomDiv type="flex" justifyContent="center">
							<Text>Work in Progress</Text>
						</CustomDiv>
					</StepDiv>
				</CustomDiv>
			);
	}
}
