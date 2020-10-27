import { DetailedDesign, PhaseType } from "@customTypes/dashboardTypes";
import { Status } from "@customTypes/userType";
import RoomUploadStep from "@sections/Dashboard/userProjectMainPanel/pipelineTab/Stage/RoomUploadStep";
import { StepDiv } from "@sections/Dashboard/userProjectMainPanel/pipelineTab/styled";
import { Row, Typography } from "antd";
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
	updateDesignState: (currentStage, status: Status | "reset", e: any) => Promise<void>;
}

export default function Stage(props: Stage): JSX.Element {
	const { designData, phaseData, stage, setDesignData, projectId, updateDesignState } = props;

	switch (stage) {
		case "concept":
			return (
				<MoodboardAndFloorPlanStep
					updateDesignState={updateDesignState}
					designData={designData}
					setDesignData={setDesignData}
				/>
			);
		case "modelling":
			return (
				<RoomUploadStep
					updateDesignState={updateDesignState}
					projectId={projectId}
					designData={designData}
					setDesignData={setDesignData}
				/>
			);
		case "design3D":
			return <Design3D designData={designData} setDesignData={setDesignData} />;
		case "render":
			return <RenderStep designData={designData} setDesignData={setDesignData} phaseData={phaseData} />;
		case "revision":
			return <DesignFinalization designData={designData} />;
		default:
			return (
				<StepDiv>
					<Row justify='center'>
						<Text strong>Work in Progress</Text>
					</Row>
				</StepDiv>
			);
	}
}
