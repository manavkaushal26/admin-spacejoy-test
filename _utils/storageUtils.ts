interface GetLocalStorageValueProps {
	<T>(name: string): T;
}

export const getLocalStorageValue: GetLocalStorageValueProps = name => {
	if (typeof Storage !== "undefined") {
		return JSON.parse(localStorage.getItem(name));
	}
	return {};
};
interface setLocalStorageValue {
	<T>(name: string, value: T): boolean;
}

export const setLocalStorageValue: setLocalStorageValue = (name, value) => {
	if (typeof Storage !== "undefined") {
		localStorage.setItem(name, JSON.stringify(value));
		return true;
	}
	return false;
};

interface GetSessionStorageValue {
	<T>(name: string): T;
}

export const getSessionStorageValue: GetSessionStorageValue = name => {
	if (typeof Storage !== "undefined") {
		return JSON.parse(sessionStorage.getItem(name));
	}
	return {};
};

interface SetSessionStorageValue {
	<T>(name: string, value: T): boolean;
}

export const setSessionStorageValue: SetSessionStorageValue = (name, value) => {
	if (typeof Storage !== "undefined") {
		sessionStorage.setItem(name, JSON.stringify(value));
		return true;
	}
	return false;
};
