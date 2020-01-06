import "antd/lib/button/style";
import "antd/lib/card/style";
import "antd/lib/checkbox/style";
import "antd/lib/col/style";
import "antd/lib/divider/style";
import "antd/lib/drawer/style";
import "antd/lib/dropdown/style";
import "antd/lib/empty/style";
import "antd/lib/icon/style";
import "antd/lib/input/style";
import "antd/lib/list/style";
import "antd/lib/message/style";
import "antd/lib/modal/style";
import "antd/lib/page-header/style";
import "antd/lib/pagination/style";
import "antd/lib/popover/style";
import "antd/lib/progress/style";
import "antd/lib/row/style";
import "antd/lib/skeleton/style";
import "antd/lib/slider/style";
import "antd/lib/statistic/style";
import "antd/lib/tabs/style";
import "antd/lib/tag/style";
import "antd/lib/tree/style";
import "antd/lib/typography/style";
import "antd/lib/upload/style";
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

	componentDidMount(): void {
		Router.router.events.on("routeChangeStart", () => this.setState({ loading: true }));
		Router.router.events.on("routeChangeComplete", () => this.setState({ loading: false }));
	}

	render(): JSX.Element {
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
