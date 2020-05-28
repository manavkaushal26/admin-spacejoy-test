import ProgressBar from "@components/ProgressBar";
import { HumanizePhaseInternalNames, PhaseInternalNames } from "@customTypes/dashboardTypes";
import { Status } from "@customTypes/userType";
import { getTagColor } from "@sections/Dashboard/styled";
import { Avatar, Card, Col, Row, Tooltip, Typography } from "antd";
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
	startedAt,
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
				<Col span={21}>
					<Row type="flex" gutter={[4, 4]}>
						<Col span={24}>
							<Row type="flex" justify="space-between" align="middle" gutter={[4, 4]}>
								<Col span={22} style={{ overflow: "hidden" }}>
									<Row gutter={[4, 4]}>
										<Col>
											<CapitalizedText strong>{title}</CapitalizedText>
										</Col>
										<Col>
											<SubText>{subHeading}</SubText>
										</Col>
									</Row>
								</Col>
								<Col span={2}>
									{!endedAt ? (
										<Text>
											<Tooltip title="Not started">
												<small>N/S</small>
											</Tooltip>
										</Text>
									) : (
										<ProgressBar phase={phase} endTime={endTime} width={30} />
									)}
								</Col>
							</Row>
						</Col>
						<Col span={24}>
							<Row type="flex" gutter={[4, 4]}>
								<Col>
									{endedAt && (
										<Text>
											<small>Ends on: {endTime.format("MM-DD-YYYY")}</small>
										</Text>
									)}
								</Col>
							</Row>
						</Col>
						<Col span={24}>
							<Row type="flex" gutter={[4, 4]}>
								<Col span={12}>
									<StyledTag
										style={{ width: "100%", textOverflow: "ellipses", overflow: "hidden" }}
										color={getTagColor(phase)}
									>
										Phase: {HumanizePhaseInternalNames[phase]}
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
			</Row>
		</SidebarCards>
	);
};

export default SidebarCard;
