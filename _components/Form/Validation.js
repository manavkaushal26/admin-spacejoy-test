function ValidateEmail(mail) {
	return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/.test(mail);
}

function ValidateText(text) {
	return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/.test(text);
}

export { ValidateEmail, ValidateText };
