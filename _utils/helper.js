function removeSpaces(url) {
	return url ? url.split(" ").join("-") : null;
}

module.exports = { removeSpaces };
