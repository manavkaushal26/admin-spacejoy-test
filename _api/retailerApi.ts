export const retailerApi = (retailerId?: string): string => {
	return `/v1/retailers${retailerId ? `/${retailerId}` : ""}`;
};

export const searchRetailers = (): string => {
	return "/v1/retailers/search";
};
