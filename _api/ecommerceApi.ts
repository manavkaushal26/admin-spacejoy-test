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
