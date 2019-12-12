import { page } from "@utils/config";

export const uploadRoomApi: (designId: string, roomId?: string) => string = (designId, roomId) => {
	if (process.env.NODE_ENV !== "production") {
		return `${page.stageApiBaseUrl}/admin/design/${designId}/config/room${roomId ? `/${roomId}` : ""}`;
	}
	return `${page.apiBaseUrl}/admin/design/${designId}/config/room${roomId ? `/${roomId}` : ""}`;
};
