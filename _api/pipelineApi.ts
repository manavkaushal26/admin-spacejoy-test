export const uploadRoomApi: (designId: string, roomType: string, fileType: string) => string = designId => {
	return `/admin/design/${designId}/config/room?roomType:livingroom&fileType:legacy_obj}`;
};
