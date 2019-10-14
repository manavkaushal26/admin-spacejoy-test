import cookie from "js-cookie";
import Router from "next/router";
import React, { Component } from "react";
import fetcher from "./fetcher";
import getToken from "./getToken";

const endPointAuthCheck = "/auth/check";

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
	const url = redirectUrl || "/dashboard";
	cookie.set("token", token, { expires: 1 });
	redirectToLocation({ pathname: url, query: {}, url });
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
				const authVerificationFromLS = window.localStorage.getItem("authVerification");
				if (!isServer && authVerificationFromLS) {
					const authVerification = JSON.parse(authVerificationFromLS);
					return { ...componentProps, authVerification, isServer };
				}
				const res = await fetcher({ ctx, endPoint: endPointAuthCheck, method: "GET" });
				if (res.status <= 300) {
					const authVerification = await res.json();
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

export { login, logout, withAuthSync, withAuthVerification, auth, redirectToLocation };
