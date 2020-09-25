import { getLocalStorageValue, setLocalStorageValue } from "@utils/storageUtils";
import { Dispatch, useState } from "react";

interface useLocalStorage {
	<T>(key: string, defaultValue: T): [T, Dispatch<any>];
}

export const useLocalStorage: useLocalStorage = (key, initialValue) => {
	const [storedValue, setStoredValue] = useState<typeof initialValue>(() => {
		try {
			const item: typeof initialValue = getLocalStorageValue(key);
			return item ? item : initialValue;
		} catch (error) {
			console.log(error);
			return initialValue;
		}
	});
	const setLocalStorage = value => {
		try {
			const valueToStore = value instanceof Function ? value(storedValue) : value;
			setStoredValue(valueToStore);
			setLocalStorageValue(key, valueToStore);
		} catch (e) {
			console.log(e);
		}
	};
	return [storedValue, setLocalStorage];
};
