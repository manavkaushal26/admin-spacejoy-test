import { editDesignApi, uploadRenderImages } from "@api/pipelineApi";
import Image from "@components/Image";
import {
	DesignerImageComments,
	DesignImagesInterface,
	DetailedDesign,
	PhaseType,
	RenderImgUploadTypes
} from "@customTypes/dashboardTypes";
import { Status } from "@customTypes/userType";
import { CustomDiv } from "@sections/Dashboard/styled";
import RoomUploadStep from "@sections/Dashboard/userProjectMainPanel/pipelineTab/Stage/RoomUploadStep";
import { StepDiv } from "@sections/Dashboard/userProjectMainPanel/pipelineTab/styled";
import { getValueSafely } from "@utils/commonUtils";
import { cookieNames } from "@utils/config";
import fetcher from "@utils/fetcher";
import getCookie from "@utils/getCookie";
import { Button, Icon, Input, message, Select, Typography, Upload } from "antd";
import { UploadChangeParam, UploadFile } from "antd/lib/upload/interface";
import React, { useEffect, useMemo, useRef, useState } from "react";
import ImageCommentDrawer from "./Components/ImageCommentsDrawer";
import MoodboardAndFloorPlanStep from "./MoodboardAndFloorPlanStep";
import RenderStep from "./RenderStep";
import DesignFinalization from "./DesignFinalization";
import Design3D from "./Design3D";

const { Title, Text } = Typography;
const { Option } = Select;
interface Stage {
	designData: DetailedDesign;
	phaseData: PhaseType;
	stage: string;
}

export default function Stage(props: Stage): JSX.Element {
	const { designData, phaseData, stage } = props;

	const [designDataCopy, setDesignDataCopy] = useState<DetailedDesign>(designData);

	switch (stage) {
		case "concept":
			return <MoodboardAndFloorPlanStep designDataCopy={designDataCopy} setDesignDataCopy={setDesignDataCopy} />;
		case "modelling":
			return <RoomUploadStep designDataCopy={designDataCopy} />;
		case "design3D":
			return <Design3D />;
		case "render":
			return <RenderStep designDataCopy={designDataCopy} setDesignDataCopy={setDesignDataCopy} phaseData={phaseData} />;
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
