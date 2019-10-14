import { page } from "@utils/config";
import fetch from "isomorphic-unfetch";
import getToken from "./getToken";

async function fetcher({ ctx, endPoint, method, body }) {
	const JWT = getToken(ctx);
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
		console.log("response", response);
		console.log("resData", resData);
		return resData;
	}
	return response;
}

export default fetcher;
