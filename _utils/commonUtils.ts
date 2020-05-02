import { DesignPhases, HumanizeDesignPhases, PackageDetails, Packages, PhaseType } from "@customTypes/dashboardTypes";
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

export const debounce = (func, wait): Function => {
	let timeout;
	return function(...args) {
		clearTimeout(timeout);
		timeout = setTimeout(() => func.apply(this, args), wait);
	};
};

export function getBase64(file): Promise<string | ArrayBuffer> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = (): void => resolve(reader.result);
		reader.onerror = (error): void => reject(error);
	});
}

export const getHumanizedActivePhase = (phases: PhaseType): HumanizeDesignPhases => {
	return Object.keys(phases).reduce((acc, curr) => {
		if (phases[curr].status === Status.active) return HumanizeDesignPhases[curr];
		return acc;
	}, HumanizeDesignPhases[DesignPhases.concept]);
};

export const getNumberOfDesigns = (items: Packages[]): number => {
	const packageNames = getValueSafely(() => items.map(item => item.name), []);
	if (packageNames.includes(PackageDetails.euphoria.name)) {
		return PackageDetails.euphoria.designs;
	}
	if (packageNames.includes(PackageDetails.bliss.name)) {
		return PackageDetails.bliss.designs;
	}
	if (packageNames.includes(PackageDetails.delight.name)) {
		return PackageDetails.delight.designs;
	}
	return 1;
};

export const getNumberOfDays = (items: Packages[]): number => {
	const packageNames = getValueSafely(() => items.map(item => item.name), []);

	if (packageNames.includes(PackageDetails.euphoria.name)) {
		return PackageDetails.euphoria.days;
	}
	if (packageNames.includes(PackageDetails.bliss.name)) {
		return PackageDetails.bliss.days;
	}
	if (packageNames.includes(PackageDetails.delight.name)) {
		return PackageDetails.delight.days;
	}
	return 1;
};

export const getColorsForPackages = (items: Packages[]): Record<string, string> => {
	const packageNames = getValueSafely(() => items.map(item => item.name), []);

	if (packageNames.includes(PackageDetails.euphoria.name)) {
		return {
			backgroundColor: "#da98f6",
		};
	}
	if (packageNames.includes(PackageDetails.bliss.name)) {
		return {
			backgroundColor: "#ffc53d",
			color: "#314659",
		};
	}
	if (packageNames.includes(PackageDetails.delight.name)) {
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

// /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi

export const urlRegex = /(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+/gi;

export const matchUrl = (url: string): boolean => {
	const urlRegexObj = new RegExp(urlRegex);
	return urlRegexObj.test(url);
};

export const stringToUrl = (text: string): string => {
	const matchedText = text.match(urlRegex);
	if (matchedText === null) {
		return text;
	}
	return matchedText.reduce((acc, matchedUrl) => {
		return acc.replace(
			matchedUrl,
			`<a href=${matchedUrl} target="_blank" rel="noopener noreferrer">${matchedUrl}</a><br>`
		);
	}, `${text}`);
};

export const convertDaysToMilliseconds = (days: string | number): number => {
	if (!days) return 0;
	if (typeof days === "string") {
		return parseFloat(days) * 24 * 60 * 60 * 1000;
	}
	return days * 24 * 60 * 60 * 1000;
};

export const convertMillisecondsToDays = (milliseconds: string | number): number => {
	if (!milliseconds) return 0;
	if (typeof milliseconds === "string") {
		return parseFloat(milliseconds) / (24 * 60 * 60 * 1000);
	}
	return milliseconds / (24 * 60 * 60 * 1000);
};
