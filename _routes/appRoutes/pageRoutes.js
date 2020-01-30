function pageRoute(app, router) {
	router.get("/launchpad", (req, res) => {
		const { params } = req;
		app.render(req, res, "/launchpad", params);
	});
	router.get("/dashboard/pid/:projectId/did/:designId", (req, res) => {
		const { params } = req;
		app.render(req, res, "/dashboard", { pid: params.projectId, designId: params.designId });
	});
	router.get("/dashboard/pid/:projectId", (req, res) => {
		const { params } = req;
		app.render(req, res, "/dashboard", { pid: params.projectId });
	});
	router.get("/dashboard", (req, res) => {
		const { params } = req;
		app.render(req, res, "/dashboard", params);
	});
	router.get("/assetstore/pid/:projectId/did/:designId/aeid/:assetEntryId", (req, res) => {
		const { params } = req;
		app.render(req, res, "/assetstore", {
			projectId: params.projectId,
			designId: params.designId,
			assetEntryId: params.assetEntryId,
		});
	});
	router.get("/assetstore/pid/:projectId/did/:designId", (req, res) => {
		const { params } = req;
		app.render(req, res, "/assetstore", { projectId: params.projectId, designId: params.designId });
	});
	router.get("/assetstore", (req, res) => {
		const { params } = req;
		app.render(req, res, "/assetstore", params);
	});
	return router;
}

module.exports = pageRoute;
