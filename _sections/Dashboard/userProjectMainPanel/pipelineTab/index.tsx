import { DetailedDesign } from "@customTypes/dashboardTypes";
import { CustomDiv, ShadowDiv, StepsContainer } from "@sections/Dashboard/styled";
import { Avatar, Typography } from "antd";
import React, { useState } from "react";
import Stage from "./Stage";

const { Title, Text } = Typography;

interface PipelineTab {
	designData: DetailedDesign;
	refetchDesignData: () => void;
}

export default function PipelineTab({ designData, refetchDesignData }: PipelineTab): JSX.Element {
	const [stage, setStage] = useState<string>(null);

	const onClick = step => {
		if (stage === step) {
			setStage(null);
		} else setStage(step);
	};

	return (
		<div>
			<Title level={2}>Task Overview</Title>
			<StepsContainer>
				<ShadowDiv onClick={onClick.bind(null, "assets")}>
					<CustomDiv px="1.5rem" py="1.5rem">
						<CustomDiv inline pr="0.5rem">
							<Avatar>1</Avatar>
						</CustomDiv>
						<Text strong>Upload Room and Assets</Text>
					</CustomDiv>
				</ShadowDiv>
				{stage === "assets" && <Stage designData={designData} refetchDesignData={refetchDesignData} stage={stage} />}
				<ShadowDiv onClick={onClick.bind(null, "3dstep")}>
					<CustomDiv px="1.5rem" py="1.5rem">
						<CustomDiv inline pr="0.5rem">
							<Avatar>2</Avatar>
						</CustomDiv>
						<Text strong>Design in 3D app</Text>
					</CustomDiv>
				</ShadowDiv>
				{stage === "3dstep" && <Stage designData={designData} refetchDesignData={refetchDesignData} stage={stage} />}
				<ShadowDiv onClick={onClick.bind(null, "render")}>
					<CustomDiv px="1.5rem" py="1.5rem">
						<CustomDiv inline pr="0.5rem">
							<Avatar>3</Avatar>
						</CustomDiv>
						<Text strong>Render Design</Text>
					</CustomDiv>
				</ShadowDiv>
				{stage === "render" && <Stage designData={designData} refetchDesignData={refetchDesignData} stage={stage} />}
				<ShadowDiv onClick={onClick.bind(null, "send")}>
					<CustomDiv px="1.5rem" py="1.5rem">
						<CustomDiv inline pr="0.5rem">
							<Avatar>4</Avatar>
						</CustomDiv>
						<Text strong>Mark Design as complete</Text>
					</CustomDiv>
				</ShadowDiv>
				{stage === "send" && <Stage designData={designData} refetchDesignData={refetchDesignData} stage={stage} />}
			</StepsContainer>
		</div>
	);
}
