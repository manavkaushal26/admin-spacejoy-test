import qs from "qs";
import { debounce } from "@utils/commonUtils";
import { Status } from "@customTypes/userType";
import { AuthorState, AuthorActionType, AUTHOR_ACTIONS } from "./reducer";

export const getQueryObject = (
	state: AuthorState
): {
	blogId: string;
	searchText: string;
	activeKey: string;
} => {
	const queryObject = {
		blogId: state.activeBlogId,
		searchText: state.searchText,
		activeKey: state.activeKey,
	};
	return queryObject;
};

export const getQueryString = (state: AuthorState): string => {
	const queryString = `?${qs.stringify(getQueryObject(state))}`;
	return queryString;
};

const Clear = (dispatch: React.Dispatch<AuthorActionType>): void => {
	dispatch({ type: AUTHOR_ACTIONS.CLEAR_BLOGS, value: {} });
};

export const debouncedClear = debounce(Clear, 400);

export const getBlogTagColor = (status: Status): string => {
	switch (status) {
		case Status.active:
			return "green";
		case Status.pending:
			return "orange";
		case Status.inactive:
			return "blue";
		default:
			return "#595959";
	}
};

export const getBlogTextColor = (status: Status): string => {
	switch (status) {
		case Status.active:
			return "Published";
		case Status.pending:
			return "Ready To Publish";
		case Status.inactive:
			return "Draft";
		default:
			return "Unknown State";
	}
};
