import { getSessionStorageValue, setSessionStorageValue } from "@utils/storageUtils";
import { Dispatch, useState } from "react";

interface useSessionStorage {
	<T>(key: string, defaultValue: T): [T, Dispatch<any>];
}

export const useSessionStorage: useSessionStorage = (key, initialValue) => {
	const [storedValue, setStoredValue] = useState<typeof initialValue>(() => {
		try {
			const item: typeof initialValue = getSessionStorageValue(key);
			return item ? item : initialValue;
		} catch (error) {
			console.log(error);
			return initialValue;
		}
	});
	const setSessionStorage = value => {
		try {
			const valueToStore = value instanceof Function ? value(storedValue) : value;

			setStoredValue(valueToStore);
			setSessionStorageValue(key, value);
		} catch (e) {
			console.log(e);
		}
	};
	return [storedValue, setSessionStorage];
};
