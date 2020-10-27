import { ProjectRoles } from "@customTypes/userType";
import { CustomDiv, ModifiedText, SilentDivider } from "@sections/Dashboard/styled";
import { getValueSafely } from "@utils/commonUtils";
import { Avatar, Checkbox, Col, Empty, Row, Typography } from "antd";
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

export default function TeamSidebar({
	state,
	onDesignerSelect,
	selectedDesignersId,
	assignDesigners,
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

	const assignedArtists = useMemo(() => {
		return state.assignedTeam.filter(member => {
			return member.role === ProjectRoles["3D Artist"];
		});
	}, [state.assignedTeam]);

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
											title={
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
													<Col span={24}>
														<Row justify='center'>
															<ModifiedText textTransform='capitalize'>
																{getValueSafely<string>(() => {
																	return teamMember.profile.firstName;
																}, "N/A")}
															</ModifiedText>
														</Row>
													</Col>
												</Row>
											}
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
								<CustomDiv py='1rem' width='100%'>
									<Empty description='No Account Managers Assigned' />
								</CustomDiv>
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
											title={
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
															<ModifiedText textTransform='capitalize'>
																{getValueSafely<string>(() => {
																	return teamMember.profile.firstName;
																}, "N/A")}
															</ModifiedText>
														</Row>
													</Col>
												</Row>
											}
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
								<Row justify='center'>
									<Empty description='No Designers Assigned' />
								</Row>
							)}
						</Row>
					</Col>
				</Row>
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
											title={
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
															<ModifiedText textTransform='capitalize'>
																{getValueSafely<string>(() => {
																	return teamMember.profile.firstName;
																}, "N/A")}
															</ModifiedText>
														</Row>
													</Col>
												</Row>
											}
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
								<Row justify='center'>
									<Empty description='No Designers Assigned' />
								</Row>
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
