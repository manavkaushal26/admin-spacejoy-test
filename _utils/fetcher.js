import { page } from "@utils/config";
import fetch from "isomorphic-unfetch";
import getToken from "./getToken";

function fetcher({ ctx, endPoint, method, body }) {
	const token = getToken(ctx);
	const headers = token
		? { "Content-Type": "application/json", Authorization: token }
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
	return fetch(page.apiBaseUrl + endPoint, options);
}

export default fetcher;
