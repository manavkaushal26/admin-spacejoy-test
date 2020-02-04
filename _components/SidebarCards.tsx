import ProgressBar from "@components/ProgressBar";
import { HumanizePhaseInternalNames } from "@customTypes/dashboardTypes";
import { Status } from "@customTypes/userType";
import { getTagColor } from "@sections/Dashboard/styled";
import { Avatar, Button, Card, Col, Row, Typography } from "antd";
import moment from "moment";
import React from "react";
import styled, { css } from "styled-components";
import { CapitalizedText, StyledTag } from "./CommonStyledComponents";

interface SidebarCard {
	avatarText: string;
	title: string;
	subHeading: string;
	uniqueId: string;
	phase: string;
	startedAt: string;
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
	noOfDays,
	uniqueId,
	avatarStyle,
	onClick,
	selectedId,
	onStartClick,
	startedAt,
	status,
}) => {
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
							</Row>
						</Col>
					</Row>
				</Col>
				<Col span={4}>
					<Row type="flex" justify="end">
						{!startedAt ? (
							<Button
								onClick={e => {
									e.stopPropagation();
									onStartClick(uniqueId);
								}}
								style={{ padding: "0px 6px", height: "auto" }}
								type="default"
							>
								<Text>Start</Text>
							</Button>
						) : (
							<ProgressBar status={status} endTime={moment(startedAt).add(noOfDays, "days")} width={30} />
						)}
					</Row>
				</Col>
			</Row>
		</SidebarCards>
	);
};

export default SidebarCard;
