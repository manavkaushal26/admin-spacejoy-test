// ALL APP SPECIFIC RULES ARE TO BE ADDED HERE. TRY TO GROUP TOGETHER ROUTES SEMANTICALLY.

const router = require("express").Router();
const addIndexRoute = require("./appRoutes/indexRoute");
const addPageRoutes = require("./appRoutes/pageRoutes");
function definedRoutes(app) {
	let modRouter = router;
	modRouter = addPageRoutes(app, modRouter);
	modRouter = addIndexRoute(app, modRouter);
	return modRouter;
}

module.exports = definedRoutes;
