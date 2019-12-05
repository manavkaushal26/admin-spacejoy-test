import { UserProjectType } from "@customTypes/dashboardTypes";
import { ExtendedJSXFC } from "@customTypes/extendedReactComponentTypes";
import { Status } from "@customTypes/userType";
import UserProjectCard from "@sections/Dashboard/userProjectCards";
import { PaddedDiv } from "@sections/Header/styled";
import fetcher from "@utils/fetcher";
import { ChangeEvent, useReducer, useRef } from "react";
import InfiniteScroll from "react-infinite-scroller";
import styled from "styled-components";
import LoadingCard from "./loadingCard";
import { MaxHeightDiv, SilentDivider } from "./styled";
import { Icon, Input, Tabs } from "antd";


interface State {
	searchText: string;
	searchActive: boolean;
	data: UserProjectType[];
	pageCount: number;
	hasMore: boolean;
	searchResults: UserProjectType[];
}
enum actionTypes {
	CLEAR,
	SEARCH_TEXT,
	LOAD_USER_DATA,
	UPDATE_HAS_MORE
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
		case actionTypes.CLEAR:
			return { ...initalState };
		case actionTypes.SEARCH_TEXT:
			return {
				...state,
				searchText: action.value.searchText,
				searchActive: action.value.searchText.length !== 0,
				data: [],
				pageCount: 0,
				hasMore: true,
			};
		case actionTypes.UPDATE_HAS_MORE:
			return {
				...state,
				hasMore: action.value.hasMore
			};
		case actionTypes.LOAD_USER_DATA:
			const dataToUpdate = action.value.pageCount === state.pageCount ? state.data : [...state.data, ...action.value.data];
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
	}
	.ant-tabs-extra-content {
		width: 40%;
	}
	div[role='tabpanel'] {
		overflow-y: scroll;
	}
	.ant-tabs-content {
		div[role='presentation'] + div {
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

const Sidebar: ExtendedJSXFC<SidebarProps> = ({ handleSelectCard, selectedUser}): JSX.Element => {
	const init = initialState => {
		return {
			...initialState,
			data: []
		};
	};
	const [state, dispatch] = useReducer(reducer, initalState, init);

	const displayUsers = state.data;

	const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
		const {
			target: { value }
		} = event;
		dispatch(actionCreator(actionTypes.SEARCH_TEXT, { searchText: value }));
	};

	const TabSearch = () => {
		return (
			<Input
				onChange={handleSearch}
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
		const endpointToHit = state.searchActive ? `/admin/projects?keyword=name:${state.searchText}&` : '/admin/projects?';
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

	return (
		<GrayMaxHeightDiv ref={scrollParentRef}>
			<StyleCorrectedTab tabBarGutter={0} tabBarExtraContent={TabSearch()}>
			<Tabs.TabPane tab="All" key="1">
						<InfiniteScroll
							loader={<LoadingCard key='loadingCard'/>}
							loadMore={fetchData}
							hasMore={state.hasMore}
							useWindow={false}
							getScrollParent={() => scrollParentRef.current}
						>
							{displayUsers.map(userProjectData => {
								return (
									<><UserProjectCard
										selectedUser={selectedUser}
										key={userProjectData._id}
										handleSelectCard={handleSelectCard}
										userProjectData={userProjectData}
									/>
									<PaddedDiv><SilentDivider/></PaddedDiv></>
								);
							})}
						</InfiniteScroll>
				</Tabs.TabPane>
				<Tabs.TabPane tab="Active" key="2">
					<div>
						{displayUsers
							.filter(userProjectData => userProjectData.status === Status.active)
							.map(userProjectData => {
								return (
									<UserProjectCard
										selectedUser={selectedUser}
										key={userProjectData._id}
										handleSelectCard={handleSelectCard}
										userProjectData={userProjectData}
									/>
								);
							})}
					</div>
				</Tabs.TabPane>
				<Tabs.TabPane tab="Completed" key="3">
					<div>
						{displayUsers
							.filter(userProjectData => userProjectData.status === Status.completed)
							.map(userProjectData => {
								return (
										<UserProjectCard
										selectedUser={selectedUser}
											key={userProjectData._id}
											handleSelectCard={handleSelectCard}
											userProjectData={userProjectData}
										/>
								);
							})}
					</div>
				</Tabs.TabPane>
				
			</StyleCorrectedTab>
		</GrayMaxHeightDiv>
	);
};

export default Sidebar;
