import Document, { Head, Html, Main, NextScript } from "next/document";
import React from "react";
import { ServerStyleSheet } from "styled-components";

class MyDocument extends Document {
	static async getInitialProps(ctx) {
		const sheet = new ServerStyleSheet();
		const originalRenderPage = ctx.renderPage;
		try {
			ctx.renderPage = () =>
				originalRenderPage({
					enhanceApp: App => props => sheet.collectStyles(<App {...props} />)
				});
			const initialProps = await Document.getInitialProps(ctx);
			return {
				...initialProps,
				styles: (
					<>
						{initialProps.styles}
						{sheet.getStyleElement()}
					</>
				)
			};
		} finally {
			sheet.seal();
		}
	}

	render() {
		return (
			<Html>
				<Head>
					<link
						rel="preload"
						href="https://cdnjs.cloudflare.com/ajax/libs/sanitize.css/2.0.0/sanitize.min.css"
						as="style"
					/>
					<link rel="preload" href="/static/style.css?v1" as="style" />
					<link rel="dns-prefetch" href="//cdnjs.cloudflare.com" />
					<link rel="manifest" href="/static/manifest.json" />
					<link rel="shortcut icon" href="/static/favicon.ico" />
					<link href="/static/style.css?v1" rel="stylesheet" media="screen" />
					<link
						href="https://cdnjs.cloudflare.com/ajax/libs/sanitize.css/2.0.0/sanitize.min.css"
						rel="stylesheet"
						media="screen"
					/>
					<meta name="theme-color" content="#ffffff" />
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument;
