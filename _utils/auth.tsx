import User from "@customTypes/userType";
import { cookieNames } from "@utils/config";
import { ServerResponse } from "http";
import cookie from "js-cookie";
import { NextPage, NextPageContext } from "next";
import Router from "next/router";
import React, { Component } from "react";
import { allowedRoles } from "./constants";
import fetcher from "./fetcher";
import getCookie from "./getCookie";
import { getLocalStorageValue, setLocalStorageValue } from "./storageUtils";

const endPointAuthCheck = "/auth/check";

function redirectToLocation({
	pathname,
	query = {},
	url,
	res,
	options = {},
}: {
	pathname: string;
	query?: Record<string, string>;
	url?: string;
	res?: ServerResponse;
	options?: { shallow?: boolean };
}): void {
	if (typeof window !== "undefined") {
		Router.push({ pathname, query }, url, options);
	} else {
		res.writeHead(302, {
			Location: url,
		});
		res.end();
	}
}

function clearAllStorage(): void {
	cookie.remove(cookieNames.userRole);
	cookie.remove(cookieNames.authToken);
	window.localStorage.clear();
}

function login({ token, user, redirectUrl = "/launchpad" }): void {
	clearAllStorage();
	if (allowedRoles.includes(user.role)) {
		cookie.set(cookieNames.authToken, token, { expires: 365 });
		cookie.set(cookieNames.userRole, user.role, { expires: 365 });
		setLocalStorageValue("authVerification", user);
		if (redirectUrl !== null) {
			const url = redirectUrl || "/launchpad";
			redirectToLocation({ pathname: url, url });
		}
	}
}

async function logout(): Promise<void> {
	await fetcher({ endPoint: "/auth/logout", method: "POST", body: {} });
	clearAllStorage();
	window.localStorage.setItem("logout", Date.now().toString());
	redirectToLocation({
		pathname: "/auth",
		query: { flow: "login", redirectUrl: "/launchpad" },
		url: "/auth/login?redirectUrl=/launchpad",
	});
}

function auth(ctx: NextPageContext): string | void {
	const token = getCookie(ctx, cookieNames.authToken);
	if (!token) {
		const redirect = {
			pathname: "/auth",
			query: { flow: "signup", redirectUrl: ctx.pathname },
			url: `/auth/signup?redirectUrl=${ctx.pathname}`,
		};
		return ctx.req ? redirectToLocation({ ...redirect, res: ctx.res }) : redirectToLocation(redirect);
	}
	return token;
}

const getDisplayName = (JSXComponent): string => JSXComponent.displayName || JSXComponent.name || "Component";

function withAuthSync(WrappedComponent: NextPage) {
	return class extends Component {
		static displayName = `withAuthSync(${getDisplayName(WrappedComponent)})`;

		static async getInitialProps(ctx): Promise<{ token: string | void }> {
			const token = auth(ctx);
			const componentProps = WrappedComponent.getInitialProps && (await WrappedComponent.getInitialProps(ctx));
			return { ...componentProps, token };
		}

		componentDidMount(): void {
			window.addEventListener("storage", this.syncLogout);
		}

		componentWillUnmount(): void {
			window.removeEventListener("storage", this.syncLogout);
			window.localStorage.removeItem("logout");
		}

		syncLogout = (event): void => {
			clearAllStorage();
			if (event.key === "logout") {
				redirectToLocation({ pathname: "/auth", query: { flow: "login" }, url: "/auth/login" });
			}
		};

		render(): JSX.Element {
			return <WrappedComponent {...this.props} />;
		}
	};
}

function withAuthVerification(WrappedComponent: NextPage) {
	return class extends Component {
		static displayName = `withAuthVerification(${getDisplayName(WrappedComponent)})`;

		static async getInitialProps(
			ctx: NextPageContext
		): Promise<{ isServer: boolean; authVerification?: Partial<User> }> {
			const isServer = !!ctx.req;
			const token = getCookie(ctx, cookieNames.authToken);
			const componentProps = WrappedComponent.getInitialProps && (await WrappedComponent.getInitialProps(ctx));
			if (token) {
				if (!isServer && window.localStorage.getItem("authVerification")) {
					const authVerification = JSON.parse(window.localStorage.getItem("authVerification"));
					if (authVerification) return { ...componentProps, authVerification, isServer };
					redirectToLocation({
						pathname: "/auth",
						query: { flow: "login", redirecUrl: window.location.pathname },
						url: "/auth/login",
					});
				}
				const res = await fetcher({ ctx, endPoint: endPointAuthCheck, method: "GET" });
				if (res.statusCode <= 300) {
					const authVerification = res.data;
					if (!isServer && window) window.localStorage.setItem("authVerification", JSON.stringify(authVerification));
					return { ...componentProps, authVerification, isServer };
				}
				if (res.statusCode === 401) {
					redirectToLocation({
						pathname: "/auth",
						query: { flow: "login", redirecUrl: window.location.pathname },
						url: "/auth/login",
						res: ctx.res,
					});
				}
			}
			return { ...componentProps, isServer };
		}

		componentDidMount() {
			window.addEventListener("storage", () => {
				const logoutData = getLocalStorageValue("logout");
				if (logoutData && !window.location.pathname.includes("auth")) {
					window.location.replace(`/auth/login?redirectUrl=${window.location.pathname}`);
				} else {
					const authDetails = getLocalStorageValue("authVerification");
					if (authDetails && window.location.pathname.includes("auth")) {
						window.location.reload();
					}
				}
			});
		}

		render(): JSX.Element {
			return <WrappedComponent {...this.props} />;
		}
	};
}

export { login, logout, withAuthSync, withAuthVerification, auth, redirectToLocation, clearAllStorage };
