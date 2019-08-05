const withOffline = require("next-offline");

module.exports = withOffline({
  poweredByHeader: false,
  useFileSystemPublicRoutes: false,
  workboxOpts: {
    runtimeCaching: [
      {
        urlPattern: /api/,
        handler: "NetworkFirst",
        options: {
          cacheableResponse: {
            statuses: [0, 200],
            headers: {
              "x-test": "true"
            }
          }
        }
      }
    ]
  }
});
