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
	} catch {
		throw new Error();
	} finally {
	}
};

const deleteResource = async (endPoint, body) => {
	try {
		const resData = await fetcher({ endPoint, method: "DELETE", body });
		const { data, statusCode } = resData;
		if (statusCode && statusCode <= 201) {
			notification.success({ message: "Successfully deleted" });
			return data;
		} else {
			throw new Error();
		}
	} catch {
		throw new Error();
	} finally {
	}
};

const createResource = async (endPoint, body) => {
	try {
		const resData = await fetcher({ isMultipartForm: true, endPoint, method: "POST", body });
		const { data, statusCode } = resData;
		if (statusCode && statusCode <= 201) {
			notification.success({ message: "Upload successful" });
			return data;
		} else {
			throw new Error();
		}
	} catch {
		throw new Error();
	} finally {
	}
};

const handleScores = async (method, body) => {
	try {
		const resData = await fetcher({ endPoint: "/quiz/admin/v1/image/score", method: method, body: body });
		const { data, statusCode } = resData;
		if (statusCode && statusCode <= 201) {
			return data;
		} else {
			throw new Error();
		}
	} catch {
		throw new Error();
	} finally {
	}
};

module.exports = { styleFetcher, deleteResource, createResource, handleScores };
