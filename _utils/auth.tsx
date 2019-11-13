import { cookieNames } from "@utils/config";
import cookie from "js-cookie";
import Router from "next/router";
import React, { Component, ComponentClass } from "react";
import fetcher from "./fetcher";
import getCookie from "./getCookie";
import { ServerResponse } from "http";
import { NextPageContext } from "next";

const endPointAuthCheck: string = "/auth/check";
const endPointGuestSignup: string = "/auth/register/guest";

interface ExtendedJSXElement extends React.Component, React.SFC {
	displayName?: string;
	name?: string;
	getInitialProps?: Function;
}

interface ExtendedJSXFC extends React.FC {
	displayName?: string;
	name?: string;
	getInitialProps?: Function;
}

interface redirectArguments {
	pathname: string;
	query: {
		flow?: string;
		redirectUrl?: string;
	};
	url: string;
	res?: ServerResponse;
}

const redirectToLocation = (params: redirectArguments): void => {
	const { pathname, query, url, res } = params;
	if (typeof window !== "undefined") {
		switch (pathname) {
			case "/auth":
				Router.replace({ pathname, query }, url);
				return;
			default:
				Router.push({ pathname, query }, url);
				return;
		}
	} else {
		res.writeHead(302, {
			Location: url
		});
		res.end();
		return;
	}
};

interface LoginArguments {
	token: string;
	redirectUrl: string;
}

const login = ({ token, redirectUrl }: LoginArguments): void => {
	cookie.remove(cookieNames.authToken);
	cookie.remove(cookieNames.userRole);
	window.localStorage.removeItem("authVerification");
	cookie.set(cookieNames.authToken, token, { expires: 365 });
	if (redirectUrl !== null) {
		const url = redirectUrl || "/dashboard";
		redirectToLocation({ pathname: url, query: {}, url });
	}
};

const guestLogin = async (): Promise<void> => {
	if (getCookie(null, cookieNames.authToken)) return;
	const body = {};
	const response = await fetcher({ endPoint: endPointGuestSignup, method: "POST", body });
	if (response.statusCode <= 300) {
		const {
			token,
			user: { role }
		} = response.data;
		login({ token, redirectUrl: null });
		cookie.set(cookieNames.userRole, role, { expires: 10 });
	}
};

const logout = (): void => {
	cookie.remove(cookieNames.userRole);
	cookie.remove(cookieNames.authToken);
	window.localStorage.setItem("logout", Date.now().toString());
	window.localStorage.removeItem("authVerification");
	redirectToLocation({
		pathname: "/auth",
		query: { flow: "login", redirectUrl: "/dashboard" },
		url: "/auth/login?redirectUrl=/dashboard"
	});
};

const auth = (ctx: NextPageContext): string | void => {
	const token = getCookie(ctx, cookieNames.authToken);
	const role = getCookie(ctx, cookieNames.userRole);
	if (!token || role === "guest") {
		const redirect = {
			pathname: "/auth",
			query: { flow: "signup", redirectUrl: ctx.pathname },
			url: `/auth/signup?redirectUrl=${ctx.pathname}`
		};
		return ctx.req ? redirectToLocation({ ...redirect, res: ctx.res }) : redirectToLocation(redirect);
	}
	return token;
};

const getDisplayName = (JSXComponent: ExtendedJSXElement | ExtendedJSXFC): string =>
	JSXComponent.displayName || JSXComponent.name || "Component";

const withAuthSync = (WrappedComponent: ExtendedJSXElement | ExtendedJSXFC): ComponentClass => {
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
};

const withAuthVerification = (WrappedComponent: ExtendedJSXElement | ExtendedJSXFC): ComponentClass => {
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
};

export { login, guestLogin, logout, withAuthSync, withAuthVerification, auth, redirectToLocation };
