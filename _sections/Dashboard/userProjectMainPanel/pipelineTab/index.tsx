import React from "react";
import { Typography, Avatar } from "antd";
import { CustomDiv } from "@sections/Dashboard/styled";
import styled from "styled-components";

const { Title, Text } = Typography;

const StepsContainer = styled(CustomDiv)`
	> * + * {
		margin-top: 1em;
	}
	padding: 1rem;

	> *:last-child {
		margin-bottom: 1em;
	}
`;

const ShadowDiv = styled.div`
	box-shadow: 0px 2px 16px #999ba81f;
`;

export default function PipelineTab() {
	return (
		<div>
			<Title level={2}>Task Overview</Title>
			<StepsContainer>
				<ShadowDiv>
					<CustomDiv px="1.5rem" py="1.5rem">
						<CustomDiv inline pr="0.5rem">
							<Avatar>1</Avatar>
						</CustomDiv>
						<Text strong>Upload Room and Assets</Text>
					</CustomDiv>
				</ShadowDiv>
				<ShadowDiv>
					<CustomDiv px="1.5rem" py="1.5rem">
						<CustomDiv inline pr="0.5rem">
							<Avatar>2</Avatar>
						</CustomDiv>
						<Text strong>Design in 3D app</Text>
					</CustomDiv>
				</ShadowDiv>
				<ShadowDiv>
					<CustomDiv px="1.5rem" py="1.5rem">
						<CustomDiv inline pr="0.5rem">
							<Avatar>3</Avatar>
						</CustomDiv>
						<Text strong>Render Design</Text>
					</CustomDiv>
				</ShadowDiv>
				<ShadowDiv>
					<CustomDiv px="1.5rem" py="1.5rem">
						<CustomDiv inline pr="0.5rem">
							<Avatar>4</Avatar>
						</CustomDiv>
						<Text strong>Send to Client</Text>
					</CustomDiv>
				</ShadowDiv>
			</StepsContainer>
		</div>
	);
}
