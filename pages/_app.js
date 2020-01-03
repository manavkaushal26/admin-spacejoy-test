import App from "next/app";
import Router from "next/router";
import React from "react";
import { ThemeProvider } from "styled-components";
import SVGIcon from "../_components/SVGIcon";
import theme from "../_theme";
import "../node_modules/antd/lib/button/style/index";
import "../node_modules/antd/lib/card/style/index";
import "../node_modules/antd/lib/checkbox/style/index";
import "../node_modules/antd/lib/col/style/index";
import "../node_modules/antd/lib/divider/style/index";
import "../node_modules/antd/lib/drawer/style/index";
import "../node_modules/antd/lib/dropdown/style/index";
import "../node_modules/antd/lib/empty/style/index";
import "../node_modules/antd/lib/icon/style/index";
import "../node_modules/antd/lib/input/style/index";
import "../node_modules/antd/lib/list/style/index";
import "../node_modules/antd/lib/message/style/index";
import "../node_modules/antd/lib/modal/style/index";
import "../node_modules/antd/lib/page-header/style/index";
import "../node_modules/antd/lib/pagination/style/index";
import "../node_modules/antd/lib/popover/style/index";
import "../node_modules/antd/lib/progress/style/index";
import "../node_modules/antd/lib/row/style/index";
import "../node_modules/antd/lib/skeleton/style/index";
import "../node_modules/antd/lib/slider/style/index";
import "../node_modules/antd/lib/tabs/style/index";
import "../node_modules/antd/lib/tag/style/index";
import "../node_modules/antd/lib/tree/style/index";
import "../node_modules/antd/lib/typography/style/index";
import "../node_modules/antd/lib/upload/style/index";
import "../node_modules/antd/lib/statistic/style/index";

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
