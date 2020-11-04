import { TeamMember } from "@customTypes/dashboardTypes";
import { AssetType } from "./moodboardTypes";
import User, { Status } from "./userType";

export const EcommerceOrderStatus = {
	Pending: "pending",
	Confirmed: "confirmed",
	Complete: "completed",
	Cancelled: "cancelled",
};

export const EcommerceOrderStatusReverseMap = {
	pending: "Pending",
	confirmed: "Confirmed",
	complete: "Complete",
};

export enum EcommerceStatus {
	Initiated = "initiated",
	Approved = "approved",
	Declined = "declined",
}
export enum EcommerceStatusReverseMap {
	initiated = "Initiated",
	approved = "Approved",
	declined = "Declined",
}

export const EcommerceStatusPosition = {
	Initiated: 0,
	Approved: 1,
	Declined: 2,
};
export enum EcommerceStatusEnum {
	Initiated = 0,
	Approved = 1,
	Declined = 2,
}
export interface Tracking {
	orderItem: string;
	_id: string;
	trackingNumber: string;
	createdAt: string;
	trackingUrl: string;

	vendor: string;
}

export interface Comments {
	_id: string;
	text: string;
	resourceType: "Order" | "OrderItem";
	resourceId: string;
	user: TeamMember;
	createdAt: string;
	updatedAt: string;
}

export enum OrderItemStatus {
	pending = "Pending",
	confirmed = "Confirmed",
	shipped = "Shipped",
	delivered = "Delivered",
	returnInitiated = "Return Initiated",
	returnApproved = "Return Approved",
	returnDeclined = "Return Declined",
	cancellationInitiated = "Cancellation Initiated",
	cancellationApproved = "Cancellation Approved",
	cancellationDeclined = "Cancellation Declined",
}

export enum OrderItemStatuses {
	pending = "pending",
	confirmed = "confirmed",
	shipped = "shipped",
	delivered = "delivered",
	returnInitiated = "returnInitiated",
	returnApproved = "returnApproved",
	returnDeclined = "returnDeclined",
	cancellationInitiated = "cancellationInitiated",
	cancellationApproved = "cancellationApproved",
	cancellationDeclined = "cancellationDeclined",
	initiated = "initiated",
	approved = "approved",
	declined = "declined",
}

export interface ReasonModel {
	_id: string;
	type: string;
	label: string;
}

export interface ReturnCancelledInterface {
	_id: string;
	reason: string;
	comment: string;
	status: EcommerceStatus;
	declineComment: string;
}
export interface DesignProjectInfo {
	designId: string;
	projectId: string;
	projectName: string;
	deisgnName: string;
}
export interface OrderItemComments {
	_id: string;
	orderItem: string;
	quote: string;
	description: string;
	createdAt: string;
	updatedAt: string;
	orderItemStatus: OrderItemStatuses;
}

export interface OrderPayments {
	provider: string;
	paymentId: string;
	chargeId: string;
	refundId: string;
	receipt: string;
	capture: boolean;
	_id: string;
	order: string;
	status: "succeeded" | "requires_capture";
	meta: {
		charge: {
			id: string;
			object: string;
			amount: number;
			amount_refunded: number;
			application: null;
			application_fee: null;
			application_fee_amount: null;
			balance_transaction: null;
			calculated_statement_descriptor: "SPACEJOY";
			captured: boolean;
			created: number;
			currency: "usd";
			customer: string;
			description: string;
			paid: true;
			payment_intent: null;
			payment_method: "card_1H9bIUJH6mCGeVzyiCwo25dS";
			receipt_email: string;
			receipt_number: number;
			receipt_url: string;
			refunded: boolean;
			status: "succeeded" | "requires_capture";
		};
	};
	amount: number;
	createdAt: string;
	updatedAt: string;
}

export interface OrderItems {
	_id: string;
	status: OrderItemStatuses;
	shippingCharge: number;
	orderItemId: string;
	order: string;
	product: AssetType;
	quantity: number;
	price: number;
	createdAt: string;
	updatedAt: string;
	comments: OrderItemComments[];
	tracking: Tracking[];
	return: ReturnCancelledInterface;
	cancellation: ReturnCancelledInterface;
	designProjectInfo: DesignProjectInfo;
}

export interface EcommOrder {
	_id: string;
	status: Status;
	payment: string;
	user: Partial<User>;
	orderId: string;
	address: string;
	firstName: string;
	lastName: string;
	phoneNumber: string;
	originalOrder: EcommOrder;
	shippingCharge: number;
	tax: number;
	amount: number;
	discount: number;
	createdAt: string;
	updatedAt: string;
	orderItems: OrderItems[];
}
