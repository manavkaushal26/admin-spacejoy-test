import { TeamMember } from "@customTypes/dashboardTypes";
import { ProjectRoles } from "@customTypes/userType";
import { ModifiedText, SilentDivider } from "@sections/Dashboard/styled";
import { getValueSafely } from "@utils/commonUtils";
import { Avatar, Checkbox, Col, Empty, Row, Tooltip, Typography } from "antd";
import React, { useMemo } from "react";
import { NoBodyCard, StyledButton } from "./styled";
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

const SelectedTeamMemberCard = ({ teamMember }: { teamMember: TeamMember }) => {
	return (
		<Row>
			<Col span={24}>
				<Row justify='center'>
					<Avatar>
						{getValueSafely<string>(() => {
							return teamMember.profile.name[0];
						}, "N/A")}
					</Avatar>
				</Row>
			</Col>
			<Col>
				<Row justify='center'>
					<Tooltip
						title={
							<span style={{ textTransform: "capitalize" }}>
								{getValueSafely<string>(() => {
									return `${teamMember.profile.firstName} ${teamMember.profile.lastName}`;
								}, "N/A")}
							</span>
						}
					>
						<ModifiedText textTransform='capitalize'>
							{getValueSafely<string>(() => {
								return teamMember.profile.firstName;
							}, "N/A")}
						</ModifiedText>
					</Tooltip>
				</Row>
			</Col>
		</Row>
	);
};

