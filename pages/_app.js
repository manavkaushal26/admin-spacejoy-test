import App from "next/app";
import Router from "next/router";
import React from "react";
import { ThemeProvider } from "styled-components";
import SVGIcon from "../_components/SVGIcon";
import theme from "../_theme";

export default class MyApp extends App {
	state = {
		loading: false
	};

	componentDidMount() {
		Router.router.events.on("routeChangeStart", () => this.setState({ loading: true }));
		Router.router.events.on("routeChangeComplete", () => this.setState({ loading: false }));
	}

	render() {
		const { loading } = this.state;
		const { Component, pageProps } = this.props;
		return (
			<ThemeProvider theme={theme}>
				<div className={`${loading ? "loading" : ""}`}>
					<Component {...pageProps} />
					<div className="loader-ring">
						<SVGIcon name="spinner" className="loading-spinner" height={20} width={20} />
					</div>
				</div>
			</ThemeProvider>
		);
	}
}
