const express = require("express");
const cluster = require("cluster");
const helmet = require("helmet");
const next = require("next");
const path = require("path");
const os = require("os");
const compression = require("compression");
const LRUCache = require("lru-cache");
const bodyParser = require("body-parser");
const getParsedUrl = require("./_utils/getParsedUrl");
const customRouters = require("./_routes");

const port = parseInt(process.env.PORT, 10) || 3001;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const workers = [];

const getMaxAge = () => {
	return 31536000;
};

const serve = (pathName, cache) =>
	express.static(pathName, {
		maxAge: cache && !dev ? getMaxAge() : 0,
	});

function getCacheKey(req) {
	return `${req.url}`;
}

const ssrCache = new LRUCache({
	max: 100,
	maxAge: 1000 * 60 * 60,
});

async function renderAndCache(req, res, pagePath, queryParams) {
	const key = getCacheKey(req);
	if (ssrCache.has(key)) {
		res.setHeader("x-cache", "HIT");
		res.send(ssrCache.get(key));
		return;
	}
	try {
		const html = await app.renderToHTML(req, res, pagePath, queryParams);
		if (res.statusCode !== 200) {
			res.send(html);
			return;
		}
		ssrCache.set(key, html);
		res.setHeader("x-cache", "MISS");
		res.send(html);
	} catch (err) {
		app.renderError(err, req, res, pagePath, queryParams);
	}
}

app.prepare().then(() => {
	const server = express();
	if (cluster.isMaster && !dev) {
		const cpuCount = os.cpus().length;
		for (let i = 0; i < cpuCount; i += 1) {
			workers.push(cluster.fork());
			workers[i].on("message", message => {
				console.log(message);
			});
		}
		cluster.on("listening", worker => {
			console.log(`Worker ${worker.process.pid} is listening`);
		});
		cluster.on("exit", (worker, code, signal) => {
			console.log(`Worker ${worker.process.pid} died with code: ${code}, and signal: ${signal}`);
			console.log("Starting a new worker");
			workers.push(cluster.fork());
			workers[workers.length - 1].on("message", function (message) {
				console.log(message);
			});
			workers[workers.length - 1].on("listening", function (message) {
				console.log(`Worker ${workers[workers.length - 1].process.pid} is listening`);
			});
		});
	} else {
		server.use(helmet({}));
		server.use(compression({ threshold: 0 }));
		server.use(bodyParser.json());
		server.use(express.static("public"));
		server.use(customRouters.authRoutes(app));
		server.use(customRouters.definedRoutes(app));
		server.get("/ping", (req, res) => {
			res.send("pong");
		});
		server.use("/service-worker.js", serve(path.join(__dirname, ".next", "/service-worker.js"), true));
		server.use("/manifest.json", serve(path.join(__dirname, "public", "static", "/manifest.json"), true));
		server.use("/robots.txt", serve(path.join(__dirname, "public", "static", "/robots.txt"), true));
		server.use("/sitemap.xml", serve(path.join(__dirname, "public", "static", "/sitemap.xml"), true));
		server.use("/favicon.ico", serve(path.join(__dirname, "public", "static", "logo-icons", "/favicon.ico"), true));
		server.get("*", (req, res) => {
			const parsedUrl = getParsedUrl(req);
			if (!dev) res.setHeader("Cache-Control", `public, max-age=${getMaxAge()}, immutable`);
			return handle(req, res, parsedUrl);
		});
		server.listen(port, err => {
			if (err) throw err;
			console.log(`> Ready on http://localhost:${port}`);
		});
	}
});

function shutdown() {
	process.exit(0);
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
