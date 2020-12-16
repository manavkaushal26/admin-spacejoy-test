export const getStylesAPI = () => {
	return "/v1/quizStyles";
};

export const adminGetImagesAPI = id => {
	return `/v1/quizStyles/${id}/images`;
};

export const getAllImagesAPI = () => {
	return "/v1/quizImages";
};

export const getAllUntaggedImagesAPI = () => {
	return "/v1/quizStyles/untagged/images";
};

export const getActiveStylesAPI = () => {
	return "/v1/quizStyles/active";
};

export const updateStyleAPI = () => {
	return "/quiz/admin/v1/style/update";
};

export const getAllIcons = () => {
	return "/v1/quizStyles/icons";
};

export const getStyleIconsAPI = id => {
	return `/v1/quizStyles/${id}/icons`;
};

export const modifyStyleIconsAPI = () => {
	return "/v1/quizStyles/icon";
};

export const paletteAPI = () => {
	return "/v1/quizPalettes";
};

export const textureAPI = () => {
	return "/v1/quizTextures";
};

export const getProductsAPI = id => {
	return `/v1/quizStyles/${id}/products`;
};

export const postProductsAPI = () => {
	return "/v1/quizProducts";
};

export const descriptionsAPI = () => {
	return "/v1/quizStyles/description";
};
