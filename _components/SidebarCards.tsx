import ProgressBar from "@components/ProgressBar";
import { HumanizePhaseInternalNames, PhaseInternalNames } from "@customTypes/dashboardTypes";
import { Status } from "@customTypes/userType";
import { getTagColor } from "@sections/Dashboard/styled";
import { Avatar, Button, Card, Col, Row, Typography } from "antd";
import moment from "moment";
import React, { useMemo } from "react";
import styled, { css } from "styled-components";
import { CapitalizedText, StyledTag } from "./CommonStyledComponents";

interface SidebarCard {
	isDelayed: boolean;
	delayText: string;
	avatarText: string;
	title: string;
	subHeading: string;
	uniqueId: string;
	phase: PhaseInternalNames;
	startedAt: string;
	phaseStartTime: string;
	endedAt: string;
	status: Status;
	avatarStyle: Record<string, string>;
	onClick: (uniqueId: string) => void;
	selectedId: string;
	onStartClick: (projectId: string) => void;
	noOfDays: number;
}

const { Text } = Typography;

const SidebarCards = styled(Card)<{ active: boolean }>`
	background: transparent;
	border: none;
	${({ active }) =>
		active &&
		css`
			background: ${({ theme }) => theme.colors.mild.antblue};
			border-right: 3px solid ${({ theme }) => theme.colors.antblue};
			box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
		`};
	:hover {
		background: ${({ theme }) => theme.colors.mild.antblue};
		border-right: 3px solid ${({ theme }) => theme.colors.antblue};
	}
`;

const SubText = styled(Text)`
	position: relative;
	font-size: 0.8em;
	top: -3px;
`;

const SidebarCard: React.FC<SidebarCard> = ({
	avatarText,
	subHeading,
	title,
	phase,
	phaseStartTime,
	uniqueId,
	avatarStyle,
	onClick,
	selectedId,
	endedAt,
	onStartClick,
	startedAt,
	status,
	delayText,
	isDelayed,
}) => {
	const endTime = useMemo(() => {
		if (phase === PhaseInternalNames.designsInRevision) {
			return moment(phaseStartTime).add(5, "days");
		}
		if (endedAt) {
			return moment(endedAt);
		}
		return null;
	}, [endedAt, startedAt]);
	return (
		<SidebarCards
			size="small"
			active={selectedId === uniqueId}
			hoverable
			style={{ width: "100%" }}
			onClick={(e): void => {
				e.preventDefault();
				onClick(uniqueId);
			}}
		>
			<Row type="flex" gutter={[8, 8]}>
				<Col span={3}>
					<Avatar style={avatarStyle}>
						<CapitalizedText>{avatarText}</CapitalizedText>
					</Avatar>
				</Col>
				<Col span={17}>
					<Row type="flex" gutter={[4, 4]}>
						<Col span={24}>
							<Row>
								<Col span={24}>
									<CapitalizedText strong>{title}</CapitalizedText>
								</Col>
								<Col span={24}>
									<SubText>{subHeading}</SubText>
								</Col>
							</Row>
						</Col>
						<Col span={24}>
							<Row type="flex" gutter={[4, 4]}>
								<Col span={13}>
									<StyledTag
										style={{ width: "100%", textOverflow: "ellipses", overflow: "hidden" }}
										color={getTagColor(phase)}
									>
										Phase: {HumanizePhaseInternalNames[phase]}
									</StyledTag>
								</Col>
								<Col span={11}>
									<StyledTag
										style={{ width: "100%", textOverflow: "ellipses", overflow: "hidden" }}
										color={getTagColor(status)}
									>
										Status: {status}
									</StyledTag>
								</Col>
								{isDelayed && (
									<Col span={12}>
										<StyledTag style={{ width: "100%", textOverflow: "ellipses", overflow: "hidden" }} color="red">
											{delayText}
										</StyledTag>
									</Col>
								)}
							</Row>
						</Col>
					</Row>
				</Col>
				<Col span={4}>
					<Row type="flex" justify="end">
						{!endedAt ? (
							<Button
								onClick={(e): void => {
									e.stopPropagation();
									onStartClick(uniqueId);
								}}
								style={{ padding: "0px 6px", height: "auto" }}
								type="default"
							>
								<Text>Start</Text>
							</Button>
						) : (
							<ProgressBar phase={phase} endTime={endTime} width={30} />
						)}
					</Row>
				</Col>
			</Row>
		</SidebarCards>
	);
};

export default SidebarCard;
