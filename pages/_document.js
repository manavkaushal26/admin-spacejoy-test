import { page } from "@utils/config";
import Document, { Head, Html, Main, NextScript } from "next/document";
import React from "react";
import { ServerStyleSheet } from "styled-components";

const prod = process.env.NODE_ENV === "production";

const gtm = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
								new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
								j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
								'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
						})(window,document,'script','dataLayer','${page.gtm}');`;

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
					<link
						rel="stylesheet"
						media="screen"
						href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
					/>
					<link
						media="screen"
						rel="stylesheet"
						href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
					/>
					<link rel="icon" sizes="192x192" href="/static/icon.png" />
					<link rel="apple-touch-icon" href="/static/ios-icon.png" />
					<meta name="theme-color" content="#ffffff" />
					<meta name="msapplication-square310x310logo" content="ios.png" />
					<meta name="google-site-verification" content={page.googleSiteVerification} />
					<meta name="mobile-web-app-capable" content="yes" />
					<meta name="apple-mobile-web-app-capable" content="yes" />
					<meta name="msapplication-starturl" content="/" />
					{prod && <script dangerouslySetInnerHTML={{ __html: gtm }} />}
				</Head>
				<body>
					{prod && (
						<noscript>
							<iframe
								title="GTM"
								src={`https://www.googletagmanager.com/ns.html?id=${page.gtm}`}
								height="0"
								width="0"
							/>
						</noscript>
					)}
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument;
