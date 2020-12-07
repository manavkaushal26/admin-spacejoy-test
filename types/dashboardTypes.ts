import { ProjectRoles, Role, Status } from "./userType";

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

export interface ThemeInterface {
	_id: string;
	name: string;
	description: string;
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
	designConcept = "Concept",
	modelling = "Modelling",
	design3D = "Design 3D",
	designRender = "Render",
	designReady = "Ready",
	designsInRevision = "Revision",
	shop = "Shop",
	deliveryCompleted = "Completed",
	onHold = "On Hold",
	suspended = "Suspended",
	rejected = "Rejected",
}

export enum HumanizeNewProjectPhaseInternalNames {
	requirement = "Requirement",
	designConcept = "Concept",
	modelling = "Modelling",
	design3D = "Design 3D",
	designRender = "Render",
	designReady = "Ready",
	shop = "Shop",
	deliveryCompleted = "Completed",
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

export enum QuizState {
	open = "open",
	closed = "closed",
	inProgress = "inProgress",
	underReview = "underReview",
}

export const QuizStateArray: QuizState[] = [
	QuizState.open,
	QuizState.closed,
	QuizState.inProgress,
	QuizState.underReview,
];

export enum QuizStateLabels {
	open = "Not Started",
	closed = "Completed",
	inProgress = "In Progress",
	underReview = "Under Review",
}

export interface UserProjectType {
	createdAt: string;
	endedAt: string;
	startedAt: string;
	_id: string;
	projectScope: ProjectScope;
	status: Status;
	name: string;
	customerName: string;
	quizStatus: {
		currentState: QuizState;
	};
	delay: {
		isDelayed: boolean;
		minDurationInMs: number;
		maxDurationInMs: number;
		title: string;
		message: string;
	};
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
	design: Partial<DetailedDesign>;
	operationState?: string;
	parent?: string;
}

export interface Phase {
	name: {
		internalName: PhaseInternalNames;
		customerName: PhaseCustomerNames;
	};
	endTime: string;
	startTime: string;
	_id: string;
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

export interface ImageInterface {
	_id?: string;
	cdn: string;
	img?: string;
	imgType: DesignImgTypes;
}
export interface DesignImagesInterface extends ImageInterface {
	_id: string;
	comments?: DesignerImageComments[];
	path?: string;
}

interface Phone {
	primary: true;
	phone: string;
}

export interface UserData {
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

export interface Packages {
	_id: string;
	name: string;
	turnAroundTime: number;
	id: string;
}

export enum PackageDesignValue {
	delight = 1,
	bliss,
	euphoria = 2,
}

export enum PackageTimeline {
	delight = 12,
	bliss = 9,
	euphoria = 7,
}

export const PackageDetails = {
	delight: {
		name: "delight",
		designs: PackageDesignValue.delight,
		days: PackageTimeline.delight,
	},
	bliss: {
		name: "bliss",
		designs: PackageDesignValue.bliss,
		days: PackageTimeline.bliss,
	},
	euphoria: {
		name: "euphoria",
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
	status: Status;
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

export interface ProjectFeedback {
	scope: string;
	_id: string;
	image: string;
	author: string;
	comment: string;
	reference: string;
	createdAt: string;
	updatedAt: string;
}

export interface DetailedProject {
	projectScope?: ProjectScope;
	team: DetailedProjectTeamMember[];
	revisionTeam: DetailedProjectTeamMember[];
	status: Status;
	onTrial: boolean;
	chat: [];
	_id: string;
	name: string;
	customer: UserData;
	currentPhase: Phase;
	order: Order;
	form: FormType[];
	completedPhases: Phase[];
	designs: DesignInterface[];
	currentRevisionDesign: string;
	feedback: ProjectFeedback[];
	createdAt: string;
	endedAt: string;
	updatedAt: string;
	startedAt: string;
	isDelivered: boolean;
	delay: {
		isDelayed: boolean;
		minDurationInMs: number;
		maxDurationInMs: number;
		title: string;
		message: string;
	};
}

interface Retailer {
	_id: string;
	name: string;
}

export interface Assets {
	billable: boolean;
	hidden: boolean;
	_id: string;
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

export interface ConceptPhaseDetails extends PhaseDetails {
	floorplanCreation: Status;
	moodboardCreation: Status;
}

export interface ModellingPhaseDetails extends PhaseDetails {
	assetModelling: Status;
	roomModelling: Status;
}
export interface PhaseDetails {
	status: Status;
	startTime: Date;
	endTime: Date;
}

export enum DesignPhases {
	concept = "concept",
	modelling = "modelling",
	design3D = "design3D",
	render = "render",
	revision = "revision",
	ready = "ready",
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
	[DesignPhases.concept]: ConceptPhaseDetails;
	[DesignPhases.modelling]: ModellingPhaseDetails;
	[DesignPhases.design3D]: PhaseDetails;
	[DesignPhases.render]: PhaseDetails;
	[DesignPhases.revision]: PhaseDetails;
	[DesignPhases.ready]: PhaseDetails;
}

export interface DetailedDesign {
	_id: string;
	name: string;
	description: string;
	searchKey?: {
		retailers: string[];
		roomType: RoomTypes;
	};
	owner: {
		_id: string;
		email: string;
		profile: {
			name: string;
		};
		role: Role;
	};
	slug: string;
	assets: Assets[];
	status: Status;
	room: RoomType;
	theme: string;
	tags: string[];
	publishedDate: string;
	attributeList: { text: string }[];
	longDescription: string;
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
	FamilyRoom = "family room",
	Playroom = "playroom",
	Tablescape = "tablescape",
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
	Tablescape = "Tablescape",
	OpenLivingDining = "Open Living and Dining Room",
}

export const RoomNameSearch = [
	"Living Room",
	"Entryway",
	"Kid's Bedroom",
	"Studio",
	"Nursery",
	"Dining Room",
	"Home Office",
	"Study Room",
	"Bedroom",
	"Tablescape",
];

export enum RenderImgUploadTypes {
	Render = "render",
	Panorama = "panorama",
}

export interface QuizResponseFileType {
	_id: string;
	gcs: string;
	cdn: string;
}

export interface QuizUserResponse {
	value: number | "NaN";
	text: string;
	files: QuizResponseFileType[];
	select: boolean;
}

export interface QuizQuestionsOptions {
	secondaryImages: {
		imageList: string[];
	};
	_id: string;
	label: string;
	image: string;
	imageCdn: string;
	userResponse?: QuizUserResponse;
}

export enum QuizAnswerFieldType {
	Select = "select",
	Text = "text",
	Value = "value",
	Stepper = "stepper",
	Image = "image",
	Range = "range",
	File = "file",
}

export interface QuizContext {
	hasOptions: boolean;
	hasOtherAnswer: boolean;
	multiple: boolean;
	fieldType: QuizAnswerFieldType;
}

export interface QuizAnswers {
	context: QuizContext;
	validation: {
		required: boolean;
		maxCount: number;
		minCount: number;
	};
	options: QuizQuestionsOptions[];
	userResponse: QuizUserResponse;
}

export enum QuizStatus {
	Accepted = "accepted",
	Rejected = "rejected",
	Pending = "pending",
}

export interface QuizQuestions {
	answer: QuizAnswers;
	status: Status;
	responseStatus: QuizStatus;
	designerComment: string;
	instructions: string[];
	mandatory: boolean;
	_id: string;
	section: string;
	title: string;
	description: string;
	sequence: number;
	createdAt: string;
	updatedAt: string;
}

export interface QuizSectionInterface {
	instructions: string[];
	sequence: number;
	quiz: QuizQuestions[];
	_id: string;
	title: string;
	description: string;
	timeToCover: string;
	slug: string;
	createdAt: string;
	updatedAt: string;
}

export interface QuizDiscussion {
	images: string[];
	comments: string;
	type: string;
	_id: string;
	projectId: string;
	user: TeamMember;
	createdAt: string;
	updatedAt: string;
}

export interface RevisionRequestedProducts {
	url: string;
	comment: string;
	status: Status;
	submittedOn: string;
	_id: string;
}

export enum DIYStatus {
	"pending",
	"accepted",
	"started",
	"revertedToDAR",
	"underReview",
}

export enum DisplayDIYStatus {
	"pending" = "Pending",
	"accepted" = "Accepted",
	"started" = "Started",
	"revertedToDAR" = "Reverted",
	"underReview" = "Under Review",
}

export enum HumanizeDIYStatus {
	"pending" = "Revision Initiated",
	"accepted" = "Designer Finalized",
	"started" = "Revision Started",
	"revertedToDAR" = "Changed To DAR",
	"underReview" = "Designer review",
}

export enum DARStatus {
	"pending",
	"accepted",
	"submitted",
	"completed",
}

export enum DisplayDARStatus {
	"pending" = "Pending",
	"accepted" = "Accepted",
	"submitted" = "Submitted",
	"completed" = "Completed",
}

export enum HumanizeDARStatus {
	"pending" = "Request initiated by customer",
	"accepted" = "Accepted by Customer",
	"submitted" = "Request has been submitted by customer",
	"completed" = "Revision Complete",
}

export interface RevisionComments {
	submittedOn: string;
	_id: string;
	text: string;
	author: string;
	authorName: string;
}

export interface FullDesignList extends Record<string, string> {
	name: string;
	thumbnailCdn: string;
	_id: string;
}

export interface PreviousRevision {
	retainedAssets: string[];
	_id: string;
	revisionType: string;
	status: string;
	revisionVersion: string;
	revisedDesign: string;
	revisionId: null;
	archivedOn: string;
}

export enum Mode {
	Finalize = "finalize",
	Takeover = "takeover",
	Undo = "undo",
	Direct = "direct",
}

export enum HumanizeMode {
	"finalize" = "Review Changes and Finalize",
	"takeover" = "Take over from here",
	"undo" = "Undo changes and Takeover",
	"direct" = "Customer making Revisions",
}
export interface RevisionMeta {
	maxRevisionsAllowed: number;
	minRevisionTat: number;
	maxRevisionTat: number;
	maxProductRequestsAllowed: number;
}
export interface RevisionForm {
	revisedDesign: {
		name: string;
		thumbnailCdn: string;
		_id: string;
	};
	diy: {
		isActive: boolean;
		status: DIYStatus;
	};
	dar: {
		isActive: boolean;
		status: DARStatus;
	};
	mode: Mode;
	requestedProducts: RevisionRequestedProducts[];
	revisionVersion: number;
	isLocked: boolean;
	_id: string;
	comments: RevisionComments[];
	retainedAssets: string[];
	project: string;
	previousRevisions: PreviousRevision[];
	createdAt: string;
	updatedAt: string;
	meta: RevisionMeta;
	fullDesignList: FullDesignList[];
}
