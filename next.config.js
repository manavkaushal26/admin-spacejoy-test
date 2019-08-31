const withESLint = require("next-eslint");
const withImages = require("next-images");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const withOffline = require("next-offline");

const { ANALYZE } = process.env;
const prod = process.env.NODE_ENV === "production";

const nextConfig = {
	target: "serverless",
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
					// Only cache 50 images.
					expiration: {
						maxEntries: 50
					}
				}
			},
			{
				urlPattern: /^https?.*/,
				handler: "NetworkFirst",
				options: {
					cacheName: "offlineCache",
					expiration: {
						maxEntries: 50
					}
				}
			}
		]
	},
	webpack: config => {
		if (ANALYZE) {
			config.plugins.push(
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
		return config;
	}
};

module.exports = withESLint(withImages(withOffline(nextConfig)));
