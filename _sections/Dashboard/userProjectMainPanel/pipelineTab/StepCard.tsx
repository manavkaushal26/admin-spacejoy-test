import React from "react";
import { ShadowDiv, CustomDiv } from "@sections/Dashboard/styled";
import { Avatar, Typography, Button } from "antd";

const { Text } = Typography;

interface StepCard {
	stepNumber: number;
	stepTitle: string;
	key: string;
	onClick: (step: string) => void;
}

export default function StepCard({ stepNumber, stepTitle, onClick, key }: StepCard): JSX.Element {
	return (
		<ShadowDiv onClick={onClick.bind(null, "assets")}>
			<CustomDiv px="1.5rem" py="1.5rem">
				<CustomDiv inline pr="0.5rem">
					<Avatar>{stepNumber}</Avatar>
				</CustomDiv>
				<Text strong>{stepTitle}</Text>
			</CustomDiv>
			<CustomDiv>
				<Button type="primary"></Button>
			</CustomDiv>
		</ShadowDiv>
	);
}
