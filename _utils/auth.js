import { cookieNames } from "@utils/config";
import cookie from "js-cookie";
import Router from "next/router";
import React, { Component } from "react";
import fetcher from "./fetcher";
import getCookie from "./getCookie";

const endPointAuthCheck = "/auth/check";
const endPointSocialSignup = "/auth/login/oauth";

function redirectToLocation({ pathname, query = {}, url, res = {} }) {
	if (typeof window !== "undefined") {
		Router.push({ pathname, query }, url);
	} else {
		res.writeHead(302, {
			Location: url
		});
		res.end();
	}
}

function clearAllStorage() {
	cookie.remove(cookieNames.userRole);
	cookie.remove(cookieNames.authToken);
	window.localStorage.clear();
}

function login({ token, role, redirectUrl = "/dashboard" }) {
	clearAllStorage();
	cookie.set(cookieNames.authToken, token, { expires: 365 });
	cookie.set(cookieNames.userRole, role, { expires: 365 });
	if (redirectUrl !== null) {
		const url = redirectUrl || "/dashboard";
		redirectToLocation({ pathname: url, url });
	}
}

async function oAuthLogin(data, redirectUrl = "/dashboard", cb) {
	const response = await fetcher({
		endPoint: endPointSocialSignup,
		method: "POST",
		body: {
			data: {
				provider: data._provider,
				token: data._token.idToken || data._token.accessToken
			}
		}
	});
	if (response.statusCode <= 300) {
		const {
			token,
			user: { role }
		} = response.data;
		login({ token, role, redirectUrl });
	} else {
		cb("Error");
	}
}

function logout() {
	clearAllStorage();
	window.localStorage.setItem("logout", Date.now());
	redirectToLocation({
		pathname: "/auth",
		query: { flow: "login", redirectUrl: "/dashboard" },
		url: "/auth/login?redirectUrl=/dashboard"
	});
}

function auth(ctx) {
	const token = getCookie(ctx, cookieNames.authToken);
	const role = getCookie(ctx, cookieNames.userRole);
	if (!token) {
		const redirect = {
			pathname: "/auth",
			query: { flow: "signup", redirectUrl: ctx.pathname },
			url: `/auth/signup?redirectUrl=${ctx.pathname}`
		};
		return ctx.req ? redirectToLocation({ ...redirect, res: ctx.res }) : redirectToLocation(redirect);
	}
	return token;
}

const getDisplayName = JSXComponent => JSXComponent.displayName || JSXComponent.name || "Component";

function withAuthSync(WrappedComponent) {
	return class extends Component {
		static displayName = `withAuthSync(${getDisplayName(WrappedComponent)})`;

		static async getInitialProps(ctx) {
			const token = auth(ctx);
			const componentProps = WrappedComponent.getInitialProps && (await WrappedComponent.getInitialProps(ctx));
			return { ...componentProps, token };
		}

		componentDidMount() {
			window.addEventListener("storage", this.syncLogout);
		}

		componentWillUnmount() {
			window.removeEventListener("storage", this.syncLogout);
			window.localStorage.removeItem("logout");
		}

		syncLogout = event => {
			if (event.key === "logout") {
				redirectToLocation({ pathname: "/auth", query: { flow: "login" }, url: "/auth/login" });
			}
		};

		render() {
			return <WrappedComponent {...this.props} />;
		}
	};
}

function withAuthVerification(WrappedComponent) {
	return class extends Component {
		static displayName = `withAuthVerification(${getDisplayName(WrappedComponent)})`;

		static async getInitialProps(ctx) {
			const isServer = !!ctx.req;
			const token = getCookie(ctx, cookieNames.authToken);
			const componentProps = WrappedComponent.getInitialProps && (await WrappedComponent.getInitialProps(ctx));
			if (token) {
				if (!isServer && window.localStorage.getItem("authVerification")) {
					const authVerification = JSON.parse(window.localStorage.getItem("authVerification"));
					return { ...componentProps, authVerification, isServer };
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

		render() {
			return <WrappedComponent {...this.props} />;
		}
	};
}

export { login, oAuthLogin, logout, withAuthSync, withAuthVerification, auth, redirectToLocation };
