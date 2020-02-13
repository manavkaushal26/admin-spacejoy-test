import { startProjectApi } from "@api/projectApi";
import {
	HumanizePhaseInternalNames,
	PhaseCustomerNames,
	PhaseInternalNames,
	RoomNameSearch,
} from "@customTypes/dashboardTypes";
import UserProjectCard from "@sections/Dashboard/UserProjectCards";
import { PaddedDiv } from "@sections/Header/styled";
import { debounce } from "@utils/commonUtils";
import fetcher from "@utils/fetcher";
import { Col, Collapse, Empty, Icon, Input, Row, Select, Tabs, Typography } from "antd";
import hotkeys from "hotkeys-js";
import React, { useEffect, useReducer, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import styled from "styled-components";
import LoadingCard from "../LoadingCard";
import { CustomDiv, MaxHeightDiv, SilentButton, SilentDivider } from "../styled";
import {
	phaseDefaultValues,
	SortFields,
	UserProjectSidePanelAction,
	UserProjectSidePanelActionCreator,
	UserProjectSidePanelActionTypes,
	UserProjectSidePanelInitialState,
	UserProjectSidePanelReducer,
	UserProjectSidePanelState,
} from "./reducer";

const { Option } = Select;

const { Text } = Typography;

const StyleCorrectedTab = styled(Tabs)`
	.ant-tabs-bar.ant-tabs-top-bar {
		padding: 0px 12px;
		margin: 0;
	}
`;

const GrayMaxHeightDiv = styled(MaxHeightDiv)`
	border-right: 1px #eeeeee solid;
	background: #f2f4f6;
`;

interface SidebarProps {
	updateStartDateInMainPanel: (pid: string, date: string) => void;
	handleSelectCard: (user: string) => void;
	selectedUser: string;
	projectPhaseUpdateValue: {
		pid: string;
		projectPhase: {
			internalName: PhaseInternalNames;
			customerName: PhaseCustomerNames;
		};
	};
	collapsed: boolean;
	setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
	setProjectPhaseUpdateValue: React.Dispatch<
		React.SetStateAction<{
			pid: string;
			projectPhase: {
				internalName: PhaseInternalNames;
				customerName: PhaseCustomerNames;
			};
		}>
	>;
}

const clearData = (dispatch: React.Dispatch<UserProjectSidePanelAction>): void => {
	dispatch(UserProjectSidePanelActionCreator(UserProjectSidePanelActionTypes.CLEAR_DATA, { data: [] }));
};

const debouncedClear = debounce(clearData, 1000);

const handleSearch = (
	value: string,
	dispatch: React.Dispatch<UserProjectSidePanelAction>,
	type: "customer" | "designer"
): void => {
	if (type === "customer") {
		dispatch(
			UserProjectSidePanelActionCreator(UserProjectSidePanelActionTypes.NAME_SEARCH_TEXT, { nameSearchText: value })
		);
	} else if (type === "designer") {
		dispatch(
			UserProjectSidePanelActionCreator(UserProjectSidePanelActionTypes.DESIGN_SEARCH_TEXT, {
				designerSearchText: value,
			})
		);
	}
	debouncedClear(dispatch);
};

const getRequestBody = (
	nameSearchText: string,
	designerSearchText: string,
	phase: PhaseInternalNames[],
	currentTab: string,
	roomName: string,
	by: SortFields,
	order: -1 | 1
): Record<string, Record<string, string | PhaseInternalNames[]>> => {
	const body = {
		customerName: { search: "single", value: nameSearchText },
		"team.memberName": { search: "single", value: designerSearchText },
		"currentPhase.name.internalName": { search: "array", value: phase },
		status: { search: "single", value: currentTab === "all" ? "" : currentTab },
		name: {
			search: "single",
			value: roomName,
		},
		sort: {
			by,
			order: order.toString(),
		},
	};
	return body;
};

const Sidebar: React.FC<SidebarProps> = ({
	handleSelectCard,
	selectedUser,
	collapsed,
	setCollapsed,
	updateStartDateInMainPanel,
	projectPhaseUpdateValue,
	setProjectPhaseUpdateValue,
}): JSX.Element => {
	const init = (initialState): UserProjectSidePanelState => {
		return {
			...initialState,
			data: [],
		};
	};
	const [state, dispatch] = useReducer(UserProjectSidePanelReducer, UserProjectSidePanelInitialState, init);
	const [loading, setLoading] = useState(false);
	const displayUsers = state.data;
	const [activePanel, setActivePanel] = useState<string>(null);
	const handleSelectFilter = (value, type: "phase" | "name" | "sortOrder" | "sortBy"): void => {
		if (type === "phase") {
			dispatch(UserProjectSidePanelActionCreator(UserProjectSidePanelActionTypes.PHASE_FILTER, { phase: value }));
		}
		if (type === "name") {
			dispatch(UserProjectSidePanelActionCreator(UserProjectSidePanelActionTypes.NAME_FILTER, { name: value }));
		}
		if (type === "sortOrder") {
			dispatch(UserProjectSidePanelActionCreator(UserProjectSidePanelActionTypes.SORT_ORDER, { sortOrder: value }));
		}
		if (type === "sortBy") {
			dispatch(UserProjectSidePanelActionCreator(UserProjectSidePanelActionTypes.SORT_BY, { sortBy: value }));
		}
		debouncedClear(dispatch);
	};

	const searchRef = useRef(null);

	useEffect(() => {
		if (searchRef.current) {
			searchRef.current.handleKeyDown = (event): void => {
				event.persist();
				if (event.key === "Escape") {
					event.target.blur();
				}
			};
		}

		hotkeys("ctrl+k, command+k, ctrl+space, ctrl+f, command+f", event => {
			event.stopPropagation();
			event.preventDefault();

			if (collapsed) {
				setCollapsed(false);
				if (activePanel !== "filterandsort") {
					setActivePanel("filterandsort");
				}
				searchRef.current.focus();
			} else if (activePanel === "filterandsort" && !collapsed) {
				setActivePanel(undefined);
			} else {
				setCollapsed(false);
				setActivePanel("filterandsort");
				searchRef.current.focus();
			}
		});

		hotkeys("esc", event => {
			event.stopPropagation();
			event.preventDefault();
			setCollapsed(false);

			if (activePanel === "filterandsort") {
				setActivePanel(undefined);
			}
		});
		return (): void => {
			hotkeys.unbind("ctrl+k, command+k, ctrl+space, ctrl+f, command+f");
			hotkeys.unbind("esc");
		};
	}, [searchRef, activePanel, collapsed]);

	useEffect(() => {
		if (projectPhaseUpdateValue) {
			const newData = state.data.map(project => {
				if (project._id === projectPhaseUpdateValue.pid) {
					return {
						...project,
						currentPhase: {
							...project.currentPhase,
							name: projectPhaseUpdateValue.projectPhase,
						},
					};
				}
				return { ...project };
			});
			dispatch(
				UserProjectSidePanelActionCreator(UserProjectSidePanelActionTypes.UPDATE_PROJECT_START_DATE, {
					data: newData,
				})
			);
		}

		setProjectPhaseUpdateValue(null);
	}, [projectPhaseUpdateValue]);

	const TabSearch = (): JSX.Element => {
		return (
			<Collapse activeKey={activePanel} onChange={(keys): void => setActivePanel(keys[0])}>
				<Collapse.Panel key="filterandsort" header="Sort &amp; Filters">
					<Row type="flex" justify="end">
						<Col>
							<SilentButton
								onClick={(): void => {
									dispatch({ type: UserProjectSidePanelActionTypes.CLEAR, value: {} });
								}}
								type="link"
							>
								<small>Reset Filters</small>
							</SilentButton>
						</Col>
					</Row>
					<Row gutter={[4, 8]}>
						<Col span={24}>
							<Row gutter={[0, 4]}>
								<Col>
									<Text>Customer</Text>
								</Col>
								<Col>
									<Input
										ref={searchRef}
										value={state.nameSearchText}
										style={{ width: "100%" }}
										onChange={(e): void => {
											e.persist();
											const {
												target: { value },
											} = e;
											handleSearch(value, dispatch, "customer");
										}}
										placeholder="Customer Name"
										allowClear
										prefix={<Icon type="search" />}
									/>
								</Col>
							</Row>
						</Col>
						<Col span={12}>
							<Row gutter={[0, 4]}>
								<Col>
									<Text>Designer</Text>
								</Col>
								<Col>
									<Input
										value={state.designerSearchText}
										style={{ width: "100%" }}
										onChange={(e): void => {
											e.persist();
											const {
												target: { value },
											} = e;
											handleSearch(value, dispatch, "designer");
										}}
										placeholder="Designer Name"
										allowClear
										prefix={<Icon type="search" />}
									/>
								</Col>
							</Row>
						</Col>
						<Col span={12}>
							<Row gutter={[0, 4]}>
								<Col>
									<Text>Room Name</Text>
								</Col>
								<Col>
									<Select
										value={state.name}
										style={{ width: "100%" }}
										defaultValue={null}
										onChange={(value): void => handleSelectFilter(value, "name")}
									>
										<Option value="">Filter by Room Name</Option>
										{RoomNameSearch.map(roomName => {
											return (
												<Option key={roomName} value={roomName}>
													{roomName}
												</Option>
											);
										})}
									</Select>
								</Col>
							</Row>
						</Col>
						<Col span={24}>
							<Row gutter={[0, 4]}>
								<Col>
									<Text>Phase</Text>
								</Col>
								<Col>
									<Select
										value={state.phase}
										style={{ width: "100%" }}
										defaultValue={phaseDefaultValues}
										mode="multiple"
										maxTagCount={2}
										placeholder="All Phases Shown"
										onChange={(value): void => handleSelectFilter(value, "phase")}
									>
										{Object.keys(HumanizePhaseInternalNames).map(key => {
											return (
												<Option key={key} value={key}>
													{HumanizePhaseInternalNames[key]}
												</Option>
											);
										})}
									</Select>
								</Col>
							</Row>
						</Col>

						<Col span={12}>
							<Row gutter={[0, 4]}>
								<Col>
									<Text>Sort by</Text>
								</Col>
								<Col>
									<Select
										value={state.sortBy}
										style={{ width: "100%" }}
										defaultValue={SortFields["End Date"]}
										onChange={(value): void => handleSelectFilter(value, "sortBy")}
									>
										{Object.keys(SortFields).map(key => {
											return (
												<Option key={key} value={SortFields[key]}>
													{key}
												</Option>
											);
										})}
									</Select>
								</Col>
							</Row>
						</Col>
						<Col span={12}>
							<Row gutter={[0, 4]}>
								<Col>
									<Text>Sort order</Text>
								</Col>
								<Col>
									<Select
										value={state.sortOrder}
										style={{ width: "100%" }}
										onChange={(value): void => handleSelectFilter(value, "sortOrder")}
										defaultValue={1}
									>
										<Option value={-1}>Descending</Option>
										<Option value={1}>Ascending</Option>
									</Select>
								</Col>
							</Row>
						</Col>
					</Row>
				</Collapse.Panel>
			</Collapse>
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
			UserProjectSidePanelActionCreator(UserProjectSidePanelActionTypes.UPDATE_PROJECT_START_DATE, {
				data: newData,
			})
		);
		updateStartDateInMainPanel(projectId, startDate);
	};

	const fetchData = async (): Promise<void> => {
		const { pageCount } = state;
		const dataFeed = `skip=${pageCount * 10}&limit=10`;
		const url = `/admin/projects/search?sort=${state.sortOrder}&${dataFeed}`;

		setLoading(true);
		const body = getRequestBody(
			state.nameSearchText,
			state.designerSearchText,
			state.phase,
			state.currentTab,
			state.name,
			state.sortBy,
			state.sortOrder
		);

		const resData = await fetcher({
			endPoint: url,
			method: "POST",
			body: {
				data: body,
			},
		});
		if (resData.statusCode <= 300) {
			const responseData = resData.data.data;
			if (responseData.length > 0) {
				dispatch(
					UserProjectSidePanelActionCreator(UserProjectSidePanelActionTypes.LOAD_USER_DATA, {
						data: responseData,
						pageCount: state.pageCount + 1,
						hasMore: true,
					})
				);
			} else {
				dispatch(
					UserProjectSidePanelActionCreator(UserProjectSidePanelActionTypes.UPDATE_HAS_MORE, { hasMore: false })
				);
			}
		}
		setLoading(false);
	};

	useEffect(() => {
		if (typeof window !== "undefined") {
			fetchData();
		}
	}, []);

	const scrollParentRef = useRef(null);

	const handleTabChange = (key: string): void => {
		dispatch({ type: UserProjectSidePanelActionTypes.TAB_CHANGE, value: { currentTab: key } });
	};

	const onStartClick = async (projectId): Promise<void> => {
		const endpoint = startProjectApi(projectId);
		const currentTime = new Date().toISOString();
		await fetcher({
			endPoint: endpoint,
			method: "PUT",
			body: { data: {} },
		});
		updateStartDate(projectId, currentTime);
	};

	return (
		<GrayMaxHeightDiv>
			<CustomDiv ref={scrollParentRef} overY="scroll" width="100%" height="100%">
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
					<Tabs.TabPane tab="Suspended" key="suspended">
						{TabSearch()}

						{state.currentTab === "suspended" && (
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
