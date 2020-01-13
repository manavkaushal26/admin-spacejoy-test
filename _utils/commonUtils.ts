import { DesignPhases, HumanizeDesignPhases, PhaseType } from "@customTypes/dashboardTypes";
import { Status } from "@customTypes/userType";

interface GetValueFunction {
	<T>(func: () => T, defaultValue: T): T;
}

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

export function getBase64(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = error => reject(error);
	});
}

export const getHumanizedActivePhase = (phases: PhaseType) => {
	return Object.keys(phases).reduce((acc, curr) => {
		if (phases[curr].status === Status.active) return HumanizeDesignPhases[curr];
		return acc;
	}, HumanizeDesignPhases[DesignPhases.Concept]);
};
