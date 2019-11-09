import { cookieNames, page } from "@utils/config";
import fetch from "isomorphic-unfetch";
import getCookie from "./getCookie";

async function fetcher({ ctx, endPoint, method, body }) {
	const JWT = getCookie(ctx, cookieNames.authToken);
	const headers = JWT
		? { "Content-Type": "application/json", Authorization: JWT }
		: { "Content-Type": "application/json" };
	const options =
		method === "GET"
			? {
					method,
					headers
			  }
			: {
					method,
					headers,
					body: JSON.stringify(body)
			  };
	const response = await fetch(page.apiBaseUrl + endPoint, options);
	if (response.status) {
		const resData = await response.json();
		return resData;
	}
	return response;
}

export default fetcher;
