function indexRoute(app, router) {
	router.get("/dashboard", (req, res) => {
		const { params } = req;
		app.render(req, res, "/dashboard", params);
	});
	router.get(["/", "/index"], (req, res) => {
		const { params } = req;
		app.render(req, res, "/index", params);
	});

	return router;
}

module.exports = indexRoute;
