import { DetailedDesign, PhaseType } from "@customTypes/dashboardTypes";
import { CustomDiv } from "@sections/Dashboard/styled";
import RoomUploadStep from "@sections/Dashboard/userProjectMainPanel/pipelineTab/Stage/RoomUploadStep";
import { StepDiv } from "@sections/Dashboard/userProjectMainPanel/pipelineTab/styled";
import { Select, Typography } from "antd";
import React, { useState } from "react";
import Design3D from "./Design3D";
import DesignFinalization from "./DesignFinalization";
import MoodboardAndFloorPlanStep from "./MoodboardAndFloorPlanStep";
import RenderStep from "./RenderStep";

const { Title, Text } = Typography;
const { Option } = Select;
interface Stage {
	designData: DetailedDesign;
	phaseData: PhaseType;
	stage: string;
	refetchDesignData: () => void;
}

export default function Stage(props: Stage): JSX.Element {
	const { designData, phaseData, stage, refetchDesignData } = props;

	const [designDataCopy, setDesignDataCopy] = useState<DetailedDesign>(designData);

	switch (stage) {
		case "concept":
			return (
				<MoodboardAndFloorPlanStep
					refetchDesignData={refetchDesignData}
					designDataCopy={designDataCopy}
					setDesignDataCopy={setDesignDataCopy}
				/>
			);
		case "modelling":
			return <RoomUploadStep designDataCopy={designDataCopy} />;
		case "design3D":
			return <Design3D />;
		case "render":
			return (
				<RenderStep
					refetchDesignData={refetchDesignData}
					designDataCopy={designDataCopy}
					setDesignDataCopy={setDesignDataCopy}
					phaseData={phaseData}
				/>
			);
		case "revision":
			return <DesignFinalization designDataCopy={designData} setDesignDataCopy={setDesignDataCopy} />;
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
