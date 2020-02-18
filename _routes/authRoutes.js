// DO NOT MODIFY THIS FILE DIRECTLY
// PLEASE ADD APP SPECIFIC ROUTES TO userDefinedRoutes.js
// IF CHANGES TO THIS FILE ARE TO BE DONE, PLEASE DO SO AT https://bitbucket.org/ndllabs/spacejoyweb-admin

const router = require("express").Router();

function authRoutes(app) {
	router.get("/auth/:flow(login|signup|forgot-password)", (req, res) => {
		app.render(req, res, "/index", Object.assign({ redirectUrl: req.query.redirectUrl }, { flow: req.params.flow }));
	});
	return router;
}

module.exports = authRoutes;
