import { Status, Role } from "./userType";

export enum ProjectScope {
	customer = "customer",
	designer = "designer"
}

export enum PhaseInternalNames {
	requirement = "requirement",
	designConcept = "designConcept",
	design3D = "design3D",
	designRender = "designRender",
	designReady = "designReady",
	designsInRevision = "designsInRevision",
	shop = "shop",
	deliveryCompleted = "deliveryCompleted",
	onHold = "onHold",
	suspended = "suspended",
	rejected = "rejected"
}

enum PhaseCustomerNames {
	requirement = "requirement",
	brief = "brief",
	designs = "designs",
	revision = "revision",
	final = "final",
	onHold = "onHold",
	cancelled = "cancelled",
	rejected = "rejected"
}

interface CurrentPhase {
	name: {
		internalName: PhaseInternalNames;
		customerName: PhaseCustomerNames;
	};
}

export interface UserProjectType {
	createdAt: string;
	_id: string;
	projectScope: ProjectScope;
	status: Status;
	name: string;
	customer: {
		_id: string;
		email: string;
		profile: {
			name: string;
		};
		id: string;
	};
	currentPhase: CurrentPhase;
	order: string;
	id: string;
}

interface DesignInterface {
	state: string;
	_id: string;
	design: {
		lock: false;
		status: string;
		_id: string;
		name: string;
		description: string;
		designImages: DesignImagesInterface[];
		id: string;
	};
}

interface Phase {
	name: {
		internalName: string;
		customerName: string;
	};
	startTime: string;
	endTime: null;
	owner: null;
	_id: string;
}

interface DesignImagesInterface {
	cdn: string;
	_id: string;
	imgType: string;
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

enum PaymentStatus {
	pending = "pending",
	paid = "paid",
	refunded = "refunded",
	fail = "fail"
}

enum Packages {
	delight = "delight",
	bliss = "bliss",
	euphoria = "euphoria"
}

interface Order {
	paymentStatus: PaymentStatus;
	items: Packages[];
	_id: string;
	id: string;
}
export interface TeamMember {
	profile: {
		dob: string | null;
		gender: string;
		firstName: string;
		lastName: string;
		name: string;
	};
	role: Role;
	_id: string;
	email: string;
	id: string;
}

export interface FormType {
	entry: string;
	question: string;
	answer: string;
}

export interface DetailedProject {
	projectScope: ProjectScope;
	team: TeamMember[];
	status: Status;
	onTrial: boolean;
	chat: [];
	_id: string;
	name: string;
	customer: Customer;
	currentPhase: Phase;
	order: Order;
	form: FormType[];
	completedPhases: Phase[];
	designs: DesignInterface[];
	feedback: [];
	createdAt: string;
	updatedAt: string;
	id: string;
}

interface Retailer {
	_id: string;
	name: string;
}

export interface Assets {
	billable: boolean;
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
	};
}

export interface DesignerNotes {
	_id?: string;
	author: string;
	text: string;
}

export interface DetailedDesign {
	_id: string;
	name: string;
	description: string;
	assets: Assets[];
	room: string;
	designImages: DesignImagesInterface[];
	createdAt: string;
	updatedAt: string;
	designerNotes: DesignerNotes[];
	id: string;
}
