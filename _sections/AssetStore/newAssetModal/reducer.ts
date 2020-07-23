import { Currency, MountTypes } from "@customTypes/assetInfoTypes";
import User, { Status } from "@customTypes/userType";
import { getLocalStorageValue } from "@utils/storageUtils";
import { getValueSafely } from "@utils/commonUtils";
import { ModeOfOperation } from "@customTypes/moodboardTypes";

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
		clampValue: boolean;
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
	assemblyInfo?: string;
	warrantyInfo?: string;
	shippingPolicy?: string;
	cancellationPolicy?: string;
	refundPolicy?: string;
	returnPolicy?: string;
	estimatedArrival?: string;
	estimatedDispatch?: string;
	countryOfOrigin?: string;
	sku?: string;
	modeOfOperation?: ModeOfOperation;
	stockQty?: number;
	productImages?: {
		storageUrl: string;
		cdn: string;
	}[];
	flatShipping: number;
}

export const initialState = {
	flatShipping: 0,
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
		clampValue: true,
		fileUrls: {
			glb: "",
			source: "",
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
