import ProgressBar from "@components/ProgressBar";
import {
	HumanizePhaseInternalNames,
	PhaseInternalNames,
	QuizState,
	QuizStateLabels,
} from "@customTypes/dashboardTypes";
import { Status } from "@customTypes/userType";
import { SilentDivider } from "@sections/Dashboard/styled";
import { Avatar, Card, Col, Row, Tooltip, Typography } from "antd";
import { Moment } from "moment";
import React from "react";
import styled, { css } from "styled-components";
import { CapitalizedText } from "./CommonStyledComponents";

interface SidebarCard {
	isDelayed: boolean;
	delayText: string;
	avatarText: string;
	title: string;
	subHeading: string;
	uniqueId: string;
	phase: PhaseInternalNames;
	status: Status;
	endTime: Moment;
	avatarStyle: Record<string, string>;
	onClick: (uniqueId: string) => void;
	selectedId: string;
	daysLeft: number;
	quizCompletionStatus: QuizState;
}

const HighlightedSpan = styled.span<{ type: string }>`
	background-color: ${({ type, theme }): string => {
		if (type === "danger") {
			return theme.colors.mild.red;
		}
		if (type === "success") {
			return theme.colors.mild.green;
		}
		return "transparent";
	}};
	border: 1px solid red 3px;
	padding: 0px 5px;
`;

const getSafetyColor = (daysLeft, transparent = false): string => {
	if (transparent) {
		return "transparent";
	}
	if (daysLeft < 3) {
		return "red";
	}
	if (daysLeft < 6) {
		return "orange";
	}
	return "green";
};

const HighlightSpan = ({ children, type }) => {
	return <HighlightedSpan type={type}>{children}</HighlightedSpan>;
};

const { Text } = Typography;

const SidebarCards = styled(Card)<{ active: boolean; leftBorder: string }>`
	border: none;
	border-radius: 0px;
	border-left: 5px solid ${({ leftBorder }): string => leftBorder};
	${({ active }) =>
		active &&
		css`
			background: ${({ theme }): string => theme.colors.dark};
			border-right: 3px solid ${({ theme }): string => theme.colors.blue};
			box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
			:hover {
				border-right: 5px solid ${({ theme }): string => theme.colors.blue};
			}
		`};
	:hover {
		background: ${({ theme }): string => theme.colors.dark};
		border-left: 5px solid ${({ leftBorder }): string => leftBorder};
		border-right: 5px solid ${({ theme }): string => theme.colors.blue};
	}
`;

const SidebarCard: React.FC<SidebarCard> = ({
	avatarText,
	subHeading,
	title,
	phase,
	uniqueId,
	avatarStyle,
	onClick,
	selectedId,
	endTime,
	daysLeft,
	delayText,
	quizCompletionStatus,
	isDelayed,
}) => {
	return (
		<>
			<SidebarCards
				leftBorder={getSafetyColor(
					daysLeft,
					!endTime || phase === PhaseInternalNames.designReady || phase === PhaseInternalNames.shop
				)}
				size='small'
				active={selectedId === uniqueId}
				hoverable
				style={{ width: "100%" }}
				onClick={(e): void => {
					e.preventDefault();
					onClick(uniqueId);
				}}
			>
				<Row gutter={[8, 8]}>
					<Col span={24}>
						<Row gutter={[4, 4]} align='middle'>
							<Col span={3}>
								<Avatar style={avatarStyle}>
									<CapitalizedText>{avatarText}</CapitalizedText>
								</Avatar>
							</Col>
							<Col span={17}>
								<Row justify='space-between' align='middle' gutter={[4, 4]}>
									<Col span={24}>
										<CapitalizedText strong>{title}</CapitalizedText>
									</Col>
									<Col span={24}>
										<small>
											<Text>{subHeading || "Room design"}</Text>
											{endTime && (
												<>
													<Text> / Deliver by : </Text>
													<Text strong>{endTime.format("MM-DD-YYYY")}</Text>
												</>
											)}
										</small>
									</Col>
								</Row>
							</Col>
							<Col span={4}>
								{!endTime ? (
									<Row justify='center' align='middle'>
										<Text>
											<Tooltip title='Not started'>
												<small>N/S</small>
											</Tooltip>
										</Text>
									</Row>
								) : (
									<ProgressBar phase={phase} days={daysLeft} size={14} />
								)}
							</Col>
						</Row>
					</Col>
					<Col span={24}>
						<SilentDivider />
					</Col>
					<Col span={24}>
						<Row>
							<Col span={20}>
								<Row gutter={[4, 4]}>
									<Col span={24}>
										<Text strong>Phase: </Text>
										<Text>{HumanizePhaseInternalNames[phase]}</Text>
									</Col>
									<Col span={24}>
										<Text strong>Quiz Status: </Text>
										<Text>{QuizStateLabels[quizCompletionStatus]}</Text>
									</Col>
								</Row>
							</Col>
							{isDelayed && (
								<Col span={4}>
									<Row>
										<Col span={24}>
											<Row justify='center'>
												<Text>
													<small>
														<small>Delay</small>
													</small>
												</Text>
											</Row>
										</Col>
										<Col span={24}>
											<Row justify='center'>
												<HighlightSpan type='danger'>
													<Text strong>
														<small>{delayText}</small>
													</Text>
												</HighlightSpan>
											</Row>
										</Col>
									</Row>
								</Col>
							)}
						</Row>
					</Col>
				</Row>
			</SidebarCards>
		</>
	);
};

export default SidebarCard;
