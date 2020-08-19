export const roomMetaDataApi = (): string => {
	return "/designs/search/public";
};

export const assetCreateOrUpdationApi = (assetId?: string): string => {
	return `/v1/products${assetId ? `/${assetId}` : ""}`;
};

export const addRetailerApi = (): string => {
	return "/retailer";
};

export const markMissingAssetAsComplete = (designId: string, assetId: string): string => {
	return `/admin/design/${designId}/moodboard/${assetId}`;
};

export const getAssetHistoryApi = (assetId: string): string => {
	return `/admin/assets/log/${assetId}`;
};

export const uploadProductImagesApi = (assetId: string): string => {
	return `/v1/products/${assetId}/images`;
};

export const updateAssetStockApi = (): string => {
	return "/asset/stock/update";
};
