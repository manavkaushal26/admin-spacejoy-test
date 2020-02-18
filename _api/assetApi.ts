export const roomMetaDataApi = (): string => {
	return `/designs/search/public`;
};

export const assetCreateOrUpdationApi = (assetId?: string): string => {
	return `/asset${assetId ? `/${assetId}` : ""}`;
};

export const addRetailerApi = (): string => {
	return "/retailer";
};
