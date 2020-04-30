import { RoomTypes } from "./dashboardTypes";
import { Status } from "./userType";

export interface CollectionBase {
	bg: string;
	_id: string;
	name: string;
	metaTitle: string;
	metaDescription: string;
	slug: string;
	cdnThumbnail: string;
	cdnCover: string;
}

export interface DetailedCollection extends CollectionBase {
	description: string;
	searchKey: {
		retailers: string[];
		tags: string[];
		roomType: RoomTypes[];
		themes: string[];
	};
	designList: Array<any>[];
	status: Status;
}
