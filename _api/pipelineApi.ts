import { page } from "@utils/config";
import { RenderImgUploadTypes } from "@customTypes/dashboardTypes";

export const uploadRoomApi: (designId: string, roomId?: string) => string = (designId, roomId) => {
	return `${page.apiBaseUrl}/admin/design/${designId}/config/room${roomId ? `/${roomId}` : ""}`;
};

export const uploadRenderImages = (designId: string, imageType: RenderImgUploadTypes | "floorplan"): string => {
	return `${page.apiBaseUrl}/admin/design/${designId}/image/${imageType}`;
};

export const addRenderImageComment = (designId: string, imageId: string): string => {
	return `/admin/design/${designId}/config/image/${imageId}/comment`;
};

export const updateDesignPhase = (designId: string): string => {
	return `/admin/design/${designId}/phase`;
};

export const editDesignApi = (designId: string): string => {
	return `/design/${designId}`;
};
