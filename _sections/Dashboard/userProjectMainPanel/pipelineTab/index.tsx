import React, { useState } from "react";
import { Typography, Avatar, Upload, Button, Icon } from "antd";
import { CustomDiv, SilentDivider, StepsContainer, ShadowDiv } from "@sections/Dashboard/styled";
import styled from "styled-components";
import Stage from "./Stage";

const { Title, Text } = Typography;

export default function PipelineTab() {
	const [stage, setStage] = useState<string>(null);

	const onClick = step => {
		setStage(step);
	};

	return (
		<div>
			<Title level={2}>Task Overview</Title>
			{!stage ? (
				<StepsContainer>
					<ShadowDiv onClick={onClick.bind(null, "assets")}>
						<CustomDiv px="1.5rem" py="1.5rem">
							<CustomDiv inline pr="0.5rem">
								<Avatar>1</Avatar>
							</CustomDiv>
							<Text strong>Upload Room and Assets</Text>
						</CustomDiv>
					</ShadowDiv>
					<ShadowDiv onClick={onClick.bind(null, "3dstep")}>
						<CustomDiv px="1.5rem" py="1.5rem">
							<CustomDiv inline pr="0.5rem">
								<Avatar>2</Avatar>
							</CustomDiv>
							<Text strong>Design in 3D app</Text>
						</CustomDiv>
					</ShadowDiv>
					<ShadowDiv onClick={onClick.bind(null, "render")}>
						<CustomDiv px="1.5rem" py="1.5rem">
							<CustomDiv inline pr="0.5rem">
								<Avatar>3</Avatar>
							</CustomDiv>
							<Text strong>Render Design</Text>
						</CustomDiv>
					</ShadowDiv>
					<ShadowDiv onClick={onClick.bind(null, "send")}>
						<CustomDiv px="1.5rem" py="1.5rem">
							<CustomDiv inline pr="0.5rem">
								<Avatar>4</Avatar>
							</CustomDiv>
							<Text strong>Send to Client</Text>
						</CustomDiv>
					</ShadowDiv>
				</StepsContainer>
			) : (
				<Stage stage={stage} />
			)}
		</div>
	);
}
