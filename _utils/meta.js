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
	<link
		key="apple-touch-icon-57"
		rel="apple-touch-icon"
		sizes="57x57"
		href="/static/logo-icons/apple-icon-57x57.png"
	/>,
	<link
		key="apple-touch-icon-60"
		rel="apple-touch-icon"
		sizes="60x60"
		href="/static/logo-icons/apple-icon-60x60.png"
	/>,
	<link
		key="apple-touch-icon-72"
		rel="apple-touch-icon"
		sizes="72x72"
		href="/static/logo-icons/apple-icon-72x72.png"
	/>,
	<link
		key="apple-touch-icon-76"
		rel="apple-touch-icon"
		sizes="76x76"
		href="/static/logo-icons/apple-icon-76x76.png"
	/>,
	<link
		key="apple-touch-icon-114"
		rel="apple-touch-icon"
		sizes="114x114"
		href="/static/logo-icons/apple-icon-114x114.png"
	/>,
	<link
		key="apple-touch-icon-120"
		rel="apple-touch-icon"
		sizes="120x120"
		href="/static/logo-icons/apple-icon-120x120.png"
	/>,
	<link
		key="apple-touch-icon-144"
		rel="apple-touch-icon"
		sizes="144x144"
		href="/static/logo-icons/apple-icon-144x144.png"
	/>,
	<link
		key="apple-touch-icon-152"
		rel="apple-touch-icon"
		sizes="152x152"
		href="/static/logo-icons/apple-icon-152x152.png"
	/>,
	<link
		key="apple-touch-icon-180"
		rel="apple-touch-icon"
		sizes="180x180"
		href="/static/logo-icons/apple-icon-180x180.png"
	/>,
	<link
		key="icon-192"
		rel="icon"
		type="image/png"
		sizes="192x192"
		href="/static/logo-icons/android-icon-192x192.png"
	/>,
	<link key="icon-32" rel="icon" type="image/png" sizes="32x32" href="/static/logo-icons/favicon-32x32.png" />,
	<link key="icon-96" rel="icon" type="image/png" sizes="96x96" href="/static/logo-icons/favicon-96x96.png" />,
	<link key="icon-16" rel="icon" type="image/png" sizes="16x16" href="/static/logo-icons/favicon-16x16.png" />,
];

const OGMeta = [
	<meta key="og-title" property="og:title" content={`${company.product} - ${company.tagLine}`} />,
	<meta key="og-description" property="og:description" content={company.description} />,
	<meta key="og-url" property="og:url" content="https://spacejoy.com/" />,
	<meta key="og-type" property="og:type" content="website" />,
	<meta
		key="og-image"
		property="og:image"
		content="https://res.cloudinary.com/spacejoy/image/upload/v1568907005/web/spacejoy_wbyfqf.png"
	/>,
	<meta key="og-site_name" property="og:site_name" content={company.product} />,
	<meta key="og-email" property="og:email" content={company.email.support} />,
	<meta key="fbPageId" property="fb:page_id" content={company.social.facebookPageId} />,
	<meta key="fbAppId" property="fb:app_id" content={company.social.facebookAppId} />,
	<meta key="tw-card" name="twitter:card" content="app" />,
	<meta key="tw-description" name="twitter:description" content={company.description} />,
	<meta key="tw--name-iphone" name="twitter:app:name:iphone" content={company.product} />,
	<meta key="tw-id-iphone" name="twitter:app:id:iphone" content={page.appStoreId} />,
	<meta key="tw-name-ipad" name="twitter:app:name:ipad" content={company.product} />,
	<meta key="tw-id-ipad" name="twitter:app:id:ipad" content={page.appStoreId} />,
	<meta key="tw-playstore" name="twitter:app:id:googleplay" content={page.playStoreId} />,
	<meta key="tw-appstore" name="twitter:app:name:googleplay" content={company.product} />,
	<meta key="tw-country" name="twitter:app:country" content="us" />,
	<meta key="pintrest-varification" name="p:domain_verify" content={company.social.pinterestAppId} />,
];

const AppleMeta = [
	<meta key="appleMobileWebCapable" name="apple-mobile-web-app-capable" content="yes" />,
	<meta key="appleTouchFullScreen" content="yes" name="apple-touch-fullscreen" />,
	<meta key="appleStatusBar" name="apple-mobile-web-app-status-bar-style" content="black" />,
	<meta key="formatDetection" name="format-detection" content="telephone=no" />,
];

const IEMeta = [
	<meta key="msapplicationStartUrl" name="msapplication-starturl" content="/" />,
	<meta key="msapplicationLogo" name="msapplication-square310x310logo" content="/static/spacejoy-310.png" />,
];

const AppleLink = [
	<link key="apple-touch-icon1" rel="apple-touch-icon" href="/static/logo-icons/ios-icon.png" />,
	<link key="apple-touch-icon2" rel="apple-touch-icon" sizes="72x72" href="/static/logo-icons/spacejoy-72.png" />,
	<link key="apple-touch-icon3" rel="apple-touch-icon" sizes="114x114" href="/static/logo-icons/spacejoy-114.png" />,
	<link key="apple-touch-startup1" rel="apple-touch-startup-image" href="/static/logo-icons/spacejoy-310.png" />,
	<link key="apple-touch-icon4" rel="apple-touch-icon" type="image/png" href="/static/logo-icons/spacejoy-310.png" />,
];

const IndexPage = [
	<meta key="language" name="language" content="ES" />,
	<meta key="robots" name="robots" content="index,follow" />,
	<meta key="topic" name="topic" content={company.subject} />,
	<meta key="summary" name="summary" content={company.description} />,
];

const IndexPageMeta = [...BaseMeta, ...OGMeta, ...AppleMeta, ...IEMeta, ...AppleLink, ...IndexPage];

export default IndexPageMeta;
