import { page } from "@utils/config";
import { DesignImgTypes } from "@customTypes/dashboardTypes";

export const uploadRoomApi: (designId: string, roomId?: string) => string = (designId, roomId) => {
	if (process.env.NODE_ENV !== "production") {
		return `${page.stageApiBaseUrl}/admin/design/${designId}/config/room${roomId ? `/${roomId}` : ""}`;
	}
	return `${page.apiBaseUrl}/admin/design/${designId}/config/room${roomId ? `/${roomId}` : ""}`;
};

export const uploadRenderImages = (designId: string, imageType: DesignImgTypes) => {
	if (process.env.NODE_ENV !== "production") {
		return `${page.stageApiBaseUrl}/admin/design/${designId}/image/${imageType}`;
	}
	return `${page.apiBaseUrl}/admin/design/${designId}/image/${imageType}`;
};

export const addRenderImageComment = (designId: string, imageId: string) => {
	return `/admin/design/${designId}/config/image/${imageId}/comment`;
};

export const updateDesignPhase = (designId: string) => {
	return `/admin/design/${designId}/phase`;
};
