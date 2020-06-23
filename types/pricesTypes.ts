import { RevisionMeta } from "./dashboardTypes";
import { Status } from "./userType";

export interface PriceEntry {
	label: string;
	value: number;
	inPercent?: number;
	inAmount?: number;
}

export interface PriceData {
	price: PriceEntry;
	salePrice: PriceEntry;
	savings: PriceEntry;
	isSaleActive: boolean;
	versionNumber: number;
	_id: string;
	slug: string;
	id: string;
}

export interface Feature {
	_id?: string;
	label: string;
	helpText?: string;
}

export interface DetailedPriceData extends PriceData {
	mrp: PriceEntry;
	price: PriceEntry;
	salePrice: PriceEntry;
	savings: PriceEntry;
	revisionMeta: RevisionMeta;
	tags: string[];
	isSaleActive: boolean;
	status: Status.active | Status.inactive;
	designs: number;
	versionNumber: 0;
	_id: string;
	name: string;
	turnAroundTime: 15;
	includedFeatures: Feature[];
	excludedFeatures: Feature[];
	createdAt: string;
	updatedAt: string;
	slug: string;
	description: string;
	id: string;
}
