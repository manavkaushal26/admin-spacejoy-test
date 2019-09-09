import cookie from "js-cookie";
import nextCookie from "next-cookies";
import Router from "next/router";
import React, { Component } from "react";

function login({ token }) {
	cookie.set("token", token, { expires: 1 });
	Router.push("/profile");
}

function logout() {
	cookie.remove("token");
	window.localStorage.setItem("logout", Date.now());
	Router.push("/auth/login");
}

function auth(ctx) {
	const { token } = nextCookie(ctx);
	if (ctx.req && !token) {
		ctx.res.writeHead(302, { Location: "/auth/login" });
		ctx.res.end();
	}
	if (!token) {
		Router.push("/auth/login");
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
				Router.push("/login");
			}
		};

		render() {
			return <WrappedComponent {...this.props} />;
		}
	};
}

export { login, logout, withAuthSync, auth };
