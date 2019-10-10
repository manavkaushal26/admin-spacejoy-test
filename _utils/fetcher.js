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
	console.log("fetcher", response);
	const { status, statusCode, data, context, message, group } = response;
	const tmpMapper = { status, statusCode, data, context, message, group };
	if (response.status === 200) {
		const resData = await response.json();
		return resData;
	}
	return tmpMapper;
}

export default fetcher;
