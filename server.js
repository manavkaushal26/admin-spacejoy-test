const express = require("express");
const cluster = require("cluster");
const helmet = require("helmet");
const next = require("next");
const { parse } = require("url");
const path = require("path");
const compression = require("compression");
const LRUCache = require("lru-cache");
const bodyParser = require("body-parser");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const workers = [];

const serve = (path, cache) =>
  express.static(path, {
    maxAge: cache && dev ? getMaxAge() : 0
  });

const ssrCache = new LRUCache({
  max: 100,
  maxAge: 1000 * 60 * 60
});

const getMaxAge = function() {
  const futureDate = new Date();
  futureDate.setFullYear(futureDate.getFullYear() + 1);
  return futureDate - new Date();
};

function getCacheKey(req) {
  return `${req.url}`;
}

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
    const cpuCount = require("os").cpus().length;
    for (let i = 0; i < cpuCount; i += 1) {
      workers.push(cluster.fork());
      workers[i].on("message", function(message) {
        console.log(message);
      });
    }
    cluster.on("online", function(worker) {
      console.log("Worker " + worker.process.pid + " is listening");
    });
    cluster.on("exit", function(worker, code, signal) {
      console.log("Worker " + worker.process.pid + " died with code: " + code + ", and signal: " + signal);
      console.log("Starting a new worker");
      workers.push(cluster.fork());
      workers[workers.length - 1].on("message", function(message) {
        console.log(message);
      });
    });
  } else {
    // server.use(helmet({ hsts: false }));
    server.use(compression({ threshold: 0 }));
    server.use(bodyParser.json());
    server.get("/demo", (req, res) => {
      app.render(req, res, "/demo", req.params);
    });
    server.get("/post/:slug", (req, res) => {
      app.render(req, res, "/post", { slug: req.params.slug });
    });
    server.get(["/", "/index"], (req, res) => {
      const params = req.params;
      app.render(req, res, "/index", params);
    });
    server.get("/ping", (req, res) => {
      res.send("pong");
    });
    server.use("/service-worker.js", serve(path.join(__dirname, ".next", "/service-worker.js"), true));
    server.use("/manifest.json", serve(path.join(__dirname, "/static/manifest.json"), true));
    server.use("/robots.txt", serve(path.join(__dirname, "/static/robots.txt"), true));
    server.use("/favicon.ico", serve(path.join(__dirname, "/static/favicon.ico"), true));
    server.get("*", (req, res) => {
      if (!dev) res.setHeader("Cache-Control", `public, max-age=${getMaxAge()}, immutable`);
      return handle(req, res);
    });
    server.listen(port, err => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${port}`);
    });
  }
});
