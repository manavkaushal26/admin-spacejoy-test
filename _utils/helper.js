function removeSpaces(url) {
	return url.split(" ").join("-");
}

module.exports = { removeSpaces };
