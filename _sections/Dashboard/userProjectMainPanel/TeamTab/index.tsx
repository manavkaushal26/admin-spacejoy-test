import { teamAssignApi, userApi } from "@api/userApi";
import { DetailedDesign, DetailedProject, TeamMember } from "@customTypes/dashboardTypes";
import { ProjectRoles } from "@customTypes/userType";
import { debounce, getValueSafely } from "@utils/commonUtils";
import fetcher from "@utils/fetcher";
import { Avatar, Card, Checkbox, Col, Empty, Input, Pagination, Row, Select, Typography } from "antd";
import React, { useEffect, useMemo, useReducer } from "react";
import { CustomDiv } from "../../styled";
import TeamSidebar from "./TeamSidebar";
import { DesignerTabActionType, DesignerTabReducer, designerTabReducer, DesignerTabState } from "./teamTabReducer";

const { Text } = Typography;
const { Option } = Select;

interface DesignerTabInterface {
	projectId: string;
	designData: DetailedDesign;
	assignedTeam: TeamMember[];
	setLoading: React.Dispatch<React.SetStateAction<boolean>>;
	setProjectData: React.Dispatch<React.SetStateAction<DetailedProject>>;
	setDesignData: React.Dispatch<React.SetStateAction<DetailedDesign>>;
	projectData: DetailedProject;
}

const intialState: DesignerTabState = {
	team: [],
	assignedTeam: [],
	loading: false,
	searchText: "",
	totalCount: 0,
	role: ProjectRoles.Designer,
	currentPage: 1,
};

const fetchDesigners = async (setLoading, state: DesignerTabState, dispatch): Promise<void> => {
	setLoading(true);
	const endpoint = `${userApi()}?skip=${(state.currentPage - 1) * 6}&limit=6`;
	const responseData = await fetcher({
		endPoint: endpoint,
		method: "POST",
		body: {
			data: {
				role: {
					search: "single",
					value: state.role,
				},
				"profile.name": { search: "single", value: state.searchText },
			},
		},
	});
	if (responseData.data) {
		if (responseData.data.data) {
			dispatch({
				type: DesignerTabActionType.UPDATE_DATA,
				value: {
					data: responseData.data.data,
					totalCount: responseData.data.count,
				},
			});
		}
	}
	setLoading(false);
};

const morphTeamMemberForApi = (member: TeamMember) => {
	return {
		member: member._id,
		memberName: member.profile.name,
		memberEmail: member.email,
	};
};

const debouncedFetchDesigners = debounce(fetchDesigners, 500);

