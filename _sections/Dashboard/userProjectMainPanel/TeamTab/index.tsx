import { addTeamMemberApi, userApi } from "@api/userApi";
import { DetailedProjectTeamMember, TeamMember } from "@customTypes/dashboardTypes";
import { getValueSafely, debounce } from "@utils/commonUtils";
import fetcher from "@utils/fetcher";
import { Avatar, Card, Checkbox, Col, Row, Typography, Select, Empty, Input } from "antd";
import React, { useEffect, useMemo, useReducer } from "react";
import { CustomDiv, Form } from "../../styled";
import { DesignerTabReducer, DesignerTabState, DesignerTabActionType, designerTabReducer } from "./teamTabReducer";
import TeamSidebar from "./TeamSidebar";
import { ProjectRoles } from "@customTypes/userType";

const { Text } = Typography;
const { Option } = Select;

interface DesignerTabInterface {
	projectId: string;
	assignedTeam: TeamMember[];
	setLoading: React.Dispatch<React.SetStateAction<boolean>>;
	refetchData: () => void;
}

const intialState: DesignerTabState = {
	team: [],
	assignedTeam: [],
	loading: false,
	searchText: "",
	pageCount: 0,
	role: ProjectRoles.Designer
};

const fetchDesigners = async (setLoading, state: DesignerTabState, dispatch): Promise<void> => {
	setLoading(true);
	const endpoint = userApi();
	const responseData = await fetcher({
		endPoint: endpoint,
		method: "POST",
		body: {
			data: {
				role: {
					search: "single",
					value: state.role
				},
				"profile.name": { search: "single", value: state.searchText }
			}
		}
	});
	if (responseData.data) {
		if (responseData.data.data) {
			dispatch({
				type: DesignerTabActionType.UPDATE_DATA,
				value: {
					data: responseData.data.data,
					pageCount: state.pageCount + 1
				}
			});
		}
	}
	setLoading(false);
};

const debouncedFetchDesigners = debounce(fetchDesigners, 500);

const TeamTab: React.FC<DesignerTabInterface> = ({ projectId, assignedTeam, setLoading, refetchData }): JSX.Element => {
	const init = (initialState: DesignerTabState): DesignerTabState => {
		return {
			...initialState,
			assignedTeam: assignedTeam || []
		};
	};

	const [state, dispatch] = useReducer<DesignerTabReducer, DesignerTabState>(designerTabReducer, intialState, init);

	const selectedDesignersId = useMemo(() => {
		return state.assignedTeam.map(teamMember => {
			return { _id: teamMember._id, name: getValueSafely(() => teamMember.profile.name, "N/A") };
		});
	}, [state.assignedTeam]);

	useEffect(() => {
		if (projectId) {
			debouncedFetchDesigners(setLoading, state, dispatch);
		}
	}, [state.role, state.searchText]);

	const onDesignerSelect = (id: string, checked: boolean) => {
		if (checked) {
			const teamMember = state.team.find(teamMember => {
				return teamMember._id === id;
			});
			dispatch({ type: DesignerTabActionType.ASSIGN_DESIGNER, value: teamMember });
		} else {
			dispatch({ type: DesignerTabActionType.UNASSIGN_DESIGNER, value: id });
		}
	};

	const assignDesigners = async () => {
		setLoading(true);
		const assignedTeam = state.assignedTeam.map(teamMember => {
			return { member: teamMember._id, memberName: teamMember.profile.name };
		});
		const endpoint = addTeamMemberApi(projectId);
		const body = {
			data: {
				memberList: assignedTeam
			}
		};
		await fetcher({ endPoint: endpoint, method: "PUT", body: body });
		refetchData();
		setLoading(false);
	};

	const onSearchTextChange = e => {
		const {
			target: { value }
		} = e;
		dispatch({ type: DesignerTabActionType.UPDATE_SEARCH_TEXT, value: value });
	};

	return (
		<CustomDiv py="10px" px="10px">
			<Row>
				<Form>
					<CustomDiv py="1rem" type="flex">
						<CustomDiv flexBasis="30ch" align="baseline" type="flex" inline flexDirection="row">
							<label style={{ flexBasis: "26ch" }}>Search by Name</label>
							<Input onChange={onSearchTextChange} />
						</CustomDiv>
						<CustomDiv pl="0.5rem" flexBasis="30ch" align="baseline" type="flex" inline flexDirection="row">
							<label style={{ flexBasis: "4ch" }}>Role</label>
							<Select
								value={state.role}
								onSelect={value => dispatch({ type: DesignerTabActionType.ROLE_CHANGE, value: value })}
							>
								{Object.keys(ProjectRoles).map(key => {
									return <Option value={ProjectRoles[key]}>{key}</Option>;
								})}
							</Select>
						</CustomDiv>
					</CustomDiv>
				</Form>
				<Col md={16}>
					<CustomDiv type="flex" wrap="wrap">
						{state.team.length ? (
							state.team.map(teamMember => {
								return (
									<CustomDiv key={teamMember._id} flexBasis="25ch" px="8px" py="8px">
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
													checked={selectedDesignersId.map(teamMember => teamMember._id).includes(teamMember._id)}
													onChange={e => {
														onDesignerSelect(teamMember._id, e.target.checked);
													}}
												/>
											}
											key={teamMember._id}
										>
											Current Projects: N/A
										</Card>
									</CustomDiv>
								);
							})
						) : (
							<CustomDiv width="100%" height="100%">
								<Empty description="No Users found" />
							</CustomDiv>
						)}
					</CustomDiv>
				</Col>
				<TeamSidebar
					state={state}
					onDesignerSelect={onDesignerSelect}
					selectedDesignersId={selectedDesignersId}
					assignDesigners={assignDesigners}
				/>
			</Row>
		</CustomDiv>
	);
};

export default TeamTab;
