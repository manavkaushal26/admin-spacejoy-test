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
	<link key="icon" rel="icon" sizes="192x192" href="/static/logo-icons/icon.png" />,
	<link key="canonical" rel="canonical" href="/" />,
	<link key="favicon" rel="shortcut icon" href="/static/logo-icons/favicon.ico" />,
	<link
		key="favicon-android"
		rel="icon"
		type="image/png"
		sizes="192x192"
		href="/static/logo-icons/android-icon-192x192.png"
	/>,
	<link key="favicon-32" rel="icon" type="image/png" sizes="32x32" href="/static/logo-icons/favicon-32x32.png" />,
	<link key="favicon-96" rel="icon" type="image/png" sizes="96x96" href="/static/logo-icons/favicon-96x96.png" />,
	<link key="favicon-16" rel="icon" type="image/png" sizes="16x16" href="/static/logo-icons/favicon-16x16.png" />
];

const OGMeta = [
	<meta key="og-title" name="og:title" property="og:title" content={company.product} />,
	<meta key="og-description" name="og:description" property="og:description" content={company.description} />,
	<meta key="og-type" name="og:type" property="og:type" content="website" />,
	<meta key="og-url" name="og:url" property="og:url" content="https://spacejoy.com/" />,
	<meta
		key="og-image"
		name="og:image"
		property="og:image"
		content="https://res.cloudinary.com/spacejoy/image/upload/v1568907005/web/spacejoy_wbyfqf.png"
	/>,
	<meta key="og-site_name" name="og:site_name" property="og:site_name" content={company.product} />,
	<meta key="og-email" name="og:email" property="og:email" content={company.email.support} />,
	<meta key="fbId" name="fb:page_id" property="og:page_id" content={company.social.facebookId} />
];

const AppleMeta = [
	<meta key="appleMobileWebCapable" name="apple-mobile-web-app-capable" content="yes" />,
	<meta key="appleTouchFullScreen" content="yes" name="apple-touch-fullscreen" />,
	<meta key="appleStatusBar" name="apple-mobile-web-app-status-bar-style" content="black" />,
	<meta key="formatDetection" name="format-detection" content="telephone=no" />
];

const IEMeta = [
	<meta key="msapplicationStartUrl" name="msapplication-starturl" content="/" />,
	<meta key="msapplicationLogo" name="msapplication-square310x310logo" content="/static/spacejoy-310.png" />
];

const AppleLink = [
	<link key="apple-touch-icon1" rel="apple-touch-icon" href="/static/logo-icons/ios-icon.png" />,
	<link key="apple-touch-icon2" rel="apple-touch-icon" sizes="72x72" href="/static/logo-icons/spacejoy-72.png" />,
	<link key="apple-touch-icon3" rel="apple-touch-icon" sizes="114x114" href="/static/logo-icons/spacejoy-114.png" />,
	<link key="apple-touch-startup1" rel="apple-touch-startup-image" href="/static/logo-icons/spacejoy-310.png" />,
	<link key="apple-touch-icon4" rel="apple-touch-icon" type="image/png" href="/static/logo-icons/spacejoy-310.png" />
];

const IndexPage = [
	<meta
		key="keywords"
		name="keywords"
		content="spacejoy, home-decor, interior, design tips, who to improve your home"
	/>,
	<meta key="language" name="language" content="ES" />,
	<meta key="robots" name="robots" content="index,follow" />,
	<meta key="topic" name="topic" content={company.subject} />,
	<meta key="summary" name="summary" content={company.description} />,
	<meta key="description" name="description" content={company.description} />
];

const IndexPageMeta = [...BaseMeta, ...OGMeta, ...AppleMeta, ...IEMeta, ...AppleLink, ...IndexPage];

export default IndexPageMeta;
