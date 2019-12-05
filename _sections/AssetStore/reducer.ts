import { MetaDataType, MoodBoardType } from "@customTypes/moodboardTypes";

export interface AssetStoreState {
	loading: boolean;
	metaData: MetaDataType;
	moodboard: MoodBoardType;
	retailerFilter: string[];
	checkedKeys: {
		category: string[];
		subCategory: string[];
		verticals: string[];
	};
	selectedAsset: string;
	cartOpen: boolean;
}

export interface AssetAction {
	type: string;
	value: any;
}

export enum ASSET_ACTION_TYPES {
	RETAILER = "RETAILER",
	CATEGORY = "CATEGORY",
	SUB_CATEGORY = "SUB_CATEGORY",
	CHECKED_ITEMS = "CHECKED_ITEMS",
	METADATA = "METADATA",
	MOODBOARD = "MOODBOARD",
	LOADING_STATUS = "LOADING_STATUS",
	SELECTED_ASSET = "SELECTED_ASSET",
	TOGGLE_CART = "TOGGLE_CART"
}

export interface AssetReducerType {
	(state: AssetStoreState, action: AssetAction): AssetStoreState;
}

export const reducer: AssetReducerType = (state, action) => {
	switch (action.type) {
		case ASSET_ACTION_TYPES.LOADING_STATUS:
			return {
				...state,
				loading: action.value
			};
		case ASSET_ACTION_TYPES.RETAILER:
			return {
				...state,
				retailerFilter: action.value
			};
		case ASSET_ACTION_TYPES.CATEGORY:
			return {
				...state,
				categoryFilter: action.value
			};
		case ASSET_ACTION_TYPES.METADATA:
			return {
				...state,
				metaData: action.value
			};

		case ASSET_ACTION_TYPES.MOODBOARD:
			return {
				...state,
				moodboard: action.value
			};
		case ASSET_ACTION_TYPES.SELECTED_ASSET:
			return {
				...state,
				selectedAsset: action.value
			};
		case ASSET_ACTION_TYPES.CHECKED_ITEMS:
			return {
				...state,
				checkedKeys: action.value
					.map(key => {
						return key.split("-");
					})
					.reduce(
						(acc, curr) => {
							const currentSelectionArray = [...acc[curr[1]]];
							currentSelectionArray.push(curr[0]);
							return {
								...acc,
								[curr[1]]: currentSelectionArray
							};
						},
						{
							category: [],
							subCategory: [],
							verticals: []
						}
					)
			};
		case ASSET_ACTION_TYPES.TOGGLE_CART:
			return {
				...state,
				cartOpen: !state.cartOpen
			};
		default:
			return state;
	}
};
