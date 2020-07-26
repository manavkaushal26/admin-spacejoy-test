import { AssetType } from "./moodboardTypes";
import { Status } from "./userType";

export const EcommerceOrderStatus = {
	Pending: "pending",
	Confirmed: "confirmed",
	Complete: "complete",
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
	orderItemId: string;

	trackingNumber: string;

	trackingUrl: string;

	vendor: string;
}

export interface ReturnCancelledInterface {
	_id: string;
	reason: string;
	comment: string;
	status: EcommerceStatus;
	declineComment: string;
}

export interface OrderItemComments {
	_id: string;
	orderItem: string;
	quote: string;
	description: string;
	createdAt: string;
	updatedAt: string;
}

export enum OrderItemStatus {
	pending = "Pending",
	confirmed = "Confirmed",
	dispatched = "Dispatched",
	shipped = "Shipped",
	delivered = "Delivered",
	returnInitiated = "Return Initiated",
	returnApproved = "Return Approved",
	returnDeclined = "Return Declined",
	cancellationInitiated = "Cancellation Initiated",
	cancellationApproved = "Cancellation Approved",
	cancellationRejected = "Cancellation Rejected",
}

export interface OrderItems {
	_id: string;
	status: OrderItemStatus;
	shippingCharge: number;
	orderItemId: string;
	order: string;
	product: AssetType;
	quantity: number;
	price: number;
	createdAt: string;
	updatedAt: string;
	comments: OrderItemComments[];
	tracking: Tracking;
	return: ReturnCancelledInterface;
	cancellation: ReturnCancelledInterface;
}

export interface EcommOrder {
	_id: string;
	status: Status;
	payment: string;
	user: string;
	orderId: string;
	address: string;
	firstName: string;
	lastName: string;
	phoneNumber: string;
	shippingCharge: number;
	tax: number;
	amount: number;
	discount: number;
	createdAt: string;
	updatedAt: string;
	orderItems: OrderItems[];
}
