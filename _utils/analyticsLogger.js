import ReactGA from "react-ga";
import { page } from "./config";

const prod = process.env.NODE_ENV === "production";

const GAEventName = {
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

const initGA = () => {
	if (prod) {
		ReactGA.initialize(page.ga);
	}
};

const logPageView = () => {
	if (prod) {
		ReactGA.set({ page: window.location.pathname });
		ReactGA.pageview(window.location.pathname);
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

const PushEvent = (category, action, label, value, data) => {
	dataToPush(data, GAEventName.click);
	logEvent(category, action, label, value);
};

const LandingPage = data => {
	dataToPush(data, GAEventName.landingPage);
	logPageView();
};

const RouteChange = data => {
	dataToPush(data, GAEventName.routeChange);
	logPageView();
};

const PwaInstalled = data => {
	dataToPush(data, GAEventName.PWAInstalled);
};

module.exports = { PushEvent, LandingPage, RouteChange, PwaInstalled, initGA, logException };