const TeamTab: React.FC<DesignerTabInterface> = ({
	projectId,
	assignedTeam,
	designData,
	setDesignData,
	setLoading,
	setProjectData,
	projectData,
}): JSX.Element => {
	const init = (initialState: DesignerTabState): DesignerTabState => {
		return {
			...initialState,
			assignedTeam: assignedTeam || [],
		};
	};

	const [state, dispatch] = useReducer<DesignerTabReducer, DesignerTabState>(designerTabReducer, intialState, init);

	const selectedDesignersId = useMemo(() => {
		return state.assignedTeam.map(teamMember => {
			return { _id: teamMember._id, name: getValueSafely(() => teamMember.profile.name, "N/A") };
		});
	}, [state.assignedTeam]);

	useEffect(() => {
		debouncedFetchDesigners(setLoading, state, dispatch);
	}, [state.role, state.searchText, state.currentPage]);

	const onDesignerSelect = (id: string, checked: boolean): void => {
		if (checked) {
			const teamMember = state.team.find(member => {
				return member._id === id;
			});
			dispatch({ type: DesignerTabActionType.ASSIGN_DESIGNER, value: teamMember });
		} else {
			dispatch({ type: DesignerTabActionType.UNASSIGN_DESIGNER, value: id });
		}
	};

	const assignDesigners = async () => {
		setLoading(true);
		const addMemberEndpoint = projectId
			? teamAssignApi(projectId, "project", "add")
			: teamAssignApi(designData._id, "design", "add");
		const removeMemberEndpoint = projectId
			? teamAssignApi(projectId, "project", "remove")
			: teamAssignApi(designData._id, "design", "remove");

		const addedMembers = state.assignedTeam
			.filter(teamMember => !assignedTeam.map(member => member._id).includes(teamMember._id))
			.map(morphTeamMemberForApi);
		const removedMembers = assignedTeam
			.filter(teamMember => !state.assignedTeam.map(member => member._id).includes(teamMember._id))
			.map(morphTeamMemberForApi);

		let response: {
			statusCode?: number;
			data?: DetailedProject;
		} = {};
		if (addedMembers.length > 0) {
			const body = {
				data: {
					memberList: addedMembers,
				},
			};
			response = await fetcher({ endPoint: addMemberEndpoint, method: "PUT", body });
		}
		if (removedMembers.length > 0) {
			const body = {
				data: {
					memberList: removedMembers,
				},
			};
			response = await fetcher({ endPoint: removeMemberEndpoint, method: "DELETE", body });
		}
		if (projectData) {
			setProjectData({ ...projectData, team: response.data.team });
		} else {
			setDesignData({ ...designData, team: response.data.team });
		}
		setLoading(false);
	};

	const onSearchTextChange = e => {
		const {
			target: { value },
		} = e;
		dispatch({ type: DesignerTabActionType.UPDATE_SEARCH_TEXT, value });
	};

	const onPageChange = (page): void => {
		dispatch({ type: DesignerTabActionType.PAGE_CHANGE, value: page });
	};

	return (
		<CustomDiv py="10px" px="10px">
			<Row gutter={[16, 8]}>
				<Col span={24}>
					<Row type="flex" gutter={[8, 8]}>
						<Col>
							<Row gutter={[8, 8]}>
								<Col span={24}>
									<Text>Search by Name</Text>
								</Col>
								<Col span={24}>
									<Input onChange={onSearchTextChange} />
								</Col>
							</Row>
						</Col>
						<Col>
							<Row type="flex" gutter={[8, 8]}>
								<Col span={24}>
									<Text>Role</Text>
								</Col>
								<Col span={24}>
									<Select
										style={{ flexBasis: "30ch" }}
										value={state.role}
										onSelect={value => dispatch({ type: DesignerTabActionType.ROLE_CHANGE, value })}
									>
										{Object.keys(ProjectRoles).map(key => (
											<Option key={key} value={ProjectRoles[key]}>
												{key}
											</Option>
										))}
									</Select>
								</Col>
							</Row>
						</Col>
					</Row>
				</Col>
				<Col md={16}>
					<Row type="flex" gutter={[8, 8]}>
						{state.team.length ? (
							state.team.map(teamMember => {
								return (
									<Col key={teamMember._id} span={8}>
										<Card
											size="small"
											title={
												<CustomDiv type="flex" align="center">
													<CustomDiv py="8px" width="30%" overflow="visible">
														<Avatar>
															{getValueSafely<string>(() => {
																return teamMember.profile.name[0];
															}, "N/A").toUpperCase()}
														</Avatar>
													</CustomDiv>
													<CustomDiv width="70%">
														<Text style={{ width: "100%" }} ellipsis strong>
															<CustomDiv width="100%" textTransform="capitalize" overflow="hidden">
																{getValueSafely<string>(() => {
																	return teamMember.profile.name;
																}, "N/A")}
															</CustomDiv>
														</Text>
													</CustomDiv>
												</CustomDiv>
											}
											extra={
												<Checkbox
													checked={selectedDesignersId.map(member => member._id).includes(teamMember._id)}
													onChange={e => {
														onDesignerSelect(teamMember._id, e.target.checked);
													}}
												/>
											}
											key={teamMember._id}
										>
											Current Projects: N/A
										</Card>
									</Col>
								);
							})
						) : (
							<Col span={24}>
								<Empty description="No Users found" />
							</Col>
						)}
						<Col span={24}>
							<Row justify="center" type="flex">
								<Pagination
									pageSize={6}
									hideOnSinglePage
									current={state.currentPage}
									onChange={onPageChange}
									total={state.totalCount}
								/>
							</Row>
						</Col>
					</Row>
				</Col>
				<Col md={8}>
					<TeamSidebar
						state={state}
						onDesignerSelect={onDesignerSelect}
						selectedDesignersId={selectedDesignersId}
						assignDesigners={assignDesigners}
					/>
				</Col>
			</Row>
		</CustomDiv>
	);
};

export default TeamTab;
