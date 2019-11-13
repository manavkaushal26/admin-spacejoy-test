// ALL APP SPECIFIC RULES ARE TO BE ADDED HERE. TRY TO GROUP TOGETHER ROUTES SEMANTICALLY.

const router = require("express").Router();
const addIndexRoute = require("./appRoutes/indexRoute");

function definedRoutes(app) {
	const modRouter = addIndexRoute(app, router);
	return modRouter;
}

module.exports = definedRoutes;
