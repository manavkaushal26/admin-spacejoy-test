import { page } from "@utils/config";
import nextCookie from "next-cookies";

function fetcher({ ctx, endPoint, method }) {
	const { token } = nextCookie(ctx);
	return fetch(page.apiBaseUrl + endPoint, {
		method,
		headers: {
			Authorization: token
		}
	});
}

export default fetcher;
