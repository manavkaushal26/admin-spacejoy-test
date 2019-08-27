import theme from "@theme/index";
import App from "next/app";
import React from "react";
import { ThemeProvider } from "styled-components";

export default class MyApp extends App {
	render() {
		const { Component, pageProps } = this.props;
		return (
			<ThemeProvider theme={theme}>
				<Component {...pageProps} />
			</ThemeProvider>
		);
	}
}
