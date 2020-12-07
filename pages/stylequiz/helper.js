import fetcher from "@utils/fetcher";
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

const modifyFormDataResource = async (endPoint, method, body) => {
	try {
		const resData = await fetcher({ isMultipartForm: true, endPoint, method: method, body });
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

const updateResource = async (endPoint, method, body) => {
	try {
		const resData = await fetcher({ endPoint, method: method, body });
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

const multiFileUploader = files => {
	const formData = new FormData();
	for (let i = 0; i < files.length; i++) {
		formData.append("image", files[i]);
	}
	console.log("formData", formData);
	return formData;
};

module.exports = { styleFetcher, modifyFormDataResource, multiFileUploader, updateResource };
