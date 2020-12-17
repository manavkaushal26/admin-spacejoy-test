import fetcher from "@utils/fetcher";
import { notification } from "antd";
const styleFetcher = async (endPoint, method) => {
	try {
		const resData = await fetcher({ endPoint, method: method });
		const { data, statusCode } = resData;
		if (statusCode && statusCode <= 201) {
			return data;
		} else {
			throw new Error();
		}
	} catch (err) {
		notification.error({ message: "Server timeout. Please refresh the page once" });
	}
};

const modifyFormDataResource = async (endPoint, method, body) => {
	try {
		const resData = await fetcher({ isMultipartForm: true, endPoint, method: method, body });
		const { data, statusCode } = resData;
		if (statusCode && statusCode <= 201) {
			return data;
		} else {
			notification.error({ message: "Server timeout. Please refresh the page once to see the uploaded images" });
		}
	} catch {
		notification.error({ message: "Server timeout. Please refresh the page once to see the uploaded images" });
	}
};

const updateResource = async (endPoint, method, body) => {
	try {
		const resData = await fetcher({ endPoint, method: method, body });
		const { data, statusCode } = resData;
		if (statusCode && statusCode <= 201) {
			return data;
		} else {
			throw new Error();
		}
	} catch (err) {
		notification.error({ message: "Server timeout. Please refresh the page once" });
	}
};

const multiFileUploader = files => {
	const formData = new FormData();
	for (let i = 0; i < files.length; i++) {
		formData.append("image", files[i]);
	}
	return formData;
};

module.exports = { styleFetcher, modifyFormDataResource, multiFileUploader, updateResource };
