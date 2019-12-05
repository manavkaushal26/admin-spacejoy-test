import { addTeamMemberApi, userApi } from "@api/userApi";
import { TeamMember } from "@customTypes/dashboardTypes";
import { getValueSafely } from "@utils/commonUtils";
import fetcher from "@utils/fetcher";
import { Avatar, Button, Card, Checkbox, Col, Row, Typography } from "antd";
import React, { useEffect, useMemo, useReducer } from "react";
import styled from "styled-components";
import { CustomDiv, ModifiedText } from "../styled";

const { Text, Title } = Typography;

const StyledButton = styled(Button)<{ fullWidth: boolean }>`
	width: ${({ fullWidth }) => (fullWidth ? "100%" : null)};
`;

const GreyColumn = styled(Col)`
	background-color: #f2f4f6;
`;

const NoBodyCard = styled(Card)`
	width: 100px;
	.ant-card-head {
		position: relative;
		> .ant-card-head-wrapper > .ant-card-extra {
			position: absolute;
			top: 4px;
			right: 4px;
			padding: 0px;
			align-self: normal;
		}
	}
	.ant-card-body {
		display: none;
	}
`;

interface DesignerTabInterface {
	projectId: string;
	assignedDesigners: TeamMember[];
	setLoading: React.Dispatch<React.SetStateAction<boolean>>;
	refetchData: () => void;
}

interface State {
	designers: TeamMember[];
	assignedDesigners: TeamMember[];
	loading: boolean;
	searchText: string;
	searchActive: boolean;
	pageCount: number;
	hasMore: boolean;
}

const intialState: State = {
	designers: [],
	assignedDesigners: [],
	loading: false,
	searchText: "",
	searchActive: false,
	pageCount: 0,
	hasMore: true
};

enum ActionType {
	UPDATE_SEARCH_TEXT,
	UPDATE_DATA,
	TOGGLE_LOADING,
	ASSIGN_DESIGNER,
	UNASSIGN_DESIGNER
}

interface Action {
	type: ActionType;
	value: any;
}

interface Reducer {
	(state: State, action: Action): State;
}
const reducer: Reducer = (state, action) => {
	switch (action.type) {
		case ActionType.TOGGLE_LOADING:
			return {
				...state,
				loading: !state.loading
			};
		case ActionType.UPDATE_SEARCH_TEXT:
			return {
				...state,
				searchText: action.value,
				searchActive: action.value.length,
				designers: [],
				loading: true,
				hasMore: true
			};
		case ActionType.UPDATE_DATA:
			return {
				...state,
				designers: [...state.designers, ...action.value.data],
				pageCount: action.value.pageCount,
				hasMore: true
			};
		case ActionType.ASSIGN_DESIGNER:
			return {
				...state,
				assignedDesigners: [...state.assignedDesigners, action.value]
			};
		case ActionType.UNASSIGN_DESIGNER:
			return {
				...state,
				assignedDesigners: [...state.assignedDesigners.filter(designer => designer._id !== action.value)]
			};
		default:
			return state;
	}
};

const DesignerTab: React.FC<DesignerTabInterface> = ({
	projectId,
	assignedDesigners,
	setLoading,
	refetchData
}): JSX.Element => {
	const init = (initialState: State): State => {
		return {
			...initialState,
			assignedDesigners: assignedDesigners || []
		};
	};

	const [state, dispatch] = useReducer<Reducer, State>(reducer, intialState, init);

	const selectedDesignersId = useMemo(() => {
		return state.assignedDesigners.map(designer => {
			return designer._id;
		});
	}, [state.assignedDesigners]);

	const fetchDesigners = async (): Promise<void> => {
		setLoading(true);
		const endpoint = userApi({ role: "designer", name: state.searchText });
		const responseData = await fetcher({ endPoint: endpoint, method: "GET" });
		if (responseData.data) {
			if (responseData.data.data.length > 0) {
				dispatch({
					type: ActionType.UPDATE_DATA,
					value: {
						data: responseData.data.data,
						pageCount: state.pageCount + 1
					}
				});
			}
		}
		setLoading(false);
	};

	useEffect(() => {
		if (projectId) {
			fetchDesigners();
		}
	}, []);

	const onDesignerSelect = (id: string, checked: boolean) => {
		if (checked) {
			const designer = state.designers.find(designer => {
				return designer._id === id;
			});
			dispatch({ type: ActionType.ASSIGN_DESIGNER, value: designer });
		} else {
			dispatch({ type: ActionType.UNASSIGN_DESIGNER, value: id });
		}
	};

	const assignDesigners = async () => {
		setLoading(true);
		const assignedDesigners = state.assignedDesigners.map(designer => {
			return designer._id;
		});
		const endpoint = addTeamMemberApi(projectId);
		const body = {
			data: {
				memberList: assignedDesigners
			}
		};
		await fetcher({ endPoint: endpoint, method: "PUT", body: body });
		refetchData();
		setLoading(false);
	};

	return (
		<CustomDiv py="10px" px="10px">
			<Row>
				<Col md={16}>
					<CustomDiv type="flex" wrap="wrap">
						{state.designers.map(designer => {
							return (
								<CustomDiv flexBasis="25ch" px='8px' py='8px'>
									<Card
										size="small"
										title={
											<CustomDiv type="flex" align="center">
												<CustomDiv py="8px" width="30%" overflow="visible">
													<Avatar>
														{getValueSafely<string>(() => {
															return designer.profile.name[0];
														}, "N/A").toUpperCase()}
													</Avatar>
												</CustomDiv>
												<CustomDiv width="70%">
													<Text style={{width: "100%"}} ellipsis strong>
														<CustomDiv width="100%" textTransform="capitalize" overflow="hidden">
															{getValueSafely<string>(() => {
																return designer.profile.name;
															}, "N/A")}
														</CustomDiv>
													</Text>
												</CustomDiv>
											</CustomDiv>
										}
										extra={
											<Checkbox
												checked={selectedDesignersId.includes(designer._id)}
												onChange={e => {
													onDesignerSelect(designer._id, e.target.checked);
												}}
											/>
										}
										key={designer._id}
									>
										Current Projects: 4
									</Card>
								</CustomDiv>
							);
						})}
					</CustomDiv>
				</Col>
				<GreyColumn md={8}>
					<CustomDiv width="100%" type="flex" justifyContent="space-around">
						<Text strong>Assigned Designers</Text>
					</CustomDiv>
					<CustomDiv pt="16px" px="12px" py="12px">
						<Row>
							{state.assignedDesigners.map(designer => (
								<NoBodyCard
									size="small"
									title={
										<>
											<CustomDiv type="flex" justifyContent="space-around">
												<Avatar>
													{getValueSafely<string>(() => {
														return designer.profile.name[0];
													}, "N/A")}
												</Avatar>
											</CustomDiv>
											<CustomDiv type="flex" justifyContent="space-around">
												<ModifiedText textTransform="capitalize">
													{getValueSafely<string>(() => {
														return designer.profile.firstName;
													}, "N/A")}
												</ModifiedText>
											</CustomDiv>
										</>
									}
									extra={
										<Checkbox
											onChange={e => {
												onDesignerSelect(designer._id, e.target.checked);
											}}
											checked={selectedDesignersId.includes(designer._id)}
										/>
									}
								></NoBodyCard>
							))}
						</Row>
					</CustomDiv>

					<CustomDiv>
						<StyledButton fullWidth type="primary" onClick={assignDesigners}>
							Update Designers
						</StyledButton>
					</CustomDiv>
				</GreyColumn>
			</Row>
		</CustomDiv>
	);
};

export default DesignerTab;
