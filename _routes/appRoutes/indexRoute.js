function indexRoute(app, router) {
	router.get(["/", "/index"], (req, res) => {
		app.render(req, res, "/index", { flow: "login" });
	});

	return router;
}

module.exports = indexRoute;
