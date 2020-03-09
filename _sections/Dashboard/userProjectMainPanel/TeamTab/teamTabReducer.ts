import { TeamMember } from "@customTypes/dashboardTypes";
import { ProjectRoles } from "@customTypes/userType";

export enum DesignerTabActionType {
	UPDATE_SEARCH_TEXT,
	UPDATE_DATA,
	TOGGLE_LOADING,
	ASSIGN_DESIGNER,
	UNASSIGN_DESIGNER,
	ROLE_CHANGE,
	UPDATE_ASSIGNED_DESIGNERS,
	PAGE_CHANGE,
}

export interface DesignerTabAction {
	type: DesignerTabActionType;
	value: any;
}

export interface DesignerTabState {
	team: TeamMember[];
	assignedTeam: TeamMember[];
	loading: boolean;
	searchText: string;
	role: ProjectRoles;
	totalCount: number;
	currentPage: number;
}

export interface DesignerTabReducer {
	(state: DesignerTabState, action: DesignerTabAction): DesignerTabState;
}
export const designerTabReducer: DesignerTabReducer = (state, action): DesignerTabState => {
	switch (action.type) {
		case DesignerTabActionType.UPDATE_ASSIGNED_DESIGNERS:
			return {
				...state,
				assignedTeam: action.value,
			};
		case DesignerTabActionType.ROLE_CHANGE:
			return {
				...state,
				role: action.value,
			};
		case DesignerTabActionType.TOGGLE_LOADING:
			return {
				...state,
				loading: !state.loading,
			};
		case DesignerTabActionType.UPDATE_SEARCH_TEXT:
			return {
				...state,
				searchText: action.value,
			};
		case DesignerTabActionType.UPDATE_DATA:
			return {
				...state,
				team: [...action.value.data],
				totalCount: action.value.totalCount,
			};
		case DesignerTabActionType.ASSIGN_DESIGNER:
			return {
				...state,
				assignedTeam: [...state.assignedTeam, action.value],
			};
		case DesignerTabActionType.UNASSIGN_DESIGNER:
			return {
				...state,
				assignedTeam: [...state.assignedTeam.filter(member => member._id !== action.value)],
			};
		case DesignerTabActionType.PAGE_CHANGE:
			return {
				...state,
				currentPage: action.value,
			};
		default:
			return state;
	}
};
