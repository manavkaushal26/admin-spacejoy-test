import ClevertapReact from "clevertap-react";
import ReactGA from "react-ga";
import { page } from "./config";

const prod = process.env.NODE_ENV === "production";

const EventName = {
	click: "Click",
	landingPage: "LandingPage",
	routeChange: "RouteChange",
	PWAInstalled: "PWAInstalled"
};

const dataToPush = (data, type) => {
	if (prod && typeof window !== "undefined") {
		window.dataLayer.push({ data, ...{ event: type } });
		if (type === "RouteChange" || type === "LandingPage") {
			window.dataLayer.push({ event: "optimize.activate" });
		}
	}
};

const initAnalytics = () => {
	if (prod) {
		ReactGA.initialize(page.ga);
		ClevertapReact.initialize(page.CLEVERTAP_ACCOUNT_ID);
	}
};

const logPageView = () => {
	if (prod) {
		ReactGA.set({ page: window.location.pathname });
		ReactGA.pageview(window.location.pathname);
	}
};

const cleverTapPush = (category, action, value, label, event, data) => {
	if (prod) {
		ClevertapReact.event(event, {
			...data,
			PageName: window.location.pathname,
			Category: category,
			Action: action,
			Value: value,
			Label: label,
			Date: new Date()
		});
	}
};

const logEvent = (category = "", action = "", label = "", value = "") => {
	if (prod && category && action) {
		ReactGA.event({ category, action, label, value });
	}
};

const logException = (description = "", fatal = false) => {
	if (prod && description) {
		ReactGA.exception({ description, fatal });
	}
};

const PushEvent = (action, label, value, event, data) => {
	const categoryLabel = `web${window.location.pathname}`;
	dataToPush(data, EventName.click);
	logEvent(categoryLabel, action, label, value);
	cleverTapPush(categoryLabel, action, label, value, event, data);
};

const LandingPage = data => {
	dataToPush(data, EventName.landingPage);
	logPageView();
	cleverTapPush(null, null, null, null, EventName.landingPage, data);
};

const RouteChange = data => {
	dataToPush(data, EventName.routeChange);
	logPageView();
	cleverTapPush(null, null, null, null, EventName.routeChange, data);
};

const PwaInstalled = data => {
	dataToPush(data, EventName.PWAInstalled);
};

export { PushEvent, LandingPage, RouteChange, PwaInstalled, initAnalytics, logException };
