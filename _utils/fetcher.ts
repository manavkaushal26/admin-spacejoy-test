import { cookieNames, page } from "@utils/config";
import fetch from "isomorphic-unfetch";
import { NextPageContext } from "next";
import getCookie from "./getCookie";

interface FetcherParams {
	ctx?: NextPageContext;
	endPoint: string;
	method: string;
	body?: any;
}

async function fetcher({ ctx, endPoint, method, body }: FetcherParams): Promise<any> {
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
