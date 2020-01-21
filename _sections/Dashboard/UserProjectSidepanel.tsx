import { UserProjectType, HumanizePhaseInternalNames, PhaseInternalNames } from "@customTypes/dashboardTypes";
import UserProjectCard from "@sections/Dashboard/UserProjectCards";
import { PaddedDiv } from "@sections/Header/styled";
import { debounce } from "@utils/commonUtils";
import fetcher from "@utils/fetcher";
import { Empty, Icon, Input, Tabs, Select } from "antd";
import React, { useReducer, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import styled from "styled-components";
import { editProjectApi } from "@api/projectApi";
import LoadingCard from "./LoadingCard";
import { CustomDiv, MaxHeightDiv, SilentDivider } from "./styled";

const { Option } = Select;
interface State {
	searchText: string;
	searchActive: boolean;
	data: UserProjectType[];
	pageCount: number;
	hasMore: boolean;
	currentTab: string;
	phase: PhaseInternalNames;
	searchResults: UserProjectType[];
}
enum actionTypes {
	CLEAR,
	SEARCH_TEXT,
	LOAD_USER_DATA,
	UPDATE_HAS_MORE,
	TAB_CHANGE,
	PHASE_FILTER,
	CLEAR_DATA,
	UPDATE_PROJECT_START_DATE,
}

interface Action {
	type: actionTypes;
	value: Partial<State>;
}

const initalState: State = {
	searchText: "",
	searchActive: false,
	data: [],
	pageCount: 0,
	phase: null,
	hasMore: true,
	currentTab: "active",
	searchResults: [],
};

const actionCreator = (actionType: actionTypes, value: Partial<State>): Action => {
	return {
		type: actionType,
		value,
	};
};

const reducer = (state: State, action: Action): State => {
	switch (action.type) {
		case actionTypes.PHASE_FILTER:
			return {
				...state,
				phase: action.value.phase,
				data: [],
				pageCount: 0,
				hasMore: true,
			};
		case actionTypes.TAB_CHANGE:
			return {
				...state,
				currentTab: action.value.currentTab,
				data: [],
				pageCount: 0,
				hasMore: true,
			};
		case actionTypes.CLEAR:
			return { ...initalState };
		case actionTypes.CLEAR_DATA:
			return {
				...state,
				data: [],
				pageCount: 0,
				hasMore: true,
			};
		case actionTypes.SEARCH_TEXT:
			return {
				...state,
				searchText: action.value.searchText,
				searchActive: action.value.searchText.length !== 0,
			};
		case actionTypes.UPDATE_HAS_MORE:
			return {
				...state,
				hasMore: action.value.hasMore,
			};
		case actionTypes.LOAD_USER_DATA: {
			const dataToUpdate =
				action.value.pageCount === state.pageCount ? state.data : [...state.data, ...action.value.data];
			return {
				...state,
				data: [...dataToUpdate],
				pageCount: action.value.pageCount,
				hasMore: action.value.hasMore,
			};
		}
		case actionTypes.UPDATE_PROJECT_START_DATE:
			return {
				...state,
				data: [...action.value.data],
			};
		default:
			return state;
	}
};

const StyleCorrectedTab = styled(Tabs)`
	.ant-tabs-bar.ant-tabs-top-bar {
		padding: 0px 12px;
		margin: 0;
	}
`;

const GrayMaxHeightDiv = styled(MaxHeightDiv)`
	background: #f2f4f6;
`;

interface SidebarProps {
	updateStartDateInMainPanel: (pid: string, date: string) => void;
	handleSelectCard: (user: string) => void;
	selectedUser: string;
}

const clearData = (dispatch: React.Dispatch<Action>): void => {
	dispatch(actionCreator(actionTypes.CLEAR_DATA, { data: [] }));
};

const debouncedClear = debounce(clearData, 500);

const handleSearch = (value: string, dispatch: React.Dispatch<Action>): void => {
	dispatch(actionCreator(actionTypes.SEARCH_TEXT, { searchText: value }));
	debouncedClear(dispatch);
};

const getApiUrl = (
	searchActive: boolean,
	searchText: string,
	phase: PhaseInternalNames,
	currentTab: string,
	dataFeed: string
): string => {
	let url = `/admin/projects?sort=-1&${dataFeed}&keyword=`;
	if (searchActive) {
		url = url.concat(`customerName:${searchText},`);
	}
	if (phase) {
		url = url.concat(`currentPhase.name.internalName:${phase},`);
	}
	if (currentTab !== "all") {
		url = url.concat(`status:${currentTab},`);
	}
	if (url.endsWith(",")) {
		url = url.slice(0, -1);
	}
	return url;
};

const Sidebar: React.FC<SidebarProps> = ({
	handleSelectCard,
	selectedUser,
	updateStartDateInMainPanel,
}): JSX.Element => {
	const init = (initialState): State => {
		return {
			...initialState,
			data: [],
		};
	};
	const [state, dispatch] = useReducer(reducer, initalState, init);
	const [loading, setLoading] = useState(false);
	const displayUsers = state.data;

	const handlePhaseChange = (value): void => {
		dispatch(actionCreator(actionTypes.PHASE_FILTER, { phase: value }));
	};

	const TabSearch = (): JSX.Element => {
		return (
			<Input.Group compact>
				<Select value={state.phase} style={{ width: "50%" }} defaultValue={null} onChange={handlePhaseChange}>
					<Option value={null}>Filter by Phase</Option>
					{Object.keys(HumanizePhaseInternalNames).map(key => {
						return (
							<Option key={key} value={key}>
								{HumanizePhaseInternalNames[key]}
							</Option>
						);
					})}
				</Select>
				<Input
					value={state.searchText}
					style={{ width: "50%" }}
					onChange={(e): void => {
						e.persist();
						const {
							target: { value },
						} = e;
						handleSearch(value, dispatch);
					}}
					placeholder="Search Users"
					allowClear
					prefix={<Icon type="search" />}
				/>
			</Input.Group>
		);
	};

	const updateStartDate = (projectId, startDate): void => {
		const newData = state.data.map(project => {
			if (project._id === projectId) {
				return {
					...project,
					startedAt: startDate,
				};
			}

			return { ...project };
		});
		dispatch(
			actionCreator(actionTypes.UPDATE_PROJECT_START_DATE, {
				data: newData,
			})
		);
		updateStartDateInMainPanel(projectId, startDate);
	};

	const fetchData = async (): Promise<void> => {
		const { pageCount } = state;
		const dataFeed = `skip=${pageCount * 10}&limit=10`;
		setLoading(true);
		const endpointToHit = getApiUrl(state.searchActive, state.searchText, state.phase, state.currentTab, dataFeed);
		const resData = await fetcher({ endPoint: endpointToHit, method: "GET" });
		if (resData.statusCode <= 300) {
			const responseData = resData.data.data;
			if (responseData.length > 0) {
				dispatch(
					actionCreator(actionTypes.LOAD_USER_DATA, {
						data: responseData,
						pageCount: state.pageCount + 1,
						hasMore: true,
					})
				);
			} else {
				dispatch(actionCreator(actionTypes.UPDATE_HAS_MORE, { hasMore: false }));
			}
		}
		setLoading(false);
	};

	const scrollParentRef = useRef(null);

	const handleTabChange = (key: string): void => {
		dispatch({ type: actionTypes.TAB_CHANGE, value: { currentTab: key } });
	};

	const onStartClick = async (projectId): Promise<void> => {
		const endpoint = editProjectApi(projectId);
		const currentTime = new Date().toISOString();
		await fetcher({
			endPoint: endpoint,
			body: {
				data: {
					startedAt: currentTime,
				},
			},
			method: "PUT",
		});
		updateStartDate(projectId, currentTime);
	};

	return (
		<GrayMaxHeightDiv>
			<CustomDiv ref={scrollParentRef} overY="scroll" width="100%">
				<StyleCorrectedTab onTabClick={handleTabChange}>
					<Tabs.TabPane tab="Active" key="active">
						{TabSearch()}

						{state.currentTab === "active" && (
							<InfiniteScroll
								loader={<LoadingCard key="loadingCard" />}
								loadMore={fetchData}
								hasMore={state.hasMore}
								useWindow={false}
								getScrollParent={() => scrollParentRef.current}
							>
								{displayUsers.length
									? displayUsers.map(userProjectData => {
											return (
												<>
													<UserProjectCard
														onStartClick={onStartClick}
														selectedUser={selectedUser}
														key={userProjectData._id}
														handleSelectCard={handleSelectCard}
														userProjectData={userProjectData}
													/>
													<PaddedDiv>
														<SilentDivider />
													</PaddedDiv>
												</>
											);
									  })
									: !loading && <Empty description="No Projects found" />}
							</InfiniteScroll>
						)}
					</Tabs.TabPane>
					<Tabs.TabPane tab="Completed" key="completed">
						{TabSearch()}

						{state.currentTab === "completed" && (
							<InfiniteScroll
								loader={<LoadingCard key="loadingCard" />}
								loadMore={fetchData}
								hasMore={state.hasMore}
								useWindow={false}
								getScrollParent={() => scrollParentRef.current}
							>
								{displayUsers.length
									? displayUsers.map(userProjectData => {
											return (
												<>
													<UserProjectCard
														onStartClick={onStartClick}
														selectedUser={selectedUser}
														key={userProjectData._id}
														handleSelectCard={handleSelectCard}
														userProjectData={userProjectData}
													/>
													<PaddedDiv>
														<SilentDivider />
													</PaddedDiv>
												</>
											);
									  })
									: !loading && <Empty description="No Completed Projects found" />}
							</InfiniteScroll>
						)}
					</Tabs.TabPane>
					<Tabs.TabPane tab="All" key="all">
						{TabSearch()}

						{state.currentTab === "all" && (
							<InfiniteScroll
								loader={<LoadingCard key="loadingCard" />}
								loadMore={fetchData}
								hasMore={state.hasMore}
								useWindow={false}
								getScrollParent={() => scrollParentRef.current}
							>
								{displayUsers.length
									? displayUsers.map(userProjectData => {
											return (
												<>
													<UserProjectCard
														selectedUser={selectedUser}
														onStartClick={onStartClick}
														key={userProjectData._id}
														handleSelectCard={handleSelectCard}
														userProjectData={userProjectData}
													/>
													<PaddedDiv>
														<SilentDivider />
													</PaddedDiv>
												</>
											);
									  })
									: !loading && <Empty description="No Projects found" />}
							</InfiniteScroll>
						)}
					</Tabs.TabPane>
				</StyleCorrectedTab>
			</CustomDiv>
		</GrayMaxHeightDiv>
	);
};

export default Sidebar;
