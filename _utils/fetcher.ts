import { cookieNames, page } from "@utils/config";
import fetch from "isomorphic-unfetch";
import { NextPageContext } from "next";
import getCookie from "./getCookie";

interface FetcherParams {
	ctx?: NextPageContext;
	endPoint: string;
	method: "GET" | "POST" | "PUT" | "DELETE";
	body?: any;
}

async function fetcher({ ctx, endPoint, method, body }: FetcherParams): Promise<any> {
	const JWT = getCookie(ctx, cookieNames.authToken);

	let apiURL = page.stageApiBaseUrl;
	if (process.env.NODE_ENV === "production") {
		apiURL = page.apiBaseUrl;
	} else if (process.env.NODE_ENV === "staging") {
		apiURL = page.localApiBaseUrl;
	}

	const headers = JWT
		? { "Content-Type": "application/json", Authorization: JWT }
		: { "Content-Type": "application/json" };
	const options =
		method === "GET"
			? {
					method,
					headers,
			  }
			: {
					method,
					headers,
					body: JSON.stringify(body),
			  };
	const response = await fetch(`${apiURL}${endPoint}`, options);
	if (response.status) {
		const resData = await response.json();
		return resData;
	}
	const data = {
		status: response.status,
		message: response.statusText,
	};
	return { ...response, ...data };
}

export default fetcher;
