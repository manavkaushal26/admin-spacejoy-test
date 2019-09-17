import { company, page } from "@utils/config";
import React from "react";

const BaseMeta = [
	<meta key="subject" name="subject" content={company.subject} />,
	<meta key="url" name="url" content={company.url} />,
	<meta key="identifierURL" name="identifier-URL" content={company.url} />,
	<meta key="category" name="category" content="Home Decor, Space, Interior" />,
	<meta key="coverage" name="coverage" content="Worldwide" />,
	<meta key="mobileWebCapable" name="mobile-web-app-capable" content="yes" />,
	<meta key="themeColor" name="theme-color" content="#ffffff" />,
	<meta key="googleSiteVerification" name="google-site-verification" content={page.googleSiteVerification} />,
	<link key="icon" rel="icon" sizes="192x192" href="/static/icon.png" />,
	<link key="canonical" rel="canonical" href="/" />,
	<link key="favicon" rel="shortcut icon" href="/static/favicon.ico" />,
	<link key="favicon-android" rel="icon" type="image/png" sizes="192x192" href="/static/android-icon-192x192.png" />,
	<link key="favicon-32" rel="icon" type="image/png" sizes="32x32" href="/static/favicon-32x32.png" />,
	<link key="favicon-96" rel="icon" type="image/png" sizes="96x96" href="/static/favicon-96x96.png" />,
	<link key="favicon-16" rel="icon" type="image/png" sizes="16x16" href="/static/favicon-16x16.png" />
];

const OGMeta = [
	<meta key="og-title" name="og:title" content="SpaceJoy" />,
	<meta key="og-type" name="og:type" content="Interior" />,
	<meta key="og-url" name="og:url" content="https://www.imdb.com/title/tt0117500/" />,
	<meta key="og-image" name="og:image" content="https://ia.media-imdb.com/rock.jpg" />,
	<meta key="og-site_name" name="og:site_name" content="Spacejoy" />,
	<meta key="og-description" name="og:description" content="A group of U.S. Marines, under command of..." />,
	<meta key="og-email" name="og:email" content={company.email.support} />,
	<meta key="og-latitude" name="og:latitude" content={company.address[0].latitude} />,
	<meta key="og-longitude" name="og:longitude" content={company.address[0].longitude} />,
	<meta
		key="og-street"
		name="og:street-address"
		content={company.address[0].location1 + company.address[0].location2}
	/>,
	<meta key="og-locality" name="og:locality" content={company.address[0].city} />,
	<meta key="og-region" name="og:region" content={company.address[0].state} />,
	<meta key="og-postal" name="og:postal-code" content={company.address[0].pin} />,
	<meta key="og-country" name="og:country-name" content={company.address[0].country} />,
	<meta key="fbId" name="fb:page_id" content={company.social.facebookId} />
];

const AppleMeta = [
	<meta key="appleMobileWebCapable" name="apple-mobile-web-app-capable" content="yes" />,
	<meta key="appleTouchFullScreen" content="yes" name="apple-touch-fullscreen" />,
	<meta key="appleStatusBar" name="apple-mobile-web-app-status-bar-style" content="black" />,
	<meta key="formatDetection" name="format-detection" content="telephone=no" />
];

const IEMeta = [
	<meta key="msapplicationStartUrl" name="msapplication-starturl" content="/" />,
	<meta key="msapplicationLogo" name="msapplication-square310x310logo" content="ios.png" />
];

const AppleLink = [
	<link key="apple-touch-icon1" rel="apple-touch-icon" href="/static/ios-icon.png" />,
	<link key="apple-touch-icon2" rel="apple-touch-icon" sizes="72x72" href="touch-icon-ipad.png" />,
	<link key="apple-touch-icon3" rel="apple-touch-icon" sizes="114x114" href="touch-icon-iphone4.png" />,
	<link key="apple-touch-startup1" rel="apple-touch-startup-image" href="/startup.png" />,
	<link key="apple-touch-icon4" rel="apple-touch-icon" type="image/png" href="/apple-touch-icon.png" />
];

const IndexPage = [
	<meta key="keywords" name="keywords" content="your, tags" />,
	<meta key="description" name="description" content="150 words" />,
	<meta key="language" name="language" content="ES" />,
	<meta key="robots" name="robots" content="index,follow" />,
	<meta key="topic" name="topic" content="" />,
	<meta key="summary" name="summary" content="" />
];

const IndexPageMeta = [...BaseMeta, ...OGMeta, ...AppleMeta, ...IEMeta, ...AppleLink, ...IndexPage];

export default IndexPageMeta;
