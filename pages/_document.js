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
					enhanceApp: App => props => sheet.collectStyles(<App {...props} />),
				});
			const initialProps = await Document.getInitialProps(ctx);
			return {
				...initialProps,
				styles: (
					<>
						{initialProps.styles}
						{sheet.getStyleElement()}
					</>
				),
			};
		} finally {
			sheet.seal();
		}
	}

	render() {
		return (
			<Html lang='en-US'>
				<Head>
					<link rel='preconnect' href='//cdnjs.cloudflare.com' />
					<link rel='preconnect' href='//res.cloudinary.com' />
					<link rel='preload' href='/static/styles/style.css?v1.0.4' as='style' />
					<link rel='manifest' href='/manifest.json' />
					<link href='/static/styles/style.css?v1.0.4' rel='stylesheet' />
					<script
						src='https://cdn.tiny.cloud/1/nodxa0klye29turh3kyb50oizr3vzfpjakvcb1bfwg6heqrq/tinymce/5/tinymce.min.js'
						referrerpolicy='origin'
					></script>
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
