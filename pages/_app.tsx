import "antd/lib/affix/style";
import "antd/lib/button/style";
import "antd/lib/card/style";
import "antd/lib/alert/style";
import "antd/lib/carousel/style";
import "antd/lib/checkbox/style";
import "antd/lib/col/style";
import "antd/lib/collapse/style";
import "antd/lib/divider/style";
import "antd/lib/drawer/style";
import "antd/lib/dropdown/style";
import "antd/lib/empty/style";
import "antd/lib/form/style";
import "antd/lib/icon/style";
import "antd/lib/input/style";
import "antd/lib/layout/style";
import "antd/lib/list/style";
import "antd/lib/message/style";
import "antd/lib/modal/style";
import "antd/lib/notification/style";
import "antd/lib/table/style";
import "antd/lib/page-header/style";
import "antd/lib/pagination/style";
import "antd/lib/popconfirm/style";
import "antd/lib/popover/style";
import "antd/lib/progress/style";
import "antd/lib/radio/style";
import "antd/lib/row/style";
import "antd/lib/skeleton/style";
import "antd/lib/slider/style";
import "antd/lib/statistic/style";
import "antd/lib/switch/style";
import "antd/lib/tabs/style";
import "antd/lib/tag/style";
import "antd/lib/tooltip/style";
import "antd/lib/tree/style";
import "antd/lib/typography/style";
import "antd/lib/result/style";
import "antd/lib/upload/style";
import "antd/lib/date-picker/style";
import "antd/lib/input-number/style";

import App from "next/app";
import Router from "next/router";
import React from "react";
import styled, { ThemeProvider } from "styled-components";
import theme from "../_theme";

const StyledLoaderIcon = styled.div`
	border: 15px double #e84393;
	content: "";
	border-top: 15px double #eee;
	border-bottom: 15px double #eee;
	border-right: 15px double #eee;
	animation: rotate 1s linear infinite;
	border-radius: 15px;
	@keyframes rotate {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
`;
export default class MyApp extends App {
	state = {
		loading: false,
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
						<StyledLoaderIcon />
					</div>
				</div>
			</ThemeProvider>
		);
	}
}
