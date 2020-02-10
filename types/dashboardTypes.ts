import { Status, Role, ProjectRoles } from "./userType";

export enum ProjectScope {
	customer = Role.Customer,
	designer = Role.Designer,
	admin = Role.Admin,
}

export enum PhaseInternalNames {
	requirement = "requirement",
	designConcept = "designConcept",
	design3D = "design3D",
	modelling = "modelling",
	designRender = "designRender",
	designReady = "designReady",
	designsInRevision = "designsInRevision",
	shop = "shop",
	deliveryCompleted = "deliveryCompleted",
	onHold = "onHold",
	suspended = "suspended",
	rejected = "rejected",
}
export enum PhaseCustomerNames {
	requirement = "requirement",
	brief = "brief",
	designs = "designs",
	revision = "revision",
	final = "final",
	onHold = "onHold",
	cancelled = "cancelled",
	rejected = "rejected",
}

export enum HumanizePhaseInternalNames {
	requirement = "Requirement",
	designConcept = "Design Concept",
	modelling = "Modelling",
	design3D = "Design 3D",
	designRender = "Design Render",
	designReady = "Design Ready",
	designsInRevision = "Design's in Revision",
	shop = "Shop",
	deliveryCompleted = "Delivery Completed",
	onHold = "On Hold",
	suspended = "Suspended",
	rejected = "Rejected",
}

export const completedPhases = [
	PhaseInternalNames.designReady,
	PhaseInternalNames.shop,
	PhaseInternalNames.designReady,
];

interface CurrentPhase {
	name: {
		internalName: PhaseInternalNames;
		customerName: PhaseCustomerNames;
	};
	startTime: string;
}

export interface UserProjectType {
	createdAt: string;
	startedAt: string;
	_id: string;
	projectScope: ProjectScope;
	status: Status;
	name: string;
	customerName: string;
	customer: {
		_id: string;
		email: string;
		profile: {
			name: string;
		};
		id: string;
	};
	currentPhase: CurrentPhase;
	order: {
		paymentStatus: string;
		items: Packages[];
		_id: string;
	};
}

export enum DesignState {
	New = "new",
	Finalized = "finalized",
	Revised = "revised",
	Original = "original",
}

export interface DesignInterface {
	state: DesignState;
	_id?: string;
	design: {
		lock: false;
		phases: PhaseType;
		status: string;
		_id: string;
		name: string;
		description: string;
		designImages: DesignImagesInterface[];
		id: string;
	};
}

export interface Phase {
	name: {
		internalName: PhaseInternalNames;
		customerName: PhaseCustomerNames;
	};
}

export enum DesignImgTypes {
	Render = "render",
	Moodboard = "moodboard",
	Layout2D = "layout2d",
	Cover = "cover",
	Panorama = "panorama",
	Image360 = "image360",
	Floorplan = "floorplan",
}
export interface DesignerImageComments {
	_id?: string;
	author: string;
	text: string;
	status: string;
}
export interface DesignImagesInterface {
	cdn: string;
	_id: string;
	comments: DesignerImageComments[];
	imgType: DesignImgTypes;
	path: string;
}

interface Phone {
	primary: true;
	phone: string;
}

interface Customer {
	profile: {
		firstName: string;
		lastName: string;
		name: string;
	};
	contact: {
		phone: Phone[];
	};
	_id: string;
	email: string;
	id: string;
}

export enum PaymentStatus {
	pending = "pending",
	paid = "paid",
	refunded = "refunded",
	fail = "fail",
}

export enum Packages {
	delight = "delight",
	bliss = "bliss",
	euphoria = "euphoria",
}

export enum PackageDesignValue {
	delight = 1,
	bliss,
	euphoria = 2,
}

export enum PackageTimeline {
	delight = 12,
	bliss = 10,
	euphoria = 7,
}

export const PackageDetails = {
	delight: {
		designs: PackageDesignValue.delight,
		days: PackageTimeline.delight,
	},
	bliss: {
		designs: PackageDesignValue.bliss,
		days: PackageTimeline.bliss,
	},
	euphoria: {
		designs: PackageDesignValue.euphoria,
		days: PackageTimeline.euphoria,
	},
};

