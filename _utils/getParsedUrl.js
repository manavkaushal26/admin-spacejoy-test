const { parse } = require("url");

function getParsedUrl(req) {
  const parsedUrl = parse(req.url, true);
  return parsedUrl;
}

module.exports = getParsedUrl;
