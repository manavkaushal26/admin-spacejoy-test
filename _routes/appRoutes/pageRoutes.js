const TokenCheckMiddleware = require("../../_utils/tokenCheckPoint");

function pageRoute(app, router) {
	// ******************************************************* Launchpad *******************************************************

	router.get("/launchpad", TokenCheckMiddleware, (req, res) => {
		const { params } = req;
		app.render(req, res, "/launchpad", params);
	});

	// *************************************************************************************************************************

	// **************************************************** Design Examples ****************************************************

	router.get("/designexamples/:designId", TokenCheckMiddleware, (req, res) => {
		const { params, query } = req;
		app.render(req, res, "/designexamples/designExampleView", { designId: params.designId, ...query });
	});

	router.get("/designexamples", TokenCheckMiddleware, (req, res) => {
		const { params } = req;
		app.render(req, res, "/designexamples", params);
	});

	// *************************************************************************************************************************

	// ******************************************************* DASHBOARD *******************************************************
	router.get("/dashboard/pid/:projectId/did/:designId", TokenCheckMiddleware, (req, res) => {
		const { params, query } = req;
		app.render(req, res, "/dashboard", {
			pid: params.projectId,
			designId: params.designId,
			...query,
			...params,
		});
	});
	router.get("/dashboard/pid/:projectId", TokenCheckMiddleware, (req, res) => {
		const { params, query } = req;
		app.render(req, res, "/dashboard", { pid: params.projectId, ...params, ...query });
	});
	router.get("/dashboard", TokenCheckMiddleware, (req, res) => {
		const { params, query } = req;
		app.render(req, res, "/dashboard", { ...params, query });
	});

	// *************************************************************************************************************************

	// ****************************************************** Asset Store ******************************************************

	router.get("/assetstore/assetdetails", TokenCheckMiddleware, (req, res) => {
		const { params, query } = req;
		app.render(req, res, "/assetstore/assetdetails", {
			...query,
		});
	});

	router.get("/assetstore/pid/:projectId/did/:designId/aeid/:assetEntryId", TokenCheckMiddleware, (req, res) => {
		const { params } = req;
		app.render(req, res, "/assetstore", {
			projectId: params.projectId,
			designId: params.designId,
			assetEntryId: params.assetEntryId,
		});
	});
	router.get("/assetstore/pid/:projectId/did/:designId", TokenCheckMiddleware, (req, res) => {
		const { params } = req;
		app.render(req, res, "/assetstore", { projectId: params.projectId, designId: params.designId });
	});
	router.get("/assetstore", TokenCheckMiddleware, (req, res) => {
		const { params } = req;
		app.render(req, res, "/assetstore", params);
	});

	// *************************************************************************************************************************

	// ****************************************************** Author ***********************************************************

	router.get("/author", TokenCheckMiddleware, (req, res) => {
		const { query } = req;
		app.render(req, res, "/author", {
			...query,
		});
	});

	// *************************************************************************************************************************

	// **************************************************** Render Engine ******************************************************

	router.get("/renderengine/src/:srcId", TokenCheckMiddleware, (req, res) => {
		const { params, query } = req;
		app.render(req, res, "/renderengine/sourcepage", { ...params, ...query });
	});

	router.get("/renderengine", TokenCheckMiddleware, (req, res) => {
		const { query } = res;
		app.render(req, res, "/renderengine", {
			...query,
		});
	});

	// *************************************************************************************************************************

	// ************************************************** platformanager *******************************************************

	router.get("/platformanager/broadcastmessage", TokenCheckMiddleware, (req, res) => {
		const { query } = req;
		app.render(req, res, "/platformanager/broadcastmessage", {
			...query,
		});
	});

	router.get("/platformanager/usermanagement", TokenCheckMiddleware, (req, res) => {
		const { query } = req;
		app.render(req, res, "/platformanager/usermanagement", {
			...query,
		});
	});

	router.get("/platformanager/couponmanager", TokenCheckMiddleware, (req, res) => {
		const { query } = req;
		app.render(req, res, "/platformanager/couponmanager", {
			...query,
		});
	});

	router.get("/platformanager/pricemanager", TokenCheckMiddleware, (req, res) => {
		const { query } = req;
		app.render(req, res, "/platformanager/pricemanager", {
			...query,
		});
	});

	router.get("/platformanager/collectionsmeta", TokenCheckMiddleware, (req, res) => {
		const { query } = req;
		app.render(req, res, "/platformanager/collectionsmeta", {
			...query,
		});
	});

	router.get("/platformanager/sitemapmanager", TokenCheckMiddleware, (req, res) => {
		const { query } = req;
		app.render(req, res, "/platformanager/sitemapmanager", {
			...query,
		});
	});

	router.get("/platformanager/siteconfig", TokenCheckMiddleware, (req, res) => {
		const { query } = req;
		app.render(req, res, "/platformanager/siteconfig", {
			...query,
		});
	});

	router.get("/platformanager/newsiteconfig", TokenCheckMiddleware, (req, res) => {
		const { query } = req;
		app.render(req, res, "/platformanager/newsiteconfig", {
			...query,
		});
	});

	router.get("/platformanager", TokenCheckMiddleware, (req, res) => {
		const { query } = req;
		app.render(req, res, "/platformanager", {
			...query,
		});
	});

	// *************************************************************************************************************************

	// ***************************************************** ecommerce *********************************************************
	router.get("/ecommerce/ordertracking/orderdetails", TokenCheckMiddleware, (req, res) => {
		const { query, params } = req;
		app.render(req, res, "/ecommerce/ordertracking/orderdetails", {
			...query,
			...params,
		});
	});
	router.get("/ecommerce/ordertracking", TokenCheckMiddleware, (req, res) => {
		const { query } = req;
		app.render(req, res, "/ecommerce/ordertracking", {
			...query,
		});
	});

	router.get("/ecommerce/retailers", TokenCheckMiddleware, (req, res) => {
		const { query } = req;
		app.render(req, res, "/ecommerce/retailers", {
			...query,
		});
	});

	router.get("/ecommerce/retailers/modifyretailer", TokenCheckMiddleware, (req, res) => {
		const { query, params } = req;
		app.render(req, res, "/ecommerce/retailers/modifyretailer", {
			...query,
			...params,
		});
	});

	router.get("/ecommerce/retailers/modifycoupon", TokenCheckMiddleware, (req, res) => {
		const { query, params } = req;
		app.render(req, res, "/ecommerce/retailers/modifycoupon", {
			...query,
			...params,
		});
	});

	router.get("/ecommerce", TokenCheckMiddleware, (req, res) => {
		const { query } = req;
		app.render(req, res, "/ecommerce", {
			...query,
		});
	});
	// *************************************************************************************************************************

	router.get("/stylequiz", TokenCheckMiddleware, (req, res) => {
		const { query } = req;
		app.render(req, res, "/stylequiz", {
			...query,
		});
	});

	router.get("/stylequiz/stylesList", TokenCheckMiddleware, (req, res) => {
		const { query } = req;
		app.render(req, res, "/stylequiz/stylesList", {
			...query,
		});
	});

	router.get("/stylequiz/imageList/:styleId?", TokenCheckMiddleware, (req, res) => {
		const { query, params } = req;
		app.render(req, res, "/stylequiz/imageList", {
			...query,
			...params,
		});
	});

	router.get("/stylequiz/productList/:styleId?", TokenCheckMiddleware, (req, res) => {
		const { query, params } = req;
		app.render(req, res, "/stylequiz/productList", {
			...query,
			...params,
		});
	});

	router.get("/stylequiz/textureList", TokenCheckMiddleware, (req, res) => {
		const { query, params } = req;
		app.render(req, res, "/stylequiz/textureList", {
			...query,
			...params,
		});
	});

	router.get("/stylequiz/paletteList", TokenCheckMiddleware, (req, res) => {
		const { query, params } = req;
		app.render(req, res, "/stylequiz/paletteList", {
			...query,
			...params,
		});
	});

	router.get("/stylequiz/styleDescription", TokenCheckMiddleware, (req, res) => {
		const { query, params } = req;
		app.render(req, res, "/stylequiz/styleDescription", {
			...query,
			...params,
		});
	});

	return router;
}

module.exports = pageRoute;
