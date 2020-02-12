import { DetailedDesign, RoomTypes, DesignPhases } from "@customTypes/dashboardTypes";
import { Status } from "@customTypes/userType";

export interface DesignListDisplayState {
	designs: DetailedDesign[];
	count: number;
	pageNo: number;
	searchText: string;
	phaseFilter: DesignPhases[];
	roomTypeFilter: RoomTypes[];
	statusFilter: Status;
}

export enum DesignListAction {
	UPDATE_DESIGN_STATE = "UPDATE_DESIGN_STATE",
	UPDATE_COUNT = "UPDATE_COUNT",
	UPDATE_PAGE_NUMBER = "UPDATE_PAGE_NUMBER",
	PHASE_FILTER = "PHASE_FILTER",
	SEARCH_TEXT = "SEARCH_TEXT",
	ROOM_TYPE_FILTER = "ROOM_TYPE_FILTER",
	STATUS_FILTER = "STATUS_FILTER",
	CLEAR = "CLEAR",
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
		case DesignListAction.PHASE_FILTER:
			return {
				...state,
				phaseFilter: action.value.phaseFilter,
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
		case DesignListAction.CLEAR:
			return {
				...state,
				pageNo: 1,
			};
		default:
			return state;
	}
};

export const DesignListDisplayInitialState: DesignListDisplayState = {
	designs: [],
	count: 0,
	pageNo: 1,
	phaseFilter: [
		DesignPhases.concept,
		DesignPhases.modelling,
		DesignPhases.design3D,
		DesignPhases.render,
		DesignPhases.revision,
	],
	searchText: "",
	roomTypeFilter: [],
	statusFilter: Status.active,
};
