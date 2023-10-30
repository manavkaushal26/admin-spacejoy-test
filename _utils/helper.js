import { imageKitConfig } from "./config";

function removeSpaces(url) {
	return url ? url.split(" ").join("-") : null;
}

const getImageKitUrl = (src, staticUrl) => {
	if (src) {
		const deliveryUrl = staticUrl ? imageKitConfig.baseDeliveryURLStatic : imageKitConfig.baseDeliveryURL;
		const trimmedSrc = src.replace(/^\/+/, "");

		// /fl_lossy,q_auto/
		if (src?.match(/^v[\d]*/) || src?.match(/^server/)) {
			return `${deliveryUrl}/${trimmedSrc}`;
		}
		return `${deliveryUrl}/${trimmedSrc}`;
	}
	return src;
};

export { getImageKitUrl, removeSpaces };
