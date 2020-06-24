import { clearAllStorage, redirectToLocation } from "@utils/auth";
import { cookieNames, page } from "@utils/config";
import { NextPageContext } from "next";
import getCookie from "./getCookie";

interface FetcherParams {
	ctx?: NextPageContext;
	endPoint: string;
	method: "GET" | "POST" | "PUT" | "DELETE";
	body?: any;
	hasBaseURL?: boolean;
	isMultipartForm?: boolean;
}

async function fetcher({ ctx, endPoint, method, body, hasBaseURL, isMultipartForm }: FetcherParams): Promise<any> {
	const JWT = getCookie(ctx, cookieNames.authToken);
	const isServer = ctx && ctx.req && !!ctx.req;
	let apiURL = endPoint;
	if (!hasBaseURL) {
		apiURL = `${page.apiBaseUrl}${endPoint}`;
		if (process.env.NODE_ENV === "staging") {
			apiURL = `${page.localApiBaseUrl}${endPoint}`;
		}
	}
	const headers = JWT
		? {
				"Content-Type": "application/json",
				Authorization: JWT,
		  }
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
					body: isMultipartForm ? body : JSON.stringify(body),
			  };

	if (isMultipartForm) {
		delete options.headers["Content-Type"];
	}
	const response = await fetch(apiURL, options);
	if (response.status === 401) {
		if (!isServer && typeof window !== "undefined") {
			if (window.location.pathname.split("/")[1] !== "auth") {
				clearAllStorage();
				redirectToLocation({
					pathname: "/auth",
					query: { flow: "login", redirectUrl: `/${window.location.search.split("/")[1] || "launchpad"}` },
					url: `/auth/login?redirectUrl=/${window.location.search.split("/")[1] || "launchpad"}`,
				});
			}
		}
	}
	if (response.status === 204) {
		return {
			statusCode: response.status,
		};
	}
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
