import { Tabs, Input, Icon } from "antd";
import { Status } from "@customTypes/userType";
import UserProjectCard from "@sections/Dashboard/userProjectCards";
import { UserProjectType } from "@customTypes/dashboardTypes";
import { MaxHeightDiv } from "./styled";
import { useReducer, useMemo, ChangeEvent, useState, useRef, useEffect } from "react";
import styled from "styled-components";
import InfiniteScroll from "react-infinite-scroller";
import fetcher from "@utils/fetcher";
import { ExtendedJSXFC } from "@customTypes/extendedReactComponentTypes";
import { NextPageContext } from "next";
import LoadingCard from "./loadingCard";

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
				searchActive: action.value.searchText.length !== 0
			};
		case actionTypes.UPDATE_HAS_MORE:
			return {
				...state,
				hasMore: action.value.hasMore
			};
		case actionTypes.LOAD_USER_DATA:
			return {
				...state,
				data: [...state.data, ...action.value.data],
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
	.ant-tabs-extra-content {
		width: 40%;
	}
`;

interface SidebarProps {
	userProjectData?: UserProjectType[];
	handleSelectCard: (user: string) => void;
	isServer: boolean;
}

const Sidebar: ExtendedJSXFC<SidebarProps> = ({ userProjectData, handleSelectCard, isServer }): JSX.Element => {
	const init = initialState => {
		return {
			...initialState,
			data: userProjectData
		};
	};

	const [state, dispatch] = useReducer(reducer, initalState, init);

	const displayUsers = useMemo(() => {
		return state.data.filter(user => {
			console.log(user.name.toLowerCase().includes(state.searchText.toLowerCase()));
			return user.name.toLowerCase().includes(state.searchText.toLowerCase());
		});
	}, [state.searchText, state.data]);

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
		const dataFeed = `?skip=${pageCount * 10}&limit=10`;
		const resData = await fetcher({ endPoint: `/projects${dataFeed}`, method: "GET" });
		if (resData.status === "success") {
			if (resData.data.data.length > 0) {
				console.log("dispatching");
				dispatch(
					actionCreator(actionTypes.LOAD_USER_DATA, {
						data: resData.data.data,
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

	useEffect(() => {
		console.log(scrollParentRef);
	}, [scrollParentRef]);

	return (
		<MaxHeightDiv ref={scrollParentRef}>
			<StyleCorrectedTab tabBarGutter={0} tabBarExtraContent={TabSearch()}>
			<Tabs.TabPane tab="All" key="1">
					<div>
						<InfiniteScroll
							loader={<LoadingCard/>}
							loadMore={fetchData}
							hasMore={state.hasMore}
							useWindow={false}
							getScrollParent={() => scrollParentRef.current}
						>
							{displayUsers.map(userProjectData => {
								return (
									<UserProjectCard
										key={userProjectData._id}
										handleSelectCard={handleSelectCard}
										userProjectData={userProjectData}
									/>
								);
							})}
						</InfiniteScroll>
					</div>
				</Tabs.TabPane>
				<Tabs.TabPane tab="Active" key="2">
					<div>
						{displayUsers
							.filter(userProjectData => userProjectData.status === Status.active)
							.map(userProjectData => {
								return (
									<UserProjectCard
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
										key={userProjectData._id}
										handleSelectCard={handleSelectCard}
										userProjectData={userProjectData}
									/>
								);
							})}
					</div>
				</Tabs.TabPane>
				
			</StyleCorrectedTab>
		</MaxHeightDiv>
	);
};

export default Sidebar;
