import { Model3DFiles } from "@customTypes/dashboardTypes";
import { Status } from "@customTypes/userType";
import { page } from "@utils/config";

export const designApi: (designId: string | string[]) => string = designId => {
	return `/admin/design/${designId}`;
};

export const designCopyApi: (designId: string) => string = designId => {
	return `/admin/design/${designId}/copy`;
};

export const createDesignApi: () => string = () => {
	return "/design";
};

export const deleteDesignApi: (designId) => string = designId => {
	return `/design/${designId}`;
};

export const getMetaDataApi: () => string = () => {
	return "/v3/unity/meta";
};

export const updateNotesApi: (designId: string) => string = designId => {
	return `/admin/design/${designId}/notes`;
};

export const getAssetApi: () => string = () => {
	return "/admin/assets/search";
};

export const getAssetElasticSearchApi: () => string = () => {
	return "v1/assets/search";
};

export const uploadAssetModelApi: (assetId: string, filetype?: Model3DFiles | "source" | "sourceHighPoly") => string = (
	assetId,
	filetype = Model3DFiles.Glb
) => {
	return `${page.apiBaseUrl}/v1/products/${assetId}/3d-file?fileType=${filetype}`;
};

export const uploadAssetImageApi: (assetId: string) => string = assetId => {
	return `${page.apiBaseUrl}/admin/products/${assetId}/image`;
};

export const deleteUploadedImageApi = (designId: string, imageId: string): string => {
	return `/admin/design/${designId}/image/${imageId}`;
};

export const getSingleAssetApi: (assetId: string) => string = assetId => {
	return `/v1/products/${assetId}/details`;
};

export const getMoodboardApi: (designId: string, assetEntryId?: string) => string = (designId, assetEntryId) => {
	return `/admin/design/${designId}/moodboard${assetEntryId ? `/${assetEntryId}` : ""}`;
};

export const getAddRemoveAssetApi: (designId: string, assetEntryId: string) => string = (designId, assetEntryId) => {
	return `/admin/design/${designId}/config/asset${assetEntryId ? `/${assetEntryId}` : ""}`;
};

// ************************************************ Design Examples ************************************************

export const getDesignSearchApi = (): string => {
	return "/designs/search";
};

export const getRoomsListApi = (roomscope, roomType): string => {
	return `/rooms?keyword=scope:${roomscope},roomType:${roomType}`;
};

export const publishDesignApi = (designId, status = Status.active): string => {
	return `/design/${designId}/publish?status=${status}`;
};

export const editDesignApi = (designId): string => {
	return `/design/${designId}`;
};

// *****************************************************************************************************************

export const getThemes = (): string => {
	return "/themes";
};

// *****************************************************************************************************************

export const updateSubtasks = (designId): string => {
	return `/admin/design/${designId}/requirement`;
};

// *****************************************************************************************************************

export const getAssetsInDesignApi = (designId): string => {
	return `/v1/design/${designId}/assets`;
};
