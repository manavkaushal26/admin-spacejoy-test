import cookie from "js-cookie";
import nextCookie from "next-cookies";
import Router from "next/router";
import React, { Component } from "react";

function redirectToLocation(url, res = {}) {
	return typeof window !== "undefined" ? Router.push(url) : res.redirect(url);
}

function login({ token, redirectUrl }) {
	cookie.set("token", token, { expires: 1 });
	redirectToLocation(redirectUrl || "/profile");
}

function logout() {
	cookie.remove("token");
	window.localStorage.setItem("logout", Date.now());
	redirectToLocation("/auth/login");
}

function auth(ctx) {
	const { token } = nextCookie(ctx);
	if (!token) {
		return ctx.req ? redirectToLocation("/auth/login", ctx.res) : redirectToLocation("/auth/login");
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
				redirectToLocation("/auth/login");
			}
		};

		render() {
			return <WrappedComponent {...this.props} />;
		}
	};
}

export { login, logout, withAuthSync, auth, redirectToLocation };
