import { UserProjectType, PhaseInternalNames } from "@customTypes/dashboardTypes";

export interface UserProjectSidePanelState {
	nameSearchText: string;
	designerSearchText: string;
	data: UserProjectType[];
	pageCount: number;
	hasMore: boolean;
	sortOrder: 1 | -1;
	sortBy: SortFields;
	currentTab: string;
	phase: PhaseInternalNames[];
	name: string;
	searchResults: UserProjectType[];
	count: number;
}

export enum SortFields {
	"Customer Name" = "customerName",
	"End Date" = "endedAt",
	"Created At" = "createdAt",
}

export enum UserProjectSidePanelActionTypes {
	CLEAR,
	NAME_SEARCH_TEXT,
	DESIGN_SEARCH_TEXT,
	LOAD_USER_DATA,
	UPDATE_HAS_MORE,
	TAB_CHANGE,
	PHASE_FILTER,
	NAME_FILTER,
	SORT_ORDER,
	SORT_BY,
	CLEAR_DATA,
	UPDATE_PROJECT_START_DATE,
	UPDATE_PROJECT_END_DATE,
}

export interface UserProjectSidePanelAction {
	type: UserProjectSidePanelActionTypes;
	value: Partial<UserProjectSidePanelState>;
}

export const phaseDefaultValues: PhaseInternalNames[] = [
	PhaseInternalNames.requirement,
	PhaseInternalNames.designConcept,
	PhaseInternalNames.modelling,
	PhaseInternalNames.design3D,
	PhaseInternalNames.designRender,
	PhaseInternalNames.designsInRevision,
];

export const UserProjectSidePanelInitialState: UserProjectSidePanelState = {
	nameSearchText: "",
	designerSearchText: "",
	data: [],
	pageCount: 0,
	phase: [],
	name: "",
	sortBy: SortFields["Created At"],
	hasMore: true,
	currentTab: "active",
	searchResults: [],
	sortOrder: -1,
	count: 0,
};

export const UserProjectSidePanelActionCreator = (
	actionType: UserProjectSidePanelActionTypes,
	value: Partial<UserProjectSidePanelState>
): UserProjectSidePanelAction => {
	return {
		type: actionType,
		value,
	};
};

export const UserProjectSidePanelReducer = (
	state: UserProjectSidePanelState,
	action: UserProjectSidePanelAction
): UserProjectSidePanelState => {
	switch (action.type) {
		case UserProjectSidePanelActionTypes.PHASE_FILTER:
			return {
				...state,
				phase: action.value.phase,
				hasMore: true,
			};
		case UserProjectSidePanelActionTypes.TAB_CHANGE:
			return {
				...state,
				currentTab: action.value.currentTab,
				data: [],
				pageCount: 0,
				hasMore: true,
			};

		case UserProjectSidePanelActionTypes.CLEAR_DATA:
			return {
				...state,
				data: [],
				pageCount: 0,
				hasMore: true,
			};
		case UserProjectSidePanelActionTypes.NAME_FILTER:
			return {
				...state,
				name: action.value.name,
			};
		case UserProjectSidePanelActionTypes.NAME_SEARCH_TEXT:
			return {
				...state,
				nameSearchText: action.value.nameSearchText,
			};
		case UserProjectSidePanelActionTypes.DESIGN_SEARCH_TEXT:
			return {
				...state,
				designerSearchText: action.value.designerSearchText,
			};
		case UserProjectSidePanelActionTypes.UPDATE_HAS_MORE:
			return {
				...state,
				hasMore: action.value.hasMore,
			};
		case UserProjectSidePanelActionTypes.LOAD_USER_DATA: {
			const dataToUpdate =
				action.value.pageCount === state.pageCount ? state.data : [...state.data, ...action.value.data];
			return {
				...state,
				data: [...dataToUpdate],
				pageCount: action.value.pageCount,
				hasMore: action.value.hasMore,
				count: action.value.count,
			};
		}
		case UserProjectSidePanelActionTypes.UPDATE_PROJECT_END_DATE:
			return {
				...state,
				data: [...action.value.data],
			};
		case UserProjectSidePanelActionTypes.SORT_ORDER:
			return {
				...state,
				sortOrder: action.value.sortOrder,
			};
		case UserProjectSidePanelActionTypes.SORT_BY:
			return {
				...state,
				sortBy: action.value.sortBy,
			};
		case UserProjectSidePanelActionTypes.CLEAR:
			return { ...UserProjectSidePanelInitialState };
		default:
			return state;
	}
};
