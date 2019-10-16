import { page } from "@utils/config";
import Document, { Head, Main, NextScript } from "next/document";
import React from "react";
import { ServerStyleSheet } from "styled-components";

const prod = process.env.NODE_ENV === "production";

const gtm = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
								new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
								j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
								'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
						})(window,document,'script','dataLayer','${page.gtm}');`;

const stopFlicker = `(function(a,s,y,n,c,h,i,d,e){s.className+=' '+y;h.start=1*new Date;
						h.end=i=function(){s.className=s.className.replace(RegExp(' ?'+y),'')};
						(a[n]=a[n]||[]).hide=h;setTimeout(function(){i();h.end=null},c);h.timeout=c;
						})(window,document.documentElement,'async-hide','dataLayer',4000,
						{'${page.optimize}':true});`;

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
			<html lang="en-US">
				<Head>
					{prod && <script dangerouslySetInnerHTML={{ __html: stopFlicker }} />}
					<link rel="preconnect" href="//cdnjs.cloudflare.com" />
					<link rel="preconnect" href="//res.cloudinary.com" />
					<link rel="preconnect" href="//www.google-analytics.com" />
					<link rel="dns-prefetch" href="//cdnjs.cloudflare.com" />
					<link rel="dns-prefetch" href="//res.cloudinary.com" />
					<link rel="dns-prefetch" href="//www.google-analytics.com" />
					<link rel="manifest" href="/static/manifest.json" />
					<link
						rel="preload"
						href="https://cdnjs.cloudflare.com/ajax/libs/sanitize.css/2.0.0/sanitize.min.css"
						as="style"
					/>
					<link rel="preload" href="/static/styles/reflex.min.css?v1.0.0" as="style" />
					<link rel="preload" href="/static/styles/style.css?v1.0.1" as="style" />
					<link
						href="//cdnjs.cloudflare.com/ajax/libs/sanitize.css/2.0.0/sanitize.min.css"
						rel="stylesheet"
						media="screen"
					/>
					<link href="/static/styles/reflex.min.css?v1" rel="stylesheet" media="screen" />
					<link href="/static/styles/style.css?v1" rel="stylesheet" media="screen" />
					<link
						rel="stylesheet"
						media="screen"
						href="//cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
					/>
					<script src={`https://maps.googleapis.com/maps/api/js?key=${page.placeKey}&libraries=places&language=en`} />
					<script src="https://js.stripe.com/v3/" async defer />
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
			</html>
		);
	}
}

export default MyDocument;
