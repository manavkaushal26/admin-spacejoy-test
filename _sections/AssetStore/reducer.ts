import { MetaDataType, MoodboardAsset } from "@customTypes/moodboardTypes";
import { AssetStatus } from "@customTypes/userType";

export interface AssetStoreState {
	loading: boolean;
	status: AssetStatus;
	metaData: MetaDataType;
	moodboard: MoodboardAsset[];
	retailerFilter: string[];
	priceRange: [number, number];
	heightRange: [number, number];
	widthRange: [number, number];
	depthRange: [number, number];
	searchText: string;
	checkedKeys: {
		category: string[];
		subCategory: string[];
		verticals: string[];
	};
	wildcard: boolean;
	selectedAsset: string;
	cartOpen: boolean;
	preferredRetailer: boolean;
	newAssetModalVisible: boolean;
}

export const assetStoreInitialState: AssetStoreState = {
	metaData: null,
	moodboard: null,
	loading: true,
	status: AssetStatus.Active,
	retailerFilter: [],
	priceRange: [0, 50000],
	heightRange: [0, 360],
	widthRange: [0, 360],
	depthRange: [0, 360],
	wildcard: false,
	searchText: "",
	checkedKeys: {
		category: [],
		subCategory: [],
		verticals: [],
	},
	selectedAsset: "",
	cartOpen: false,
	preferredRetailer: true,
	newAssetModalVisible: false,
};

export enum ASSET_ACTION_TYPES {
	PRICE_RANGE,
	WIDTH_RANGE,
	HEIGHT_RANGE,
	DEPTH_RANGE,
	RETAILER,
	STATUS,
	SEARCH_TEXT,
	CATEGORY,
	SUB_CATEGORY,
	CHECKED_ITEMS,
	METADATA,
	MOODBOARD,
	LOADING_STATUS,
	SELECTED_ASSET,
	TOGGLE_CART,
	RESET_FILTERS,
	WILD_CARD,
	NEW_ASSET_MODAL_VISIBLE,
	UPDATE_RANGE_FILTERS,
	PREFERRED_RETAILER,
}
export interface AssetAction {
	type: ASSET_ACTION_TYPES;
	value: any;
}
export interface AssetReducerType {
	(state: AssetStoreState, action: AssetAction): AssetStoreState;
}

export const reducer: AssetReducerType = (state, action) => {
	switch (action.type) {
		case ASSET_ACTION_TYPES.RESET_FILTERS:
			return {
				...state,
				status: AssetStatus.Active,
				retailerFilter: [],
				priceRange: [0, 50000],
				heightRange: [0, 360],
				widthRange: [0, 360],
				depthRange: [0, 360],
				wildcard: false,
				searchText: "",
				checkedKeys: {
					category: [],
					subCategory: [],
					verticals: [],
				},
				selectedAsset: "",
			};
		case ASSET_ACTION_TYPES.UPDATE_RANGE_FILTERS: {
			return {
				...state,
				...action.value,
			};
		}
		case ASSET_ACTION_TYPES.STATUS:
			return {
				...state,
				status: action.value,
			};
		case ASSET_ACTION_TYPES.SUB_CATEGORY:
			return {
				...state,
				checkedKeys: {
					category: [],
					verticals: [],
					subCategory: [action.value],
				},
			};
		case ASSET_ACTION_TYPES.SEARCH_TEXT:
			return {
				...state,
				searchText: action.value,
			};
		case ASSET_ACTION_TYPES.DEPTH_RANGE:
			return {
				...state,
				depthRange: action.value,
			};
		case ASSET_ACTION_TYPES.HEIGHT_RANGE:
			return {
				...state,
				heightRange: action.value,
			};
		case ASSET_ACTION_TYPES.WIDTH_RANGE:
			return {
				...state,
				widthRange: action.value,
			};
		case ASSET_ACTION_TYPES.PREFERRED_RETAILER:
			return {
				...state,
				preferredRetailer: action.value,
			};
		case ASSET_ACTION_TYPES.PRICE_RANGE:
			return {
				...state,
				priceRange: action.value,
			};
		case ASSET_ACTION_TYPES.LOADING_STATUS:
			return {
				...state,
				loading: action.value,
			};
		case ASSET_ACTION_TYPES.WILD_CARD:
			return {
				...state,
				wildcard: action.value,
			};
		case ASSET_ACTION_TYPES.RETAILER:
			return {
				...state,
				retailerFilter: action.value,
			};
		case ASSET_ACTION_TYPES.CATEGORY:
			return {
				...state,
				categoryFilter: action.value,
			};
		case ASSET_ACTION_TYPES.METADATA:
			return {
				...state,
				metaData: action.value,
			};

		case ASSET_ACTION_TYPES.MOODBOARD:
			return {
				...state,
				moodboard: action.value,
			};
		case ASSET_ACTION_TYPES.SELECTED_ASSET:
			return {
				...state,
				selectedAsset: action.value,
			};
		case ASSET_ACTION_TYPES.CHECKED_ITEMS:
			return {
				...state,
				checkedKeys: action.value.checked
					.map(key => {
						return key.split("-");
					})
					.reduce(
						(acc, curr) => {
							const currentSelectionArray = [...acc[curr[1]]];
							currentSelectionArray.push(curr[0]);
							return {
								...acc,
								[curr[1]]: currentSelectionArray,
							};
						},
						{
							category: [],
							subCategory: [],
							verticals: [],
						}
					),
			};
		case ASSET_ACTION_TYPES.TOGGLE_CART:
			return {
				...state,
				cartOpen: !state.cartOpen,
			};
		case ASSET_ACTION_TYPES.NEW_ASSET_MODAL_VISIBLE:
			return { ...state, newAssetModalVisible: !state.newAssetModalVisible };
		default:
			return state;
	}
};
