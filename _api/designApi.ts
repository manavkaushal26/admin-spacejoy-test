export const designApi: (designId: string) => string = designId => {
	return `/admin/design/${designId}`;
};

export const updateNotesApi: (designId: string) => string = designId => {
	return `/admin/design/${designId}/notes`;
};

export const getAssetApi: () => string = () => {
	return "/admin/assets";
};

export const getSingleAssetApi: (assetId: string) => string = assetId => {
	return `/admin/asset/${assetId}`;
};
