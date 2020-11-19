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

const deleteResource = async (endPoint, body) => {
	try {
		await fetcher({ endPoint, method: "DELETE", body });
	} catch (err) {
		throw new err();
	}
};

const createResource = async (endPoint, body) => {
	try {
		await fetcher({ isMultipartForm: true, endPoint, method: "POST", body });
	} catch (err) {
		throw new err();
	} finally {
	}
};

module.exports = { styleFetcher, deleteResource, createResource };
