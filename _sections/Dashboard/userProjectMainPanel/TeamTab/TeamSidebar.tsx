import { ProjectRoles } from "@customTypes/userType";
import { CustomDiv, ModifiedText, SilentDivider } from "@sections/Dashboard/styled";
import { getValueSafely } from "@utils/commonUtils";
import { Avatar, Checkbox, Empty, Typography } from "antd";
import React, { useMemo } from "react";
import styled from "styled-components";
import { GreyColumn, NoBodyCard, StyledButton } from "./styled";
import { DesignerTabState } from "./teamTabReducer";
const { Text, Title } = Typography;

interface TeamSidebarProps {
	state: DesignerTabState;
	onDesignerSelect: (id: string, checked: boolean) => void;
	selectedDesignersId: {
		_id: string;
		name: string;
	}[];
	assignDesigners: () => void;
}

const CardContainer = styled(CustomDiv)`
	> * {
		margin-top: 0.5rem;
		margin-right: 0.5rem;
	}
`;

export default function TeamSidebar({
	state,
	onDesignerSelect,
	selectedDesignersId,
	assignDesigners
}: TeamSidebarProps): JSX.Element {
	const assignedAccountManagers = useMemo(
		() =>
			state.assignedTeam.filter(member => {
				return member.role === ProjectRoles["Account Manager"];
			}),
		[state.assignedTeam]
	);

	const assignedDesigners = useMemo(() => {
		return state.assignedTeam.filter(member => {
			return member.role === ProjectRoles.Designer;
		});
	}, [state.assignedTeam]);

	return (
		<GreyColumn md={8}>
			<CustomDiv width="100%" type="flex" pt="0.5rem" justifyContent="space-around">
				<Title level={4}>Team</Title>
			</CustomDiv>
			<SilentDivider />

			<CustomDiv px="0.75rem">
				<CustomDiv py="0.25rem">
					<Text strong>Account Managers</Text>
				</CustomDiv>
				<SilentDivider />
				<CardContainer px="8px" py="1rem" type="flex" flexWrap="wrap">
					{assignedAccountManagers.length ? (
						assignedAccountManagers.map(teamMember => (
							<NoBodyCard
								size="small"
								title={
									<>
										<CustomDiv type="flex" justifyContent="space-around">
											<Avatar>
												{getValueSafely<string>(() => {
													return teamMember.profile.name[0];
												}, "N/A")}
											</Avatar>
										</CustomDiv>
										<CustomDiv type="flex" justifyContent="space-around">
											<ModifiedText textTransform="capitalize">
												{getValueSafely<string>(() => {
													return teamMember.profile.firstName;
												}, "N/A")}
											</ModifiedText>
										</CustomDiv>
									</>
								}
								extra={
									<Checkbox
										onChange={e => {
											onDesignerSelect(teamMember._id, e.target.checked);
										}}
										checked={selectedDesignersId
											.map(teamMember => {
												return teamMember._id;
											})
											.includes(teamMember._id)}
									/>
								}
							></NoBodyCard>
						))
					) : (
						<CustomDiv py="1rem" width="100%">
							<Empty description="No Account Managers Assigned" />
						</CustomDiv>
					)}
				</CardContainer>
			</CustomDiv>
			<SilentDivider />
			<CustomDiv px="0.75rem">
				<CustomDiv py="0.25rem">
					<Text strong>Designers</Text>
				</CustomDiv>
				<SilentDivider />
				<CardContainer px="8px" py="1rem" type="flex" flexWrap="wrap">
					{assignedDesigners.length ? (
						assignedDesigners.map(teamMember => (
							<NoBodyCard
								key={teamMember._id}
								size="small"
								title={
									<>
										<CustomDiv type="flex" justifyContent="space-around">
											<Avatar>
												{getValueSafely<string>(() => {
													return teamMember.profile.name[0];
												}, "N/A")}
											</Avatar>
										</CustomDiv>
										<CustomDiv type="flex" justifyContent="space-around">
											<ModifiedText textTransform="capitalize">
												{getValueSafely<string>(() => {
													return teamMember.profile.firstName;
												}, "N/A")}
											</ModifiedText>
										</CustomDiv>
									</>
								}
								extra={
									<Checkbox
										onChange={e => {
											onDesignerSelect(teamMember._id, e.target.checked);
										}}
										checked={selectedDesignersId
											.map(teamMember => {
												return teamMember._id;
											})
											.includes(teamMember._id)}
									/>
								}
							></NoBodyCard>
						))
					) : (
						<CustomDiv width="100%">
							<Empty description="No Designers Assigned" />
						</CustomDiv>
					)}
				</CardContainer>
			</CustomDiv>

			<CustomDiv>
				<StyledButton fullwidth type="primary" onClick={assignDesigners}>
					Update Team
				</StyledButton>
			</CustomDiv>
		</GreyColumn>
	);
}
