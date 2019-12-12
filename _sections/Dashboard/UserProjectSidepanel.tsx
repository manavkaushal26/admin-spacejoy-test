import { UserProjectType } from "@customTypes/dashboardTypes";
import { ExtendedJSXFC } from "@customTypes/extendedReactComponentTypes";
import { Status } from "@customTypes/userType";
import UserProjectCard from "@sections/Dashboard/UserProjectCards";
import { PaddedDiv } from "@sections/Header/styled";
import fetcher from "@utils/fetcher";
import { ChangeEvent, useReducer, useRef } from "react";
import InfiniteScroll from "react-infinite-scroller";
import styled from "styled-components";
import LoadingCard from "./LoadingCard";
import { MaxHeightDiv, SilentDivider, CustomDiv } from "./styled";
import { Icon, Input, Tabs, Empty } from "antd";
import { debounce } from "@utils/commonUtils";

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
	currentTab: "all",
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
		overflow-y: scroll;
		width: 100%;
	}
	.ant-tabs-extra-content {
		width: 40%;
	}
	div[role="tabpanel"] {
		overflow-y: scroll;
	}
	.ant-tabs-content {
		div[role="presentation"] + div {
			overflow-y: scroll;
		}
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
		const endpointToHit = state.searchActive
			? `/admin/projects?keyword=customerName:${state.searchText}&${
					state.currentTab !== "all" ? `status:${state.currentTab}&` : ""
			  }`
			: `/admin/projects?${state.currentTab !== "all" ? `keyword=status:${state.currentTab}&` : ""}`;
		const resData = await fetcher({ endPoint: `${endpointToHit}${dataFeed}`, method: "GET" });
		if (resData.status === "success") {
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
	};

	const scrollParentRef = useRef(null);

	const handleTabChange = (key: string, e: MouseEvent) => {
		dispatch({ type: actionTypes.TAB_CHANGE, value: { currentTab: key } });
	};

	return (
		<GrayMaxHeightDiv>
			<StyleCorrectedTab tabBarGutter={0} onTabClick={handleTabChange} tabBarExtraContent={TabSearch()}>
				<Tabs.TabPane tab="All" key="all">
					<CustomDiv ref={scrollParentRef} overY="scroll">
						<InfiniteScroll
							loader={<LoadingCard key="loadingCard" />}
							loadMore={fetchData}
							hasMore={state.hasMore}
							useWindow={false}
							getScrollParent={() => scrollParentRef.current}
						>
							<CustomDiv {...(state.currentTab === "active" ? { ref: scrollParentRef } : {})} overY="scroll">
								{displayUsers.length ? (
									displayUsers.map(userProjectData => {
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
								) : (
									<Empty description="No Projects found" />
								)}
							</CustomDiv>
						</InfiniteScroll>
					</CustomDiv>
				</Tabs.TabPane>
				<Tabs.TabPane tab="Active" key="active">
					<CustomDiv {...(state.currentTab === "active" ? { ref: scrollParentRef } : {})} overY="scroll">
						{displayUsers.length ? (
							displayUsers.map(userProjectData => {
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
						) : (
							<Empty description="No Active projects found" />
						)}
					</CustomDiv>
				</Tabs.TabPane>
				<Tabs.TabPane tab="Completed" key="completed">
					<CustomDiv {...(state.currentTab === "completed" ? { ref: scrollParentRef } : {})} overY="scroll">
						{displayUsers.length ? (
							displayUsers.map(userProjectData => {
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
						) : (
							<Empty description="No Completed projects found" />
						)}
					</CustomDiv>
				</Tabs.TabPane>
			</StyleCorrectedTab>
		</GrayMaxHeightDiv>
	);
};

export default Sidebar;
