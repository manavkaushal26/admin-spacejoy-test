import theme from "@theme/index";
import App, { Container } from "next/app";
import React from "react";
import { ThemeProvider } from "styled-components";

export default class MyApp extends App {
	render() {
		const { Component, pageProps } = this.props;
		return (
			<Container>
				<ThemeProvider theme={theme}>
					<Component {...pageProps} />
				</ThemeProvider>
			</Container>
		);
	}
}
