import cookie from "js-cookie";
import Router from "next/router";
import React, { Component } from "react";
import fetcher from "./fetcher";
import getToken from "./getToken";

const endPointAuthCheck = "/auth/check";
const endPointGuestSignup = "/auth/register/guest";

function redirectToLocation({ pathname, query, url, res = {} }) {
	if (typeof window !== "undefined") {
		switch (pathname) {
			case "/auth":
				return Router.push({ pathname, query }, url);
			case "/designMySpace":
				return Router.push({ pathname, query }, url);
			default:
				return Router.push({ pathname }, `${pathname}`);
		}
	}
	return res.redirect(302, url);
}

function login({ token, redirectUrl }) {
	cookie.set("token", token, { expires: 1 });
	if (redirectUrl !== null) {
		const url = redirectUrl || "/dashboard";
		redirectToLocation({ pathname: url, query: {}, url });
	}
}

async function guestLogin() {
	if (getToken()) return;
	const body = {
		email: "guest5@gmail.com",
		password: "guest",
		firstName: "guest",
		lastName: "",
		region: "",
		role: "customer"
	};

	const response = await fetcher({ endPoint: endPointGuestSignup, method: "POST", body });
	if (response.statusCode <= 300) {
		const { sessionKey } = response.data;
		await login({ token: sessionKey, redirectUrl: null });
	}
}

function logout() {
	cookie.remove("token");
	window.localStorage.setItem("logout", Date.now());
	window.localStorage.removeItem("authVerification");
	redirectToLocation({
		pathname: "/auth",
		query: { flow: "login", redirectUrl: "/" },
		url: "/auth/login?redirectUrl=/"
	});
}

function auth(ctx) {
	const token = getToken(ctx);
	const redirect = {
		pathname: "/auth",
		query: { flow: "login", redirectUrl: ctx.pathname },
		url: `/auth/login?redirectUrl=${ctx.pathname}`
	};
	if (!token) {
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
			const token = getToken(ctx);
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

export { login, guestLogin, logout, withAuthSync, withAuthVerification, auth, redirectToLocation };
