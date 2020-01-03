import { UserProjectType } from "@customTypes/dashboardTypes";
import { ExtendedJSXFC } from "@customTypes/extendedReactComponentTypes";
import UserProjectCard from "@sections/Dashboard/UserProjectCards";
import { PaddedDiv } from "@sections/Header/styled";
import { debounce } from "@utils/commonUtils";
import fetcher from "@utils/fetcher";
import { Empty, Icon, Input, Tabs } from "antd";
import { useEffect, useReducer, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import styled from "styled-components";
import LoadingCard from "./LoadingCard";
import { CustomDiv, MaxHeightDiv, SilentDivider } from "./styled";

interface State {
	searchText: string;
	searchActive: boolean;
	data: UserProjectType[];
	pageCount: number;
	hasMore: boolean;
	currentTab: string;
	searchResults: UserProjectType[];
}
enum actionTypes {
	CLEAR,
	SEARCH_TEXT,
	LOAD_USER_DATA,
	UPDATE_HAS_MORE,
	TAB_CHANGE
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
	hasMore: true,
	currentTab: "active",
	searchResults: []
};

const actionCreator = (actionType: actionTypes, value: Partial<State>): Action => {
	return {
		type: actionType,
		value: value
	};
};

const reducer = (state: State, action: Action): State => {
	switch (action.type) {
		case actionTypes.TAB_CHANGE:
			return {
				...state,
				currentTab: action.value.currentTab,
				data: [],
				pageCount: 0,
				hasMore: true
			};
		case actionTypes.CLEAR:
			return { ...initalState };
		case actionTypes.SEARCH_TEXT:
			return {
				...state,
				searchText: action.value.searchText,
				searchActive: action.value.searchText.length !== 0,
				data: [],
				pageCount: 0,
				hasMore: true
			};
		case actionTypes.UPDATE_HAS_MORE:
			return {
				...state,
				hasMore: action.value.hasMore
			};
		case actionTypes.LOAD_USER_DATA:
			const dataToUpdate =
				action.value.pageCount === state.pageCount ? state.data : [...state.data, ...action.value.data];
			return {
				...state,
				data: [...dataToUpdate],
				pageCount: action.value.pageCount,
				hasMore: action.value.hasMore
			};
		default:
			return state;
	}
};

const StyleCorrectedTab = styled(Tabs)`
	.ant-tabs-nav-container {
		width: 60%;
	}
	.ant-tabs-bar.ant-tabs-top-bar {
		padding: 0px 12px;
	}
	&.ant-tabs {
		width: 100%;
	}
	.ant-tabs-extra-content {
		width: 40%;
	}
`;

const GrayMaxHeightDiv = styled(MaxHeightDiv)`
	background: #f2f4f6;
`;

interface SidebarProps {
	handleSelectCard: (user: string) => void;
	selectedUser: string;
}

const handleSearch = (value: string, dispatch: React.Dispatch<Action>) => {
	dispatch(actionCreator(actionTypes.SEARCH_TEXT, { searchText: value }));
};

const debouncedSearch = debounce(handleSearch, 500);

const Sidebar: ExtendedJSXFC<SidebarProps> = ({ handleSelectCard, selectedUser }): JSX.Element => {
	const init = initialState => {
		return {
			...initialState,
			data: []
		};
	};
	const [state, dispatch] = useReducer(reducer, initalState, init);
	const [loading, setLoading] = useState(false);
	const displayUsers = state.data;

	const TabSearch = () => {
		return (
			<Input
				onChange={e => {
					e.persist();
					const {
						target: { value }
					} = e;
					debouncedSearch(value, dispatch);
				}}
				placeholder="Search Users"
				allowClear
				prefix={<Icon type="search" />}
				style={{ width: "100%" }}
			/>
		);
	};

	const fetchData = async () => {
		const { pageCount } = state;
		const dataFeed = `skip=${pageCount * 10}&limit=10`;
		setLoading(true);
		const endpointToHit = state.searchActive
			? `/admin/projects?sort=-1&keyword=customerName:${state.searchText}&${
					state.currentTab !== "all" ? `status:${state.currentTab}&` : ""
			  }`
			: `/admin/projects?sort=-1&${state.currentTab !== "all" ? `keyword=status:${state.currentTab}&` : ""}`;
		const resData = await fetcher({ endPoint: `${endpointToHit}${dataFeed}`, method: "GET" });
		if (resData.statusCode <= 300) {
			const responseData = resData.data.data;
			if (responseData.length > 0) {
				dispatch(
					actionCreator(actionTypes.LOAD_USER_DATA, {
						data: responseData,
						pageCount: state.pageCount + 1,
						hasMore: true
					})
				);
			} else {
				dispatch(actionCreator(actionTypes.UPDATE_HAS_MORE, { hasMore: false }));
			}
		}
		setLoading(false);
	};

	useEffect(() => {
		fetchData();
	}, [state.currentTab]);

	const scrollParentRef = useRef(null);

	const handleTabChange = (key: string, e: MouseEvent) => {
		dispatch({ type: actionTypes.TAB_CHANGE, value: { currentTab: key } });
	};

	return (
		<GrayMaxHeightDiv>
			<CustomDiv ref={scrollParentRef} overY="scroll" width="100%">
				<StyleCorrectedTab tabBarGutter={0} onTabClick={handleTabChange} tabBarExtraContent={TabSearch()}>
					<Tabs.TabPane tab="Active" key="active">
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
					<Tabs.TabPane tab="All" key="all">
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
