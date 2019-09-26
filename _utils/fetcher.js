import { page } from "@utils/config";
import fetch from "isomorphic-unfetch";
import cookie from "js-cookie";
import nextCookie from "next-cookies";

function fetcher({ ctx, endPoint, method, body }) {
	const token = ctx && ctx.req ? nextCookie(ctx).token : cookie.get("token");
	const headers = token
		? { "Content-Type": "application/json", Authorization: token }
		: { "Content-Type": "application/json" };
	if (method === "GET") {
		return fetch(page.apiBaseUrl + endPoint, {
			method,
			headers
		});
	}
	return fetch(page.apiBaseUrl + endPoint, {
		method,
		headers,
		body: JSON.stringify(body)
	});
}

export default fetcher;
