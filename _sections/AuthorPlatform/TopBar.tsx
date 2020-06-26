import { Status } from "@customTypes/userType";
import { debouncedClear, getQueryObject, getQueryString } from "@sections/AuthorPlatform/utils";
import { Col, Input, Menu, Row } from "antd";
import Router from "next/router";
import React from "react";
import styled from "styled-components";
import getCookie from "@utils/getCookie";
import { cookieNames } from "@utils/config";
import { AuthorPlatformProps } from ".";
import { AUTHOR_ACTIONS } from "./reducer";

const StyledMenu = styled(Menu)`
	border-bottom: 0px;
`;

const TopBar: React.FC<AuthorPlatformProps> = ({ state, dispatch }) => {
	const role = getCookie(null, cookieNames.userRole);

	const onMenuClick = ({ key }): void => {
		Router.push(
			{
				pathname: "/author",
				query: getQueryObject({ ...state, activeKey: key }),
			},
			`/author${getQueryString({ ...state, activeKey: key })}`,
			{ shallow: true }
		);
		dispatch({
			type: AUTHOR_ACTIONS.ACTIVE_KEY,
			value: {
				activeKey: key,
			},
		});
		debouncedClear(dispatch);
	};

	const handleSearch = (e): void => {
		const {
			target: { value },
		} = e;
		dispatch({
			type: AUTHOR_ACTIONS.SEARCH_TEXT,
			value: {
				searchText: value,
			},
		});
		debouncedClear(dispatch);
	};

	return (
		<Row align="stretch" gutter={[8, 8]} style={{ padding: "0 0.5rem 0 0 " }}>
			<Col span={8}>
				<StyledMenu selectedKeys={[state.activeKey]} onClick={onMenuClick} mode="horizontal">
					<Menu.Item key={Status.inactive}>Draft</Menu.Item>
					<Menu.Item key={Status.pending}>Ready To Publish</Menu.Item>
					<Menu.Item key={Status.active}>Published</Menu.Item>
				</StyledMenu>
			</Col>
			<Col span={16}>
				<Input.Search
					placeholder="Search Blogs by Title"
					onChange={handleSearch}
					value={state.searchText}
					style={{ height: "100%" }}
				/>
			</Col>
		</Row>
	);
};

export default React.memo(TopBar);
