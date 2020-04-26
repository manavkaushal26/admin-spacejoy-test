import { getBlogs } from "@api/blogApi";
import { Role } from "@customTypes/userType";
import { MaxHeightDiv, SilentDivider } from "@sections/Dashboard/styled";
import { cookieNames } from "@utils/config";
import fetcher from "@utils/fetcher";
import { Empty, notification } from "antd";
import React, { useEffect, useRef, useState } from "react";
import Router from "next/router";
import { debounce } from "@utils/commonUtils";
import { getQueryString, getQueryObject } from "@sections/AuthorPlatform/utils";
import InfiniteScroll from "react-infinite-scroller";
import LoadingCard from "@sections/Dashboard/LoadingCard";
import getCookie from "@utils/getCookie";
import { AuthorPlatformProps } from "..";
import { AUTHOR_ACTIONS } from "../reducer";
import BlogListCard from "./BlogListCard";

const fetchAllBlogs = async (
	state,
	dispatch,
	setLoading: React.Dispatch<React.SetStateAction<boolean>>
): Promise<void> => {
	setLoading(true);

	const role: Role = getCookie(null, cookieNames.userRole) as Role;

	const endPoint = `${getBlogs(role)}?skip=${state.pageNo * 10}&search=title:${state.searchText}&status=${
		state.activeKey
	}`;

	if (
		Router.query.blogId !== state.activeBlogId ||
		Router.query.activeKey !== state.activeKey ||
		Router.query.searchText !== state.searchText
	)
		Router.push({ pathname: "/author", query: getQueryObject(state) }, `/author${getQueryString(state)}`);

	const allBlogs = await fetcher({ endPoint, method: "GET" });
	if (allBlogs.statusCode <= 300) {
		if (allBlogs.data.length) {
			dispatch({
				type: AUTHOR_ACTIONS.SET_BLOGS_DATA,
				value: { blogs: allBlogs.data, count: allBlogs.count, pageNo: state.pageNo + 1, hasMore: true },
			});
		} else {
			dispatch({
				type: AUTHOR_ACTIONS.UPDATE_HASMORE,
				value: {
					hasMore: false,
				},
			});
		}
	} else {
		dispatch({
			type: AUTHOR_ACTIONS.UPDATE_HASMORE,
			value: {
				hasMore: false,
			},
		});
		notification.error({ message: "Failed to Fetch Blogs" });
	}
	setLoading(false);
};

const debouncedFetchAllBlogs = debounce(fetchAllBlogs, 400);

const BlogLeftPanel: React.FC<AuthorPlatformProps> = ({ state, dispatch }) => {
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		debouncedFetchAllBlogs(state, dispatch, setLoading);
	}, [state.searchText]);

	useEffect(() => {
		dispatch({ type: AUTHOR_ACTIONS.CLEAR_BLOGS, value: { blogs: [] } });
	}, [state.activeKey]);

	const onCardClick = (blogId: string): void => {
		Router.push(
			{ pathname: "/author", query: getQueryObject({ ...state, activeBlogId: blogId }) },
			`/author${getQueryString({ ...state, activeBlogId: blogId })}`
		);
	};

	const container = useRef(null);

	return (
		<MaxHeightDiv ref={container}>
			<InfiniteScroll
				loader={<LoadingCard key="loadingCard" />}
				loadMore={(): void => debouncedFetchAllBlogs(state, dispatch, setLoading)}
				hasMore={state.hasMore}
				useWindow={false}
				getScrollParent={(): HTMLElement => container.current}
			>
				{state.blogs.length
					? state.blogs.map(blog => {
							return (
								<>
									<BlogListCard blog={blog} activeBlogId={state.activeBlogId} onCardClick={onCardClick} />
									<SilentDivider />
								</>
							);
					  })
					: !loading && <Empty description="No Blogs present currently" />}
			</InfiniteScroll>
		</MaxHeightDiv>
	);
};

export default React.memo(BlogLeftPanel);
