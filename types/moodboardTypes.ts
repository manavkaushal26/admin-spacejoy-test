import { MountTypes } from "./assetInfoTypes";
import { Status } from "./userType";

enum ServiceType {
	furniture = "furniture",
	paint = "paint",
	other = "other",
}

export interface RetailersList {
	country: string;
	serviceType: ServiceType;
	_id: string;
	name: string;
}

enum CategoryNames {
	FURNITURE = "Furniture",
	DECOR = "Decor",
	LIGHTING = "Lighting",
	FURNISHING = "Furnishing",
	WALL_ART = "Wall Art",
	APPLIANCES = "Appliances",
	OUTDOOR = "Outdoor",
	OTHERS = "Others",
	NON_SHOPPABLE = "Non Shoppable",
}

export interface CategoriesList {
	_id: string;
	name: CategoryNames;
}

export interface SubcategoryList {
	_id: string;
	name: string;
	category: string;
}

export interface Themes {
	_id: string;
	name: string;
	description?: string;
}

export interface VerticalsList {
	_id: string;
	name: string;
	category: string;
	subcategory: string;
}

export interface MetaDataType {
	retailers: {
		list: RetailersList[];
		count: number;
	};
	categories: {
		list: CategoriesList[];
		count: number;
	};
	subcategories: {
		list: SubcategoryList[];
		count: number;
	};
	verticals: {
		list: VerticalsList[];
		count: number;
	};
	themes: {
		list: Themes[];
		count: number;
	};
	designImgTypes: string[];
	cdnPrefix: string;
}

export interface AssetType {
	name: string;
	price: number;
	currency: string;
	description: string;
	retailer: {
		_id: string;
		name: string;
	};
	status: Status;
	shoppable: boolean;
	spatialData: {
		fileUrls: {
			source: string;
			glb: string;
			legacy_obj: string;
			sourceHighPoly: string;
		};
		mountType: MountTypes;
		clampValue: -1 | 0;
	};
	dimension: {
		depth: number;
		width: number;
		height: number;
	};
	meta: {
		category: string;
		subcategory: string;
		vertical: string;
		theme: string;
	};
	retailLink: string;
	cdn: string;
	_id: string;
	imageUrl: string;
	artist: {
		_id: string;
		profile: {
			firstName: string;
			lastName: string;
		};
		name: string;
	};
	tags: string[];
	createdAt: string;
	updatedAt: string;
}

export interface MoodboardAsset {
	recommendations: Partial<AssetType>[];
	_id: string;
	isExistingAsset: boolean;
	modellingStatus: Status;
	asset: Partial<AssetType>;
	externalUrl?: string;
}
