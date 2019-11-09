/* eslint-disable */

function ValidateEmail(mail) {
	const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return regEx.test(String(mail).toLowerCase());
}

function ValidateMobile(tel) {
	const regEx = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
	return regEx.test(String(tel).toLowerCase());
}

function ValidateText(text) {
	return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/.test(text);
}

export { ValidateEmail, ValidateMobile, ValidateText };
