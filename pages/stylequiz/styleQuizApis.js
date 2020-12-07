export const getStylesAPI = () => {
	return "/quiz/admin/v1/styles?limit=100";
};

export const getActiveStylesAPI = () => {
	return "/quiz/admin/v1/styles/active";
};

export const updateStyleAPI = () => {
	return "/quiz/admin/v1/style/update";
};

export const getStyleIconsAPI = () => {
	return "/quiz/v1/style/icons";
};

export const modifyStyleIconsAPI = () => {
	return "/quiz/admin/v1/style/icon";
};

export const paletteAPI = () => {
	return "/quiz/admin/v1/palette";
};

export const textureAPI = () => {
	return "/quiz/admin/v1/texture";
};
