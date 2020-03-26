import { Blog, BlogTypes } from "@customTypes/blogTypes";
import { Status } from "@customTypes/userType";

export interface AuthorState {
	searchText: string;
	blogId: string;
	activeKey: Status;
	isDesktop: boolean;
	blogContent: string;
	hasMore: boolean;
	blogs: Partial<Blog>[];
	count: number;
	pageNo: number;
	activeBlogId: string;
	activeBlog: Partial<Blog>;
}

export const authorInitialState: AuthorState = {
	searchText: "",
	blogId: "",
	activeKey: Status.inactive,
	isDesktop: false,
	blogContent: "<p>This is the initial content of the editor</p>",
	blogs: [],
	count: 0,
	pageNo: 0,
	hasMore: true,
	activeBlogId: "",
	activeBlog: {
		title: "New Blog",
		description: "",
		excerpt: "",
		blogType: BlogTypes.Full,
		slug: `new-blog-${Math.random()
			.toString(36)
			.substring(7)}`,
		coverImg: "",
		coverImgCdn: "",
		socialImgCdn: "",
		image360Cdn: "",
		images: [],
		category: null,
		tags: [],
		body: "<p>This is the initial content of the editor</p>",
		backlinks: [],
		publishDate: null,
		status: Status.inactive,
		author: null,
	},
};

export enum AUTHOR_ACTIONS {
	SEARCH_TEXT,
	BLOG_ID,
	ACTIVE_KEY,
	IS_DESKTOP,
	BLOG_CONTENT,
	SET_BLOGS_DATA,
	SET_ACTIVE_BLOG,
	SET_ACTIVE_BLOG_ID,
	UPDATE_BLOG_DATA,
	CLEAR_BLOGS,
	UPDATE_HASMORE,
	UPDATE_COVER_IMAGE,
	UPDATE_SOCIAL_IMAGE,
	UPDATE_IMAGE_360,
	UPDATE_BLOG_TYPE,
	NEW_BLOG,
}

export interface AuthorActionType {
	type: AUTHOR_ACTIONS;
	value: Partial<AuthorState>;
}

export const authorReducer = (state: AuthorState, action: AuthorActionType): AuthorState => {
	switch (action.type) {
		case AUTHOR_ACTIONS.NEW_BLOG:
			return {
				...state,
				activeBlogId: "",
				activeBlog: {
					title: "New Blog",
					description: "",
					excerpt: "",
					blogType: action.value.activeBlog.blogType,
					slug: `new-blog-${Math.random()
						.toString(36)
						.substring(7)}`,
					coverImg: "",
					coverImgCdn: "",
					socialImgCdn: "",
					image360Cdn: "",
					images: [],
					category: null,
					tags: [],
					body: "<p>This is the initial content of the editor</p>",
					backlinks: [],
					publishDate: null,
					status: Status.inactive,
					author: null,
				},
			};
		case AUTHOR_ACTIONS.CLEAR_BLOGS:
			return {
				...state,
				blogs: [],
				hasMore: true,
				pageNo: 0,
				count: 0,
			};
		case AUTHOR_ACTIONS.UPDATE_COVER_IMAGE:
			return {
				...state,
				activeBlog: {
					...state.activeBlog,
					coverImg: action.value.activeBlog.coverImg,
					coverImgCdn: action.value.activeBlog.coverImgCdn,
				},
			};
		case AUTHOR_ACTIONS.UPDATE_SOCIAL_IMAGE:
			return {
				...state,
				activeBlog: {
					...state.activeBlog,
					socialImgCdn: action.value.activeBlog.socialImgCdn,
				},
			};
		case AUTHOR_ACTIONS.UPDATE_IMAGE_360:
			return {
				...state,
				activeBlog: {
					...state.activeBlog,
					image360Cdn: action.value.activeBlog.image360Cdn,
				},
			};
		case AUTHOR_ACTIONS.UPDATE_HASMORE:
			return {
				...state,
				hasMore: action.value.hasMore,
			};

		case AUTHOR_ACTIONS.SEARCH_TEXT:
			return {
				...state,
				searchText: action.value.searchText,
			};
		case AUTHOR_ACTIONS.BLOG_ID:
			return {
				...state,
				blogId: action.value.blogId,
			};
		case AUTHOR_ACTIONS.ACTIVE_KEY:
			return {
				...state,
				activeKey: action.value.activeKey,
			};
		case AUTHOR_ACTIONS.IS_DESKTOP:
			return {
				...state,
				isDesktop: action.value.isDesktop,
			};
		case AUTHOR_ACTIONS.BLOG_CONTENT:
			return {
				...state,
				activeBlog: {
					...state.activeBlog,
					body: action.value.blogContent,
				},
			};
		case AUTHOR_ACTIONS.SET_BLOGS_DATA: {
			const dataToUpdate = action.value.pageNo === state.pageNo ? state.blogs : [...state.blogs, ...action.value.blogs];

			return {
				...state,
				blogs: dataToUpdate,
				hasMore: action.value.hasMore,
				count: action.value.count,
				pageNo: action.value.pageNo,
			};
		}
		case AUTHOR_ACTIONS.SET_ACTIVE_BLOG:
			return {
				...state,
				activeBlog: action.value.activeBlog,
			};
		case AUTHOR_ACTIONS.SET_ACTIVE_BLOG_ID:
			return {
				...state,
				activeBlogId: action.value.activeBlogId,
			};
		case AUTHOR_ACTIONS.UPDATE_BLOG_DATA:
			return {
				...state,
				activeBlog: {
					...state.activeBlog,
					...action.value.activeBlog,
				},
			};
		default:
			return state;
	}
};
