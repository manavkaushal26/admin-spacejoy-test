import { UserData, ImageInterface } from "./dashboardTypes";
import { Status } from "./userType";

export interface Category {
	status: string;
	_id: string;
	title: string;
	description: string;
	createdAt: string;
	updatedAt: string;
}

export enum BlogTypes {
	SHORT = "short",
	FULL = "full",
}

export interface Blog {
	_id?: string;
	title: string;
	description: string;
	excerpt: string;
	slug: string;
	blogType: BlogTypes;
	coverImg: string;
	coverImgCdn: string;
	socialImgCdn: string;
	image360Cdn: string;
	category?: Partial<Category>;
	tags?: string[];
	backlinks?: string[];
	publishDate: string;
	status: Status;
	images: ImageInterface[];
	author: UserData;
	body: string;
	createdAt?: string;
	updatedAt?: string;
}

export enum BlogImageUploadTypes {
	Photo = "render",
	Panorama = "panorama",
}
