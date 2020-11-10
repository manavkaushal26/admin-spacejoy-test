import { cookieNames, page } from "@utils/config";
import fetch from "isomorphic-unfetch";
import getCookie from "./getCookie";

async function chatFetcher({ ctx, endPoint, method, body, isSocket = false, type = "text" }) {
	const isServer = ctx && ctx.req && !!ctx.req;
	const JWT = getCookie(ctx, cookieNames.authToken);

	const headers = JWT ? { Authorization: JWT } : {};

	const options =
		method === "GET"
			? {
					method,
					headers,
			  }
			: {
					method,
					headers,
					body,
			  };
	const finalAPIBaseUrl = isSocket ? page.apiSocketUrl : page.apiBaseUrl;
	const response = await fetch(finalAPIBaseUrl + endPoint, options);
	if (response.status) {
		try {
			if (response.status === 204) {
				return {
					statusCode: response.status,
					status: response.statusText,
				};
			}
			if (response.status !== 401 && response.status !== 204) {
				const resData = await response.json();
				if (resData.statusCode) {
					return resData;
				}
				return { data: resData, statusCode: response.status };
			}
		} catch (error) {
			// eslint-disable-next-line no-console
			console.log("Error", error);
		}
	}
	return {
		statusCode: response.status,
		status: response.statusText,
	};
}

export default chatFetcher;