interface Order {
	paymentStatus: PaymentStatus;
	items: Packages[];
	_id: string;
	id: string;
}
export interface TeamMember {
	_id: string;
	profile: {
		firstName: string;
		lastName: string;
		name: string;
	};
	role: ProjectRoles;
	email: string;
}

export interface FormType {
	entry: string;
	question: string;
	answer: string;
}

export interface DetailedProjectTeamMember {
	_id: string;
	memberName: string;
	member: TeamMember;
}

export interface DetailedProject {
	projectScope: ProjectScope;
	team: DetailedProjectTeamMember[];
	status: Status;
	onTrial: boolean;
	chat: [];
	_id: string;
	name: string;
	customer: Customer;
	currentPhase: CurrentPhase;
	order: Order;
	form: FormType[];
	completedPhases: Phase[];
	designs: DesignInterface[];
	feedback: [];
	createdAt: string;
	updatedAt: string;
	startedAt: string;
}

interface Retailer {
	_id: string;
	name: string;
}

export interface Assets {
	billable: boolean;
	hidden: boolean;
	asset: {
		name: string;
		price: number;
		retailer: Retailer;
		retailLink: string;
		cdn: string;
		_id: string;
		imageUrl: string;
		createdAt: string;
		updatedAt: string;
		shoppable: boolean;
	};
}

export interface DesignerNotes {
	_id?: string;
	author: {
		profile: {
			name: string;
		};
		id: string;
	};
	text: string;
}

export interface RoomType {
	spatialData: {
		fileUrls: {
			glb?: string;
			source?: string;
			legacy_obj?: string;
		};
	};
	status: Status;
	_id: string;
	coverImage: string;
	coverImageCdn: string;
	name: string;
	scope: "template" | "customer";
	description: string;
	roomType: RoomTypes;
	createdAt: string;
	updatedAt: string;
}

export interface PhaseDetails {
	status: Status;
	startTime: Date;
	endTime: Date;
}

export enum DesignPhases {
	Concept = "concept",
	Modelling = "modelling",
	Design3D = "design3D",
	Render = "render",
	Revision = "revision",
	Ready = "ready",
}

export enum HumanizeDesignPhases {
	concept = "Concept",
	modelling = "Modelling",
	design3D = "Design 3D",
	render = "Render",
	revision = "Render Revision",
	ready = "Ready",
}

export interface PhaseType {
	[DesignPhases.Concept]: PhaseDetails;
	[DesignPhases.Modelling]: PhaseDetails;
	[DesignPhases.Design3D]: PhaseDetails;
	[DesignPhases.Render]: PhaseDetails;
	[DesignPhases.Revision]: PhaseDetails;
	[DesignPhases.Ready]: PhaseDetails;
}

export interface DetailedDesign {
	_id: string;
	name: string;
	description: string;
	assets: Assets[];
	status: Status;
	room: RoomType;
	team?: DetailedProjectTeamMember[];
	phases: PhaseType;
	designImages: DesignImagesInterface[];
	createdAt: string;
	missingAssetUrls: string[];
	updatedAt: string;
	designerNotes: DesignerNotes[];
	id: string;
}

export enum Model3DFiles {
	Obj = "legacy_obj",
	Glb = "glb",
}

export enum ModelToExtensionMap {
	legacy_obj = ".zip",
	glb = ".glb",
}

export enum RoomTypes {
	LivingRoom = "living room",
	Bedroom = "bedroom",
	DiningRoom = "dining room",
	StudyRoom = "study room",
	EntryWay = "entryway",
	KidsRoom = "kids room",
	Studio = "studio",
	Nursery = "nursery",
	HomeOffice = "home office",
	Window = "window",
	Door = "door",
	House = "house",
	OpenLivingDining = "open living and dining room",
}

export enum RoomLabels {
	LivingRoom = "Living room",
	Bedroom = "Bedroom",
	DiningRoom = "Dining room",
	StudyRoom = "Study room",
	EntryWay = "Entryway",
	KidsRoom = "Kids room",
	Studio = "Studio",
	Nursery = "Nursery",
	HomeOffice = "Home office",
	Window = "Window",
	Door = "Door",
	House = "House",
	OpenLivingDining = "Open Living and Dining Room",
}

export enum RenderImgUploadTypes {
	Render = "render",
	Panorama = "panorama",
}
