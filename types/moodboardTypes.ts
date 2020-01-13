enum ServiceType {
	furniture = "furniture",
	paint = "paint",
	other = "other"
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
	NON_SHOPPABLE = "Non Shoppable"
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
	designImgTypes: string[];
	cdnPrefix: string;
}

export interface SingleAssetType {
	dimension: {
		depth: number;
		width: number;
		height: number;
	};
	meta: {
		category: string;
		subcategory: string;
		vertical: string;
	};
	name: string;
	price: number;
	currency: string;
	retailer: {
		_id: string;
		name: string;
	};
	retailLink: string;
	cdn: string;
	_id: string;
	imageUrl: string;
	createdAt: string;
	updatedAt: string;
}

export interface AssetType {
	name: string;
	price: number;
	currency: string;
	retailer: {
		_id: string;
		name: string;
	};
	meta: {
		category: string;
		subcategory: string;
		vertical: string;
	};
	retailLink: string;
	cdn: string;
	_id: string;
	imageUrl: string;
}

export interface MoodboardAsset {
	recommendations: Partial<AssetType>[];
	_id: string;
	isExistingAsset: boolean;
	asset: Partial<AssetType>;
	externalUrl?: string;
}
