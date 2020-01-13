import { page } from "@utils/config";

export const designApi: (designId: string | string[]) => string = designId => {
	return `/admin/design/${designId}`;
};

export const designCopyApi: (designId: string) => string = designId => {
	return `/admin/design/${designId}/copy`;
};

export const createDesignApi: () => string = () => {
	return `/design`;
};

export const deleteDesignApi: (designId) => string = designId => {
	return `/design/${designId}`;
};

export const getMetaDataApi: () => string = () => {
	return "/unity/meta";
};

export const updateNotesApi: (designId: string) => string = designId => {
	return `/admin/design/${designId}/notes`;
};

export const getAssetApi: () => string = () => {
	return "admin/assets/search";
};

export const uploadAssetModel: (assetId: string) => string = assetId => {
	if (process.env.NODE_ENV !== "production") {
		return `${page.stageApiBaseUrl}/admin/asset/${assetId}/model?filetype=glb`;
	}
	return `${page.apiBaseUrl}/admin/asset/${assetId}/model?filetype=glb`;
};

export const deleteUploadedImage = (designId: string, imageId: string) => {
	return `/admin/design/${designId}/image/${imageId}`;
};

export const getSingleAssetApi: (assetId: string) => string = assetId => {
	return `/admin/asset/${assetId}`;
};

export const getMoodboardApi: (designId: string, assetEntryId?: string) => string = (designId, assetEntryId) => {
	return `/admin/design/${designId}/moodboard${assetEntryId ? `/${assetEntryId}` : ""}`;
};

export const getAddRemoveAssetApi: (designId: string, assetEntryId: string) => string = (designId, assetEntryId) => {
	return `/admin/design/${designId}/config/asset${assetEntryId ? `/${assetEntryId}` : ""}`;
};
