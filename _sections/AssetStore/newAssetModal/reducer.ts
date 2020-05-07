import { Currency, MountTypes } from "@customTypes/assetInfoTypes";
import User, { Status } from "@customTypes/userType";
import { getLocalStorageValue } from "@utils/storageUtils";
import { getValueSafely } from "@utils/commonUtils";

export interface NewAssetUploadState {
	_id?: string;
	name: string;
	description: string;
	status: Status;
	shoppable: boolean;
	retailer: string;
	retailLink: string;
	meta: {
		category: string;
		subcategory: string;
		vertical: string;
		theme: string;
	};
	primaryColor: string;
	secondaryColors: string[];
	spatialData: {
		mountType: MountTypes;
		clampValue: number;
		fileUrls: {
			glb: string;
			source: string;
			legacy_obj: string;
			sourceHighPoly: string;
		};
	};
	price: number;
	currency: Currency;
	dimension: {
		width: number;
		depth: number;
		height: number;
	};

	imageUrl: string;
	cdn: string;
	tags: string[];
	artist: string;
}

export const initialState = {
	name: "",
	description: "",
	status: Status.active,
	shoppable: true,
	retailer: null,
	retailLink: "",
	meta: {
		category: null,
		subcategory: null,
		vertical: null,
		theme: null,
	},
	primaryColor: "", // TO BE ADDED LATER
	secondaryColors: [], // TO BE ADDED LATER
	spatialData: {
		mountType: MountTypes.floor,
		clampValue: 0,
		fileUrls: {
			glb: "",
			source: "",
			// eslint-disable-next-line @typescript-eslint/camelcase
			legacy_obj: "",
			sourceHighPoly: "",
		},
	},
	price: null,
	currency: Currency.USD,
	dimension: {
		width: null,
		depth: null,
		height: null,
	},

	imageUrl: "",
	cdn: "",
	tags: [],
	artist: getValueSafely(() => getLocalStorageValue<User>("authVerification").id, ""),
};

export enum NEW_ASSET_ACTION_TYPES {
	ASSET_NAME = "ASSET_NAME",
	ASSET_DESCRIPTION = "ASSET_DESCRIPTION",
	ASSET_CATEGORY = "ASSET_CATEGORY",
	ASSET_SUB_CATEGORY = "ASSET_SUB_CATEGORY",
	ASSET_VERTICAL = "ASSET_VERTICAL",
	ASSET_PRICE = "ASSET_PRICE",
	ASSET_SHOPPABLE = "ASSET_SHOPPABLE",
	ASSET_PRICE_CURRENCY_TYPE = "ASSET_PRICE_CURRENCY_TYPE",
	ASSET_RETAILER = "ASSET_RETAILER",
	ASSET_RETAIL_LINK = "ASSET_RETAIL_LINK",
	ASSET_THEME = "ASSET_THEME",
	ASSET_WIDTH = "ASSET_WIDTH",
	ASSET_HEIGHT = "ASSET_HEIGHT",
	ASSET_DEPTH = "ASSET_DEPTH",
	ASSET_MOUNT_TYPE = "ASSET_MOUNT_TYPE",
	ASSET_CLAMP_VALUE = "ASSET_CLAMP_VALUE",
	ASSET_STATUS = "ASSET_STATUS",
	ASSET_TAGS = "ASSET_TAGS",
	SET_ASSET = "SET_ASSET",
	UPDATE_DIMENSION = "UPDATE_DIMENSION",
	CLEAR = "CLEAR",
}

export interface ActionType {
	type: NEW_ASSET_ACTION_TYPES;
	value: any;
}

export interface NewAssetUploadReducer {
	(state: NewAssetUploadState, action: ActionType): NewAssetUploadState;
}

export const reducer = (state: NewAssetUploadState, action: ActionType): NewAssetUploadState => {
	switch (action.type) {
		case NEW_ASSET_ACTION_TYPES.ASSET_NAME:
			return { ...state, name: action.value };
		case NEW_ASSET_ACTION_TYPES.ASSET_DESCRIPTION:
			return { ...state, description: action.value };
		case NEW_ASSET_ACTION_TYPES.ASSET_PRICE:
			return { ...state, price: action.value < 0 ? 0 : parseInt(action.value, 10) };
		case NEW_ASSET_ACTION_TYPES.ASSET_PRICE_CURRENCY_TYPE:
			return { ...state, currency: action.value };
		case NEW_ASSET_ACTION_TYPES.ASSET_RETAILER:
			return { ...state, retailer: action.value };
		case NEW_ASSET_ACTION_TYPES.ASSET_RETAIL_LINK:
			return { ...state, retailLink: action.value };
		case NEW_ASSET_ACTION_TYPES.UPDATE_DIMENSION:
			return {
				...state,
				dimension: {
					width: action.value.width,
					height: action.value.height,
					depth: action.value.depth,
				},
			};
		case NEW_ASSET_ACTION_TYPES.ASSET_SHOPPABLE:
			return {
				...state,
				shoppable: action.value,
			};
		case NEW_ASSET_ACTION_TYPES.ASSET_CATEGORY:
			return {
				...state,
				meta: {
					...state.meta,
					category: action.value,
					subcategory: "",
					vertical: "",
				},
			};
		case NEW_ASSET_ACTION_TYPES.ASSET_SUB_CATEGORY:
			return {
				...state,
				meta: {
					...state.meta,
					subcategory: action.value,
					vertical: "",
				},
			};
		case NEW_ASSET_ACTION_TYPES.ASSET_VERTICAL:
			return {
				...state,
				meta: {
					...state.meta,
					vertical: action.value,
				},
			};
		case NEW_ASSET_ACTION_TYPES.ASSET_THEME:
			return {
				...state,
				meta: {
					...state.meta,
					theme: action.value,
				},
			};
		case NEW_ASSET_ACTION_TYPES.ASSET_WIDTH:
			return {
				...state,
				dimension: {
					...state.dimension,
					width: action.value < 0 ? 0 : parseFloat(action.value),
				},
			};
		case NEW_ASSET_ACTION_TYPES.ASSET_HEIGHT:
			return {
				...state,
				dimension: {
					...state.dimension,
					height: action.value < 0 ? 0 : parseFloat(action.value),
				},
			};
		case NEW_ASSET_ACTION_TYPES.ASSET_DEPTH:
			return {
				...state,
				dimension: {
					...state.dimension,
					depth: action.value < 0 ? 0 : parseFloat(action.value),
				},
			};
		case NEW_ASSET_ACTION_TYPES.ASSET_STATUS:
			return {
				...state,
				status: action.value,
			};
		case NEW_ASSET_ACTION_TYPES.ASSET_MOUNT_TYPE:
			return {
				...state,
				spatialData: {
					...state.spatialData,
					mountType: action.value,
				},
			};
		case NEW_ASSET_ACTION_TYPES.ASSET_CLAMP_VALUE:
			return {
				...state,
				spatialData: {
					...state.spatialData,
					clampValue: action.value,
				},
			};
		case NEW_ASSET_ACTION_TYPES.ASSET_TAGS:
			return {
				...state,
				tags: action.value,
			};
		case NEW_ASSET_ACTION_TYPES.SET_ASSET:
			return {
				...action.value,
			};
		case NEW_ASSET_ACTION_TYPES.CLEAR:
			return {
				...initialState,
			};
		default:
			return state;
	}
};
