import { Currency, MountTypes } from "./assetInfoTypes";
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

export interface ImageType {
	_id: string;
	cdn: string;
	storageUrl: string;
}

export enum ModeOfOperation {
	Online = "online",
	Offline = "offline",
	Both = "both",
}

export interface AssetType {
	name: string;
	price: number;
	currency: Currency;
	description: string;
	retailer: {
		_id: string;
		name: string;
	};
	productImages: ImageType[];
	status: Status;
	inStock: boolean;
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
	available: boolean;
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
			name: string;
		};
		name: string;
	};
	tags: string[];
	createdAt: string;
	updatedAt: string;
	// E-COMMERCE
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
	flatShipping?: number;
}

export interface ScrapedAssetType extends AssetType {
	scrape: {
		available: boolean;
		price: number;
		prices: number[];
		currency: string;
		retailer: {
			host: string;
			name: string;
		};
	};
}

export interface AssetStoreSearchResponse {
	artist: string;
	category: string;
	productImages: ImageType[];
	cdn: string;
	clampValue: number;
	colors: string[];
	createdAt: string;
	currency: Currency;
	depth: number;
	description: string;
	height: number;
	imageUrl: string;
	mountType: string;
	name: string;
	price: number;
	inStock: boolean;
	retailLink: string;
	retailer: string;
	shoppable: true;
	status: string;
	subcategory: string;
	tags: string[];
	theme: string;
	updatedAt: string;
	vertical: string;
	width: number;
	_id: string;
}

export interface MoodboardAsset {
	recommendations: Partial<AssetType>[];
	_id: string;
	isExistingAsset: boolean;
	modellingStatus: Status;
	asset: Partial<AssetType>;
	externalUrl?: string;
}
