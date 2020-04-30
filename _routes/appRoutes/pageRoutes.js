function pageRoute(app, router) {
	// ******************************************************* Launchpad *******************************************************

	router.get("/launchpad", (req, res) => {
		const { params } = req;
		app.render(req, res, "/launchpad", params);
	});

	// *************************************************************************************************************************

	// **************************************************** Design Examples ****************************************************

	router.get("/designexamples/:designId", (req, res) => {
		const { params, query } = req;
		app.render(req, res, "/designexamples/designExampleView", { designId: params.designId, ...query });
	});

	router.get("/designexamples", (req, res) => {
		const { params } = req;
		app.render(req, res, "/designexamples", params);
	});

	// *************************************************************************************************************************

	// ******************************************************* DASHBOARD *******************************************************
	router.get("/dashboard/pid/:projectId/did/:designId", (req, res) => {
		const { params, query } = req;
		app.render(req, res, "/dashboard", {
			pid: params.projectId,
			designId: params.designId,
			...query,
		});
	});
	router.get("/dashboard/pid/:projectId", (req, res) => {
		const { params } = req;
		app.render(req, res, "/dashboard", { pid: params.projectId });
	});
	router.get("/dashboard", (req, res) => {
		const { params } = req;
		app.render(req, res, "/dashboard", params);
	});

	// *************************************************************************************************************************

	// ****************************************************** Asset Store ******************************************************

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

	// *************************************************************************************************************************

	// ****************************************************** Author ***********************************************************

	router.get("/author", (req, res) => {
		const { params, query } = req;
		app.render(req, res, "/author", {
			...query,
		});
	});

	// *************************************************************************************************************************

	// ****************************************************** platformanager ***********************************************************

	router.get("/platformanager/collectionsmeta", (req, res) => {
		const { query } = req;
		app.render(req, res, "/platformanager/collectionsmeta", {
			...query,
		});
	});

	router.get("/platformanager", (req, res) => {
		const { query } = req;
		app.render(req, res, "/platformanager", {
			...query,
		});
	});

	// *************************************************************************************************************************

	return router;
}

module.exports = pageRoute;
