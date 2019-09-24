import { page } from "@utils/config";
import fetch from "isomorphic-unfetch";
import nextCookie from "next-cookies";

function fetcher({ ctx, endPoint, method, body }) {
	const { token } = nextCookie(ctx);
	if (method === "GET") {
		return fetch(page.apiBaseUrl + endPoint, {
			method,
			headers: {
				"Content-Type": "application/json",
				Authorization: token
			}
		});
	}
	return fetch(page.apiBaseUrl + endPoint, {
		method,
		headers: {
			"Content-Type": "application/json",
			Authorization: token
		},
		body: JSON.stringify(body)
	});
}

export default fetcher;
