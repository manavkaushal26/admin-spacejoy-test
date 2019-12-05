// ToDo : remove when more imports are present
interface GetValueFunction {
	<T>(func: () => T, defaultValue: T): T;
}

// eslint-disable-next-line import/prefer-default-export
export const getValueSafely: GetValueFunction = (func, defaultValue) => {
	try {
		const value = func();
		return value || defaultValue;
	} catch (e) {
		return defaultValue;
	}
};

export const debounce = (func, wait) => {
	let timeout;
	return function(...args) {
		clearTimeout(timeout);
		timeout = setTimeout(() => func.apply(this, args), wait);
	};
};
