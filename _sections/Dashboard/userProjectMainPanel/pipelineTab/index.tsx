import { DetailedDesign } from "@customTypes/dashboardTypes";
import { CustomDiv, ShadowDiv, StepsContainer } from "@sections/Dashboard/styled";
import { Avatar, Typography, Button } from "antd";
import React, { useState } from "react";
import Stage from "./Stage";
import { Status } from "@customTypes/userType";
import { getValueSafely } from "@utils/commonUtils";
import { render } from "react-dom";
import { read } from "fs";
import styled, { css } from "styled-components";

const { Title, Text } = Typography;

interface PipelineTab {
	designData: DetailedDesign;
	refetchDesignData: () => void;
}

const getButtonText = (status: Status) => {
	if (status === Status.pending) {
		return "Start";
	}
	if (status === Status.completed) {
		return "Completed";
	}
	if (status === Status.active) {
		return "Mark as Complete";
	}
	return "Contact Shubam";
};

const StatusButton = styled(Button)<{ status: Status }>`
	:disabled {
		:hover {
			background-color: #d0fcbd;
			border-color: #d0fcbd;
			color: rgba(0, 0, 0, 0.65);
		}
		background-color: #d0fcbd;
		border-color: #d0fcbd;

		color: rgba(0, 0, 0, 0.65);
	}
	${({ status }) => {
		if (status === Status.completed) {
			return css`
				background-color: #d0fcbd;
				color: rgba(0, 0, 0, 0.65);
			`;
		}
	}}
`;

export default function PipelineTab({ designData, refetchDesignData }: PipelineTab): JSX.Element {
	const [stage, setStage] = useState<string>(null);

	const onClick = step => {
		if (stage === step) {
			setStage(null);
		} else setStage(step);
	};

	const phaseData = designData.phase;

	const conceptStatus = getValueSafely(() => phaseData.concept.status, Status.completed);
	const design3DStatus = getValueSafely(() => phaseData.design3D.status, Status.completed);
	const renderStatus = getValueSafely(() => phaseData.render.status, Status.completed);
	const readyStatus = getValueSafely(() => phaseData.ready.status, Status.completed);

	return (
		<div>
			<Title level={2}>Task Overview</Title>
			<StepsContainer>
				<ShadowDiv onClick={onClick.bind(null, "assets")}>
					<CustomDiv inline px="1.5rem" py="1.5rem">
						<CustomDiv inline pr="0.5rem">
							<Avatar>1</Avatar>
						</CustomDiv>
						<Text strong>Upload Room and Assets</Text>
					</CustomDiv>
					<CustomDiv flexBasis="25ch" inline px="1.5rem" py="1.5rem">
						<StatusButton block status={conceptStatus} type="primary" disabled={conceptStatus === Status.completed}>
							{getButtonText(conceptStatus)}
						</StatusButton>
					</CustomDiv>
				</ShadowDiv>
				{stage === "assets" && <Stage designData={designData} refetchDesignData={refetchDesignData} stage={stage} />}
				<ShadowDiv onClick={onClick.bind(null, "design3d")}>
					<CustomDiv inline px="1.5rem" py="1.5rem">
						<CustomDiv inline pr="0.5rem">
							<Avatar>2</Avatar>
						</CustomDiv>
						<Text strong>Design in 3D app</Text>
					</CustomDiv>
					<CustomDiv flexBasis="25ch" inline px="1.5rem" py="1.5rem">
						<StatusButton block status={design3DStatus} type="primary" disabled={design3DStatus === Status.completed}>
							{getButtonText(design3DStatus)}
						</StatusButton>
					</CustomDiv>
				</ShadowDiv>
				{stage === "design3d" && <Stage designData={designData} refetchDesignData={refetchDesignData} stage={stage} />}
				<ShadowDiv onClick={onClick.bind(null, "render")}>
					<CustomDiv inline px="1.5rem" py="1.5rem">
						<CustomDiv inline pr="0.5rem">
							<Avatar>3</Avatar>
						</CustomDiv>
						<Text strong>Render Design</Text>
					</CustomDiv>
					<CustomDiv flexBasis="25ch" inline px="1.5rem" py="1.5rem">
						<StatusButton block status={renderStatus} type="primary" disabled={renderStatus === Status.completed}>
							{getButtonText(renderStatus)}
						</StatusButton>
					</CustomDiv>
				</ShadowDiv>
				{stage === "render" && <Stage designData={designData} refetchDesignData={refetchDesignData} stage={stage} />}
				<ShadowDiv onClick={onClick.bind(null, "send")}>
					<CustomDiv inline px="1.5rem" py="1.5rem">
						<CustomDiv inline pr="0.5rem">
							<Avatar>4</Avatar>
						</CustomDiv>
						<Text strong>Mark Design as complete</Text>
					</CustomDiv>
					<CustomDiv flexBasis="25ch" inline px="1.5rem" py="1.5rem">
						<StatusButton block status={readyStatus} type="primary" disabled={readyStatus === Status.completed}>
							{getButtonText(readyStatus)}
						</StatusButton>
					</CustomDiv>
				</ShadowDiv>
				{stage === "send" && <Stage designData={designData} refetchDesignData={refetchDesignData} stage={stage} />}
			</StepsContainer>
		</div>
	);
}
