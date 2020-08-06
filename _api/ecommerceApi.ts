export const uploadRetailerImageApi = (retailerId: string): string => {
	return `/v1/retailers/${retailerId}/logo`;
};

export const searchRetailerApi = (): string => {
	return "/v1/retailers/search";
};

// ===================================================================================================

export const searchOrdersApi = (): string => {
	return "/v1/orders/search";
};

export const getOrderApi = (orderId: string): string => {
	return `/v1/orders/${orderId}`;
};

export const getOrderItemApi = (orderItemId: string): string => {
	return `/v1/orderItems/${orderItemId}`;
};

// ===================================================================================================

export const getOrderPaymentApi = (orderId: string): string => {
	return `/v1/orders/${orderId}/payments`;
};

export const getCapturePaymentApi = (): string => {
	return "/v1/orders/capturePayment";
};

export const getOrderTriggerEmailApi = (orderId: string): string => {
	return `/v1/orders/${orderId}/email`;
};

// ===================================================================================================

export const reasonApi = (): string => {
	return "/v1/reasons";
};
