function indexRoute(app, router) {
	router.get(["/", "/index", "/dashboard"], (req, res) => {
		const { params } = req;
		app.render(req, res, "/index", params);
	});
	return router;
}

module.exports = indexRoute;
