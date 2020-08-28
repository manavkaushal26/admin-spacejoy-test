import { blogApi } from "@api/blogApi";
import { Blog } from "@customTypes/blogTypes";
import { Status } from "@customTypes/userType";
import AuthorPlatform from "@sections/AuthorPlatform";
import { AuthorActionType, authorInitialState, authorReducer, AUTHOR_ACTIONS } from "@sections/AuthorPlatform/reducer";
import PageLayout from "@sections/Layout";
import { ProtectRoute } from "@utils/authContext";
import { debounce } from "@utils/commonUtils";
import { company } from "@utils/config";
import fetcher from "@utils/fetcher";
import IndexPageMeta from "@utils/meta";
import { notification } from "antd";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import React, { useEffect, useReducer } from "react";
import styled from "styled-components";

const BackgroundDiv = styled.div`
	background-color: #fff;
	margin: auto;
	padding: 1.5rem 0px;
`;

interface AuthorProps {
	searchText: string;
	blogId: string;
	currentTab: Status;
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
const author: NextPage<AuthorProps> = ({ blogId, searchText, currentTab }) => {
	const [state, dispatch] = useReducer(authorReducer, authorInitialState);

	const onResize = (): void => debouncedHandleResize(dispatch);

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
		<PageLayout pageName='Author'>
			<Head>
				<title>Author | {company.product}</title>
				{IndexPageMeta}
			</Head>
			<BackgroundDiv>
				<AuthorPlatform state={state} dispatch={dispatch} />
			</BackgroundDiv>
		</PageLayout>
	);
};

export const getServerSideProps: GetServerSideProps<AuthorProps> = async ctx => {
	const {
		query: { searchText: srchtxt, blogId: bid, activeKey },
	} = ctx;
	const blogId: string = (bid || "") as string;
	const searchText: string = (srchtxt || "") as string;
	const currentTab: Status = (activeKey || "") as Status;
	return { props: { blogId, searchText, currentTab } };
};

export default ProtectRoute(author);
