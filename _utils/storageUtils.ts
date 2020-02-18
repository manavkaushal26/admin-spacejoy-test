interface GetLocalStorageValueProps {
	<T>(name: string): T;
}

export const getLocalStorageValue: GetLocalStorageValueProps = name => {
	if (typeof Storage !== "undefined") {
		return JSON.parse(localStorage.getItem(name));
	}
	return {};
};

export const setLocalStorageValue = (name: string, value: Record<string, any>) => {
	if (typeof Storage !== "undefined") {
		localStorage.setItem(name, JSON.stringify(value));
		return true;
	}
	return false;
};
