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
import { setLocalStorageValue } from "./storageUtils";

const endPointAuthCheck = "/auth/check";
const endPointSocialSignup = "/auth/login/oauth";

function redirectToLocation({
	pathname,
	query = {},
	url,
	res,
}: {
	pathname: string;
	query?: Record<string, string>;
	url?: string;
	res?: ServerResponse;
}): void {
	if (typeof window !== "undefined") {
		Router.push({ pathname, query }, url);
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

async function oAuthLogin(data, redirectUrl = "/launchpad", cb): Promise<void> {
	const response = await fetcher({
		endPoint: endPointSocialSignup,
		method: "POST",
		body: {
			data: {
				provider: data._provider,
				token: data._token.idToken || data._token.accessToken,
			},
		},
	});
	if (response.statusCode <= 300) {
		const { token, user } = response.data;
		login({ token, user, redirectUrl });
	} else {
		cb("Error");
	}
}

function logout(): void {
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

		static async getInitialProps(ctx): Promise<{ isServer: boolean; authVerification?: Partial<User> }> {
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
			}
			return { ...componentProps, isServer };
		}

		render(): JSX.Element {
			return <WrappedComponent {...this.props} />;
		}
	};
}

export { login, oAuthLogin, logout, withAuthSync, withAuthVerification, auth, redirectToLocation, clearAllStorage };
