import { page } from "@utils/config";
import { Model3DFiles } from "@customTypes/dashboardTypes";
import { Status } from "@customTypes/userType";

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

export const uploadAssetModelApi: (assetId: string, filetype?: Model3DFiles | "source" | "sourceHighPoly") => string = (
	assetId,
	filetype = Model3DFiles.Glb
) => {
	if (process.env.NODE_ENV !== "production") {
		return `${page.stageApiBaseUrl}/admin/asset/${assetId}/model?filetype=${filetype}`;
	}
	return `${page.apiBaseUrl}/admin/asset/${assetId}/model?filetype=${filetype}`;
};

export const uploadAssetImageApi: (assetId: string) => string = assetId => {
	if (process.env.NODE_ENV !== "production") {
		return `${page.stageApiBaseUrl}/admin/asset/${assetId}/image`;
	}
	return `${page.apiBaseUrl}/admin/asset/${assetId}/image`;
};

export const deleteUploadedImageApi = (designId: string, imageId: string) => {
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
	return `/themes`;
};

// *****************************************************************************************************************

export const updateSubtasks = (designId): string => {
	return `/admin/design/${designId}/requirement`;
};
