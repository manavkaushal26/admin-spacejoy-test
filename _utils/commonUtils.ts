import { DesignPhases, HumanizeDesignPhases, PhaseType, Packages, PackageDetails } from "@customTypes/dashboardTypes";
import { Status } from "@customTypes/userType";

interface GetValueFunction {
	<T>(func: () => T, defaultValue: T): T;
}

export const getValueSafely: GetValueFunction = (func, defaultValue) => {
	try {
		const value = func();
		if (typeof value === "boolean") {
			return value;
		}
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
	}, HumanizeDesignPhases[DesignPhases.concept]);
};

export const getNumberOfDesigns = (items: Packages[]): number => {
	if (items.includes(Packages.euphoria)) {
		return PackageDetails.euphoria.designs;
	}
	if (items.includes(Packages.bliss)) {
		return PackageDetails.bliss.designs;
	}
	if (items.includes(Packages.delight)) {
		return PackageDetails.delight.designs;
	}
	return 1;
};

export const getNumberOfDays = (items: Packages[]): number => {
	if (items.includes(Packages.euphoria)) {
		return PackageDetails.euphoria.days;
	}
	if (items.includes(Packages.bliss)) {
		return PackageDetails.bliss.days;
	}
	if (items.includes(Packages.delight)) {
		return PackageDetails.delight.days;
	}
	return 1;
};

export const getColorsForPackages = (items: Packages[]): Record<string, string> => {
	if (items.includes(Packages.euphoria)) {
		return {
			backgroundColor: "#da98f6",
		};
	}
	if (items.includes(Packages.bliss)) {
		return {
			backgroundColor: "#ffc53d",
			color: "#314659",
		};
	}
	if (items.includes(Packages.delight)) {
		return {
			backgroundColor: "#cd2d82",
			color: "white",
		};
	}
	return undefined;
};

export const convertToInches = (value: number, fix = 2): number => {
	return parseFloat((value * 12).toFixed(fix));
};

export const convertToFeet = (value: number, fix = 8): number => {
	return parseFloat((value / 12).toFixed(fix));
};
