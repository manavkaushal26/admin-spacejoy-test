const withESLint = require("next-eslint");
const withImages = require("next-images");
const withOffline = require("next-offline");
const path = require("path");
const fs = require("fs");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const withLess = require("@zeit/next-less");
const lessToJS = require("less-vars-to-js");

const { ANALYZE } = process.env;
const prod = process.env.NODE_ENV === "production";

const themeVariables = lessToJS(
	fs.readFileSync(path.resolve(__dirname, "./public/static/styles/antd-custom.less"), "utf8")
);

// fix: prevents error when .less files are required by node
if (typeof require !== "undefined") {
	require.extensions[".less"] = () => {};
}

const nextConfig = {
	poweredByHeader: false,
	useFileSystemPublicRoutes: false,
	assetPrefix: prod ? "" : "",
	crossOrigin: "anonymous",
	workboxOpts: {
		exclude: [/\.(?:png|jpg|jpeg|svg)$/],
		// Define runtime caching rules.
		runtimeCaching: [
			{
				// Match any request that ends with .png, .jpg, .jpeg or .svg.
				urlPattern: /\.(?:png|jpg|jpeg|svg|ico)$/,
				// Apply a cache-first strategy.
				handler: "CacheFirst",
				options: {
					// Use a custom cache name.
					cacheName: "images",
					// Only cache 10 images.
					expiration: {
						maxEntries: 10,
						maxAgeSeconds: 5 * 24 * 60 * 60 // 5 Days
					}
				}
			},
			{
				urlPattern: /^https?.*/,
				handler: "NetworkFirst",
				options: {
					cacheName: "offlineCache",
					expiration: {
						maxEntries: 5
					}
				}
			},
			{
				urlPattern: /^https:\/\/fonts\.googleapis\.com/,
				handler: "StaleWhileRevalidate",
				options: {
					cacheName: "google-fonts-stylesheets"
				}
			}
		]
	},
	lessLoaderOptions: {
		javascriptEnabled: true,
		modifyVars: themeVariables // make your antd custom effective
	},
	webpack: (config, { isServer }) => {
		const modifiedConfig = { ...config };
		if (isServer) {
			const antStyles = /antd\/.*?\/style.*?/;
			const origExternals = [...config.externals];
			modifiedConfig.externals = [
				(context, request, callback) => {
					if (request.match(antStyles)) return callback();
					if (typeof origExternals[0] === "function") {
						origExternals[0](context, request, callback);
					} else {
						callback();
					}
				},
				...(typeof origExternals[0] === "function" ? [] : origExternals)
			];

			modifiedConfig.module.rules.unshift({
				test: antStyles,
				use: "null-loader"
			});
		}
		if (ANALYZE) {
			modifiedConfig.plugins.push(
				new BundleAnalyzerPlugin({
					analyzerMode: "server",
					analyzerPort: "auto",
					openAnalyzer: true,
					reportFilename: "Bundle-size",
					generateStatsFile: true,
					statsFilename: "Bundle-size-stats"
				})
			);
		}
		return modifiedConfig;
	}
};

module.exports = withOffline(withESLint(withImages(withLess(nextConfig))));
