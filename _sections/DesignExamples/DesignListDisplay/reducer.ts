import { DetailedDesign } from "@customTypes/dashboardTypes";

export interface DesignListDisplayState {
	designs: DetailedDesign[];
	count: number;
}

export enum DesignListAction {
	UPDATE_DESIGN_STATE = "UPDATE_DESIGN_STATE",
	UPDATE_COUNT = "UPDATE_COUNT",
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
		default:
			return state;
	}
};

export const DesignListDisplayInitialState: DesignListDisplayState = {
	designs: [],
	count: 0,
};
