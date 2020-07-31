import { Status } from "./userType";
export enum MountTypes {
	floor = "floor",
	ceiling = "ceiling",
	wall = "wall",
	curtain = "curtain",
	attached = "attached",
	free = "free",
}

export enum MountTypesLabels {
	floor = "Floor",
	ceiling = "Ceiling",
	wall = "Wall",
	curtain = "Curtain",
	attached = "Attached",
	free = "Free",
}

export enum Currency {
	USD = "usd",
	INR = "inr",
}

export enum AssetHistoryType {
	create = "create",
	update = "update",
	upload3dFile = "upload3dFile",
	uploadImage = "uploadImage",
}

export enum HumanizeAssetHistoryType {
	create = "Create",
	update = "Update",
	upload3dFile = "Upload 3D File",
	uploadImage = "Upload Image",
}

export interface AssetHistory {
	_id: string;
	type: AssetHistoryType;
	userId: string;
	userName: string;
	assetId: string;
	assetName: string;
	meta: string;
	createdAt: string;
	updatedAt: string;
}

export interface EcommRetailer {
	_id: string;
	name: String;
	description: String;

	url: String;

	status: Status;

	shippingPolicy: String;

	cancellationPolicy: String;

	refundPolicy: String;

	returnPolicy: String;

	estimatedArrival: String;

	estimatedDispatch: String;

	logo: String;

	logoCdn: String;

	banners: { fileUrl: String; cdn: String }[];

	excludedDeliveryStates: [{ String }];

	prf: String; // retailer priority

	partner: Boolean;

	exclusive: Boolean;

	tags: { type: String }[];

	rating: Number;

	modeOfOperation: "online" | "offline" | "both";

	brandColor: String;

	returnTimeLimit: number;

	sellType: "buy" | "rent" | "both";

	offers: {
		quote: String;
		discount: Number;
		isPercent: { type: Boolean; default: false };
	}[];

	shippingOfferQuote: String;

	productSpecialization: { type: String }[];
}