export default function TeamSidebar({
	state,
	onDesignerSelect,
	selectedDesignersId,
	assignDesigners,
}: TeamSidebarProps): JSX.Element {
	const groupedTeam = useMemo(
		() =>
			state.assignedTeam.reduce((acc, currentMember) => {
				if (acc[currentMember?.role]) {
					return {
						...acc,
						[currentMember?.role]: [...acc[currentMember?.role], currentMember],
					};
				}
				return {
					...acc,
					[currentMember?.role]: [currentMember],
				};
			}, {}),
		[state.assignedTeam]
	);

	const assignedAccountManagers = useMemo(
		() => getValueSafely(() => groupedTeam[ProjectRoles["Account Manager"]], []),
		[state.assignedTeam]
	);

	const assignedDesigners = useMemo(() => getValueSafely(() => groupedTeam[ProjectRoles.Designer], []), [
		state.assignedTeam,
	]);

	const assignedSeniorArtists = useMemo(() => getValueSafely(() => groupedTeam[ProjectRoles["Senior 3D Artist"]], []), [
		state.assignedTeam,
	]);

	const assignedArtists = useMemo(() => getValueSafely(() => groupedTeam[ProjectRoles["3D Artist"]], []), [
		state.assignedTeam,
	]);

	const assignedAssistantDesigners = useMemo(
		() => getValueSafely(() => groupedTeam[ProjectRoles["Assistant Designer"]], []),
		[state.assignedTeam]
	);

	return (
		<Row>
			<Col span={24}>
				<Title level={4}>Team</Title>
			</Col>
			<Col span={24}>
				<SilentDivider />
			</Col>
			<Col span={24}>
				<Row>
					<Col span={24}>
						<Text strong>Account Managers</Text>
					</Col>
					<Col span={24}>
						<SilentDivider />
					</Col>
					<Col span={24}>
						<Row gutter={[8, 8]}>
							{assignedAccountManagers.length ? (
								assignedAccountManagers.map(teamMember => (
									<Col lg={6} md={8} sm={12} key={teamMember._id}>
										<NoBodyCard
											key={teamMember._id}
											size='small'
											title={<SelectedTeamMemberCard teamMember={teamMember} />}
											extra={
												<Checkbox
													onChange={e => {
														onDesignerSelect(teamMember._id, e.target.checked);
													}}
													checked={selectedDesignersId
														.map(member => {
															return member._id;
														})
														.includes(teamMember._id)}
												/>
											}
										/>
									</Col>
								))
							) : (
								<Col span={24}>
									<Row justify='center'>
										<Empty description='No Account Managers Assigned' />
									</Row>
								</Col>
							)}
						</Row>
					</Col>
				</Row>
			</Col>
			<Col span={24}>
				<SilentDivider />
			</Col>
			<Col span={24}>
				<Row>
					<Col span={24}>
						<Text strong>Designers</Text>
					</Col>
					<Col span={24}>
						<SilentDivider />
					</Col>
					<Col span={24}>
						<Row gutter={[8, 8]}>
							{assignedDesigners.length ? (
								assignedDesigners.map(teamMember => (
									<Col lg={6} md={8} sm={12} key={teamMember._id}>
										<NoBodyCard
											size='small'
											title={<SelectedTeamMemberCard teamMember={teamMember} />}
											extra={
												<Checkbox
													onChange={e => {
														onDesignerSelect(teamMember._id, e.target.checked);
													}}
													checked={selectedDesignersId
														.map(member => {
															return member._id;
														})
														.includes(teamMember._id)}
												/>
											}
										/>
									</Col>
								))
							) : (
								<Col span={24}>
									<Row justify='center'>
										<Empty description='No Designers Assigned' />
									</Row>
								</Col>
							)}
						</Row>
					</Col>
				</Row>
			</Col>
			<Col span={24}>
				<SilentDivider />
			</Col>
			<Col span={24}>
				<Row>
					<Col span={24}>
						<Text strong>Assistant Designers</Text>
					</Col>
					<Col span={24}>
						<SilentDivider />
					</Col>
					<Col span={24}>
						<Row gutter={[8, 8]}>
							{assignedAssistantDesigners.length ? (
								assignedAssistantDesigners.map(teamMember => (
									<Col lg={6} md={8} sm={12} key={teamMember._id}>
										<NoBodyCard
											size='small'
											title={<SelectedTeamMemberCard teamMember={teamMember} />}
											extra={
												<Checkbox
													onChange={e => {
														onDesignerSelect(teamMember._id, e.target.checked);
													}}
													checked={selectedDesignersId
														.map(member => {
															return member._id;
														})
														.includes(teamMember._id)}
												/>
											}
										/>
									</Col>
								))
							) : (
								<Col span={24}>
									<Row justify='center'>
										<Empty description='No Assistant designers assigned' />
									</Row>
								</Col>
							)}
						</Row>
					</Col>
				</Row>
			</Col>
			<Col span={24}>
				<SilentDivider />
			</Col>
			<Col span={24}>
				<Row>
					<Col span={24}>
						<Text strong>Senior 3D Artists</Text>
					</Col>
					<Col span={24}>
						<SilentDivider />
					</Col>
					<Col span={24}>
						<Row gutter={[8, 8]}>
							{assignedSeniorArtists.length ? (
								assignedSeniorArtists.map(teamMember => (
									<Col lg={6} md={8} sm={12} key={teamMember._id}>
										<NoBodyCard
											size='small'
											title={<SelectedTeamMemberCard teamMember={teamMember} />}
											extra={
												<Checkbox
													onChange={e => {
														onDesignerSelect(teamMember._id, e.target.checked);
													}}
													checked={selectedDesignersId
														.map(member => {
															return member._id;
														})
														.includes(teamMember._id)}
												/>
											}
										/>
									</Col>
								))
							) : (
								<Col span={24}>
									<Row justify='center' align='middle'>
										<Empty description='No Senior designers assigned' />
									</Row>
								</Col>
							)}
						</Row>
					</Col>
				</Row>
			</Col>
			<Col span={24}>
				<SilentDivider />
			</Col>
			<Col span={24}>
				<Row>
					<Col span={24}>
						<Text strong>3D Artists</Text>
					</Col>
					<Col span={24}>
						<SilentDivider />
					</Col>
					<Col span={24}>
						<Row gutter={[8, 8]}>
							{assignedArtists.length ? (
								assignedArtists.map(teamMember => (
									<Col lg={6} md={8} sm={12} key={teamMember._id}>
										<NoBodyCard
											size='small'
											title={<SelectedTeamMemberCard teamMember={teamMember} />}
											extra={
												<Checkbox
													onChange={e => {
														onDesignerSelect(teamMember._id, e.target.checked);
													}}
													checked={selectedDesignersId
														.map(member => {
															return member._id;
														})
														.includes(teamMember._id)}
												/>
											}
										/>
									</Col>
								))
							) : (
								<Col span={24}>
									<Row justify='center'>
										<Empty description='No 3D artists assigned' />
									</Row>
								</Col>
							)}
						</Row>
					</Col>
				</Row>
			</Col>

			<Col>
				<StyledButton fullwidth type='primary' onClick={assignDesigners}>
					Update Team
				</StyledButton>
			</Col>
		</Row>
	);
}
