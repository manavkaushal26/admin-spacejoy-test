/* eslint-disable @typescript-eslint/no-var-requires */
const fetch = require("isomorphic-unfetch");
const nextCookie = require("next-cookies");
const { page } = require("./config");

const endPoint = "/auth/check";

async function TokenCheckPoint(req, res, next) {
	const redirectUrl = `/auth/login?redirectUrl=${req.originalUrl}`;
	const JWT = nextCookie({ req }).token;
	if (!JWT) {
		res.redirect(redirectUrl);
	} else {
		const contentType = "application/json";
		const headers = { "Content-Type": contentType, "Authorization": JWT };
		const options = {
			method: "GET",
			headers,
		};
		const response = await fetch(page.apiBaseUrl + endPoint, options);
		if (response.status <= 300) {
			next();
		} else {
			res.redirect(redirectUrl);
		}
	}
}

module.exports = TokenCheckPoint;
