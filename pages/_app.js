import theme from "@theme/index";
import { initGA, LandingPage, PwaInstalled, RouteChange } from "@utils/analyticsLogger";
import App from "next/app";
import Router from "next/router";
import React from "react";
import { ThemeProvider } from "styled-components";

export default class MyApp extends App {
	state = {
		loading: false
	};

	getUtmParam = url => url.split("utm_")[1];

	componentDidMount() {
		if (!window.GA_INITIALIZED) {
			initGA();
			window.GA_INITIALIZED = true;
		}
		LandingPage({ route: window.location.pathname, utm_source: this.getUtmParam(window.location.href) });
		Router.router.events.on("routeChangeStart", url => {
			if (url.split("/")[1] !== "playstore") {
				this.setState({ loading: true });
			}
		});
		Router.router.events.on("routeChangeComplete", () => {
			this.setState({ loading: false });
			RouteChange({ route: window.location.pathname, utm_source: this.getUtmParam(window.location.href) });
		});
		window.addEventListener("appinstalled", evt => {
			PwaInstalled({ evt });
		});
	}

	render() {
		const { loading } = this.state;
		const { Component, pageProps } = this.props;
		return (
			<ThemeProvider theme={theme}>
				<div className={`${loading ? "loading" : ""}`}>
					<Component {...pageProps} />
				</div>
			</ThemeProvider>
		);
	}
}
