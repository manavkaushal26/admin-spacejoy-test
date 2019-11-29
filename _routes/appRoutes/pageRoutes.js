function pageRoute(app, router) {
	router.get("/dashboard/:pid", (req, res) => {
		const { params } = req;
		app.render(req, res, "/dashboard", { pid: params.pid });
	});
	router.get("/dashboard", (req, res) => {
		const { params } = req;
		app.render(req, res, "/dashboard", params);
	});
	router.get("/assetstore", (req, res) => {
		const { params } = req;
		app.render(req, res, "/assetstore", params);
	});
	return router;
}

module.exports = pageRoute;
