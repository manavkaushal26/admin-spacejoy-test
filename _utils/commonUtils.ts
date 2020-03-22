import { DesignPhases, HumanizeDesignPhases, PhaseType, Packages, PackageDetails } from "@customTypes/dashboardTypes";
import { Status } from "@customTypes/userType";
import moment from "moment";

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
			backgroundColor: "#ff75be",
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

export const getTimeSince = (value): string => {
	const time = moment(value);
	const currentTime = moment();

	const diff = currentTime.diff(time);
	const difference = moment.duration(Math.abs(diff));
	const years = difference.get("y");
	const months = difference.get("M");
	const days = difference.get("d");
	const hours = difference.get("h");
	const minutes = difference.get("m");
	const seconds = difference.get("s");
	if (years !== 0) {
		if (years === 1) {
			return `1 Year`;
		}
		return `${years} Years`;
	}
	if (months !== 0) {
		if (months === 1) {
			return `1 Month`;
		}
		return `${months} Months`;
	}
	if (days !== 0) {
		if (days === 1) {
			return `1 day`;
		}
		return `${days} days`;
	}
	if (hours !== 0) {
		if (hours === 1) {
			return `1 Hour`;
		}
		return `${hours} Hours`;
	}
	if (minutes !== 0) {
		if (minutes === 1) {
			return `1 Minute`;
		}
		return `${minutes} Minutes`;
	}
	if (seconds !== 0) {
		if (seconds === 1) {
			return `1 Seconds`;
		}
		return `${seconds} Seconds`;
	}
	return "N/A";
};
