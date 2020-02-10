import { DetailedDesign, RoomTypes } from "@customTypes/dashboardTypes";
import { Status } from "@customTypes/userType";

export interface DesignListDisplayState {
	designs: DetailedDesign[];
	count: number;
	pageNo: number;
	searchText: string;
	roomTypeFilter: RoomTypes;
	statusFilter: Status;
}

export enum DesignListAction {
	UPDATE_DESIGN_STATE = "UPDATE_DESIGN_STATE",
	UPDATE_COUNT = "UPDATE_COUNT",
	UPDATE_PAGE_NUMBER = "UPDATE_PAGE_NUMBER",
	SEARCH_TEXT = "SEARCH_TEXT",
	ROOM_TYPE_FILTER = "ROOM_TYPE_FILTER",
	STATUS_FILTER = "STATUS_FILTER",
}

export interface DesignListActionType {
	type: DesignListAction;
	value: Partial<DesignListDisplayState>;
}

export const DesignListDisplayReducer = (
	state: DesignListDisplayState,
	action: DesignListActionType
): DesignListDisplayState => {
	switch (action.type) {
		case DesignListAction.UPDATE_DESIGN_STATE:
			return {
				...state,
				designs: action.value.designs,
				count: action.value.count,
			};
		case DesignListAction.UPDATE_COUNT:
			return {
				...state,
				count: action.value.count,
			};
		case DesignListAction.UPDATE_PAGE_NUMBER:
			return {
				...state,
				pageNo: action.value.pageNo,
			};
		case DesignListAction.SEARCH_TEXT:
			return {
				...state,
				searchText: action.value.searchText,
			};
		case DesignListAction.STATUS_FILTER:
			return {
				...state,
				statusFilter: action.value.statusFilter,
			};
		case DesignListAction.ROOM_TYPE_FILTER:
			return {
				...state,
				roomTypeFilter: action.value.roomTypeFilter,
			};
		default:
			return state;
	}
};

export const DesignListDisplayInitialState: DesignListDisplayState = {
	designs: [],
	count: 0,
	pageNo: 1,
	searchText: "",
	roomTypeFilter: null,
	statusFilter: Status.active,
};
