import { PhaseInternalNames, QuizState, UserProjectType } from "@customTypes/dashboardTypes";
import { Status } from "@customTypes/userType";
import moment from "moment-timezone";
import { ProjectSelectionTypeValues } from "./../../../types/dashboardTypes";

export interface UserProjectSidePanelState {
	nameSearchText: string;
	designerSearchText: string;
	data: UserProjectType[];
	pageCount: number;
	hasMore: boolean;
	sortOrder: 1 | -1;
	projectSelectionType: ProjectSelectionTypeValues | "all";
	sortBy: SortFields;
	currentTab: string;
	status: Status;
	phase: PhaseInternalNames[];
	designPhase: PhaseInternalNames[];
	name: string;
	searchResults: UserProjectType[];
	count: number;
	startedAt: [moment.Moment, moment.Moment];
	endedAt: [moment.Moment, moment.Moment];
	email: string;
	quizStatus: QuizState;
	pause: boolean;
}

export enum UserProjectSidePanelActionTypes {
	CLEAR,
	NAME_SEARCH_TEXT,
	DESIGN_SEARCH_TEXT,
	LOAD_USER_DATA,
	UPDATE_HAS_MORE,
	TAB_CHANGE,
	PHASE_FILTER,
	DESIGN_PHASE_FILTER,
	NAME_FILTER,
	SORT_ORDER,
	SORT_BY,
	STATUS,
	CLEAR_DATA,
	UPDATE_PROJECT_START_DATE,
	UPDATE_PROJECT_END_DATE,
	QUIZ_STATUS,
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

export enum SortFields {
	"Customer Name" = "customerName",
	"Delivery Date" = "endedAt",
	"Create Date" = "createdAt",
}

export const UserProjectSidePanelInitialState: UserProjectSidePanelState = {
	nameSearchText: "",
	designerSearchText: "",
	projectSelectionType: "all",
	data: [],
	pageCount: 0,
	phase: [],
	designPhase: [],
	name: "",
	sortBy: SortFields["Create Date"],
	hasMore: true,
	currentTab: "active",
	status: Status.active,
	searchResults: [],
	sortOrder: -1,
	count: 0,
	startedAt: [null, null],
	endedAt: [null, null],
	email: "",
	quizStatus: null,
	pause: false,
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
		case UserProjectSidePanelActionTypes.STATUS:
			return {
				...state,
				status: action.value.status,
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
		case UserProjectSidePanelActionTypes.QUIZ_STATUS:
			return {
				...state,
				quizStatus: action.value.quizStatus,
			};
		case UserProjectSidePanelActionTypes.LOAD_USER_DATA: {
			const dataToUpdate =
				action.value.pageCount === state.pageCount
					? state.data
					: action.value.data.reduce((acc, next) => {
							acc.push(next);
							return acc;
					  }, state.data);
			return {
				...state,
				data: dataToUpdate,
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
		case UserProjectSidePanelActionTypes.DESIGN_PHASE_FILTER:
			return {
				...state,
				phase: action.value.designPhase,
				hasMore: true,
			};
		default:
			return state;
	}
};

export enum SortOrder {
	Ascending = 1,
	Descending = -1,
}

export const SortOptions = {
	"Created At - Newest First": {
		sortBy: SortFields["Create Date"],
		sortOrder: SortOrder.Descending,
	},
	"Created At - Oldest First": {
		sortBy: SortFields["Create Date"],
		sortOrder: SortOrder.Ascending,
	},
	"Remaining days - Least First": {
		sortBy: SortFields["Delivery Date"],
		sortOrder: SortOrder.Ascending,
	},
	"Remaining Days - Most First": {
		sortBy: SortFields["Delivery Date"],
		sortOrder: SortOrder.Descending,
	},
	"Customer Name - Ascending": {
		sortBy: SortFields["Customer Name"],
		sortOrder: SortOrder.Ascending,
	},
	"Customer Name - Decending": {
		sortBy: SortFields["Customer Name"],
		sortOrder: SortOrder.Descending,
	},
};
