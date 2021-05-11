import { newTeamAssignApi, userApi } from "@api/userApi";
import { TeamMember } from "@customTypes/dashboardTypes";
import { ProjectRoles } from "@customTypes/userType";
import { debounce, getValueSafely } from "@utils/commonUtils";
import fetcher from "@utils/fetcher";
import {
	Avatar,
	Card,
	Checkbox,
	Col,
	Empty,
	Input,
	notification,
	Pagination,
	Row,
	Select,
	Spin,
	Typography,
} from "antd";
import React, { useEffect, useMemo, useReducer, useState } from "react";
import { CustomDiv } from "../../styled";
import TeamSidebar from "../TeamTab/TeamSidebar";
import {
	DesignerTabActionType,
	DesignerTabReducer,
	designerTabReducer,
	DesignerTabState,
} from "../TeamTab/teamTabReducer";

const { Text } = Typography;
const { Option } = Select;

interface DesignerTabInterface {
	type?: string;
	projectId: string;
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
	const endpoint = `${userApi()}?skip=${(state.currentPage - 1) * 12}&limit=12`;
	const responseData = await fetcher({
		endPoint: endpoint,
		method: "POST",
		body: {
			data: {
				"role": {
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
		memberName: member.profile?.name,
		memberEmail: member.email,
	};
};

const debouncedFetchDesigners = debounce(fetchDesigners, 500);

const ProjectTeamTab: React.FC<DesignerTabInterface> = ({ type, projectId }): JSX.Element => {
	const init = (initialState: DesignerTabState): DesignerTabState => {
		return {
			...initialState,
			assignedTeam: [],
		};
	};

	const [assignedMembers, setAssignedMembers] = useState<TeamMember[]>([]);
	const [loading, setLoading] = useState(false);
	const [state, dispatch] = useReducer<DesignerTabReducer, DesignerTabState>(designerTabReducer, intialState, init);

	const fetchTeam = async () => {
		const endPoint = newTeamAssignApi(projectId);
		try {
			const response = await fetcher({ endPoint, method: "GET" });

			dispatch({
				type: DesignerTabActionType.UPDATE_ASSIGNED_DESIGNERS,
				value:
					type === "revisionTeam"
						? response.data?.project?.revisionTeam?.map(detail => detail.member) || []
						: response.data?.project?.team?.map(detail => detail.member) || [],
			});
			setAssignedMembers(
				type === "revisionTeam"
					? response.data?.project?.revisionTeam?.map(detail => detail.member) || []
					: response.data?.project?.team?.map(detail => detail.member) || []
			);
		} catch (e) {
			notification.error({ message: e.message });
		}
	};

	useEffect(() => {
		fetchTeam();
	}, []);

	const selectedDesignersId = useMemo(() => {
		return (
			state?.assignedTeam?.map(teamMember => {
				return { _id: teamMember._id, name: getValueSafely(() => teamMember.profile.name, "N/A") };
			}) || []
		);
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
		const endPoint = newTeamAssignApi(projectId);
		const addedMembers = state.assignedTeam
			.filter(teamMember => !assignedMembers.reduce((acc, member) => member._id.includes(teamMember._id) || acc, false))
			.map(morphTeamMemberForApi);
		const removedMembers = assignedMembers
			.filter(teamMember => {
				return !state.assignedTeam.reduce((acc, member) => member._id.includes(teamMember._id) || acc, false);
			})
			.map(morphTeamMemberForApi);

		if (addedMembers.length > 0) {
			const body = {
				type,
				members: addedMembers,
			};
			await fetcher({ endPoint, method: "POST", body });
		}
		if (removedMembers.length > 0) {
			const body = {
				type,
				members: removedMembers,
			};
			await fetcher({ endPoint, method: "DELETE", body });
		}
		setAssignedMembers(state.assignedTeam);
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
		<Spin spinning={loading}>
			<Row gutter={[16, 8]}>
				<Col span={24}>
					<Row gutter={[8, 8]}>
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
							<Row gutter={[8, 8]}>
								<Col span={24}>
									<Text>Role</Text>
								</Col>
								<Col span={24}>
									<Select
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
				<Col md={16} sm={24}>
					<Row gutter={[8, 8]}>
						{state.team.length ? (
							state.team.map(teamMember => {
								return (
									<Col key={teamMember._id} span={8}>
										<Card
											size='small'
											title={
												<Row align='middle' gutter={[8, 8]}>
													<Col>
														<Avatar>
															{getValueSafely<string>(() => {
																return teamMember.profile.name[0];
															}, "N/A").toUpperCase()}
														</Avatar>
													</Col>
													<Col>
														<Text style={{ width: "100%" }} ellipsis strong>
															<CustomDiv width='100%' textTransform='capitalize' overflow='hidden'>
																{getValueSafely<string>(() => {
																	return teamMember.profile.name;
																}, "N/A")}
															</CustomDiv>
														</Text>
													</Col>
												</Row>
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
								<Empty description='No Users found' />
							</Col>
						)}
						<Col span={24}>
							<Row justify='center'>
								<Pagination
									pageSize={12}
									hideOnSinglePage
									current={state.currentPage}
									onChange={onPageChange}
									total={state.totalCount}
								/>
							</Row>
						</Col>
					</Row>
				</Col>
				<Col md={8} sm={24}>
					<TeamSidebar
						state={state}
						onDesignerSelect={onDesignerSelect}
						selectedDesignersId={selectedDesignersId}
						assignDesigners={assignDesigners}
					/>
				</Col>
			</Row>
		</Spin>
	);
};

export default ProjectTeamTab;
