const prod = process.env.NODE_ENV === "production";

const dataToPush = (data, type) => {
	if (prod && typeof window !== "undefined") {
		window.dataLayer.push({ data, ...{ event: type } });
		if (type === "RouteChange" || type === "LandingPage") {
			window.dataLayer.push({ event: "optimize.activate" });
		}
	}
};
module.exports = {
	PushLog: data => {
		dataToPush(data, "Click");
	},
	LandingPage: data => {
		dataToPush(data, "LandingPage");
	},
	RouteChange: data => {
		dataToPush(data, "RouteChange");
	},
	PwaInstalled: data => {
		dataToPush(data, "PWAInstalled");
	}
};
