import User, { Status } from "@customTypes/userType";
import AuthorPlatform from "@sections/AuthorPlatform";
import { AuthorActionType, authorInitialState, authorReducer, AUTHOR_ACTIONS } from "@sections/AuthorPlatform/reducer";
import PageLayout from "@sections/Layout";
import { withAuthVerification } from "@utils/auth";
import { debounce } from "@utils/commonUtils";
import { company } from "@utils/config";
import IndexPageMeta from "@utils/meta";
import { NextPage, NextPageContext } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useReducer } from "react";
import styled from "styled-components";
import { blogApi } from "@api/blogApi";
import fetcher from "@utils/fetcher";
import { Blog, BlogTypes } from "@customTypes/blogTypes";
import { notification } from "antd";

const MaxWidthDiv = styled.div`
	background-color: #fff;
	max-width: 1200px;
	margin: auto;
	padding: 1.5rem 0px;
`;

interface AuthorProps {
	isServer: boolean;
	authVerification: Partial<User>;
	searchText: string;
	blogId: string;
	currentTab: Status;
	blogType: BlogTypes;
}

const handleResize = (dispatch: React.Dispatch<AuthorActionType>): void => {
	if (typeof window !== "undefined") {
		if (window.innerWidth < 1024) {
			dispatch({ type: AUTHOR_ACTIONS.IS_DESKTOP, value: { isDesktop: false } });
		} else {
			dispatch({ type: AUTHOR_ACTIONS.IS_DESKTOP, value: { isDesktop: true } });
		}
	}
};

const fetchActiveBlog = async (blogId): Promise<Blog> => {
	const endPoint = blogApi(blogId);
	const response: {
		statusCode: number;
		data: Blog;
	} = await fetcher({
		endPoint,
		method: "GET",
	});
	if (response.statusCode <= 300) {
		return response.data;
	}
	notification.error({ message: "Failed to Fetch Blog" });
	return null;
};

const debouncedHandleResize = debounce(handleResize, 100);
const author: NextPage<AuthorProps> = ({
	isServer,
	authVerification,
	blogId,
	searchText,
	currentTab,
	blogType,
}): JSX.Element => {
	const [state, dispatch] = useReducer(authorReducer, authorInitialState);

	const onResize = (): void => debouncedHandleResize(dispatch);
	const Router = useRouter();

	useEffect(() => {
		if (blogId) {
			dispatch({
				type: AUTHOR_ACTIONS.SET_ACTIVE_BLOG_ID,
				value: {
					activeBlogId: blogId,
				},
			});
			fetchActiveBlog(blogId).then((blog: Blog) => {
				dispatch({
					type: AUTHOR_ACTIONS.SET_ACTIVE_BLOG,
					value: {
						activeBlog: blog,
					},
				});
			});
		}
	}, [blogId]);

	useEffect(() => {}, [blogType]);

	useEffect(() => {
		if (!authVerification.name) {
			Router.push("/auth", "/auth/login");
		}
	}, [authVerification]);

	useEffect(() => {
		if (typeof window !== "undefined") {
			if (window.innerWidth < 1024) {
				dispatch({ type: AUTHOR_ACTIONS.IS_DESKTOP, value: { isDesktop: false } });
			} else {
				dispatch({ type: AUTHOR_ACTIONS.IS_DESKTOP, value: { isDesktop: true } });
			}
		}
	}, []);

	useEffect(() => {
		window.addEventListener("resize", onResize);
		return (): void => {
			window.removeEventListener("resize", onResize);
		};
	}, []);

	useEffect(() => {
		if (searchText) {
			dispatch({
				type: AUTHOR_ACTIONS.SEARCH_TEXT,
				value: {
					searchText,
				},
			});
		}
	}, [searchText]);

	useEffect(() => {
		if (currentTab) {
			dispatch({
				type: AUTHOR_ACTIONS.ACTIVE_KEY,
				value: {
					activeKey: currentTab,
				},
			});
		}
	}, [currentTab]);

	return (
		<PageLayout pageName="Author" isServer={isServer} authVerification={authVerification}>
			<Head>
				<title>Author | {company.product}</title>
				{IndexPageMeta}
			</Head>
			<MaxWidthDiv>
				<AuthorPlatform state={state} dispatch={dispatch} />
			</MaxWidthDiv>
		</PageLayout>
	);
};

author.getInitialProps = async (ctx: NextPageContext): Promise<AuthorProps> => {
	const {
		req,
		query: { searchText: srchtxt, blogId: bid, activeKey, blogType },
	} = ctx;
	const isServer = !!req;
	const blogId: string = bid as string;
	const searchText: string = srchtxt as string;
	const currentTab: Status = activeKey as Status;
	const authVerification = {
		name: "",
		email: "",
	};
	const blgType: BlogTypes = blogType as BlogTypes;
	return { isServer, authVerification, blogId, searchText, currentTab, blogType: blgType };
};

export default withAuthVerification(author);
