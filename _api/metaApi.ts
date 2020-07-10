export const getAllCollections = (): string => {
	return "/designcollections";
};

export const getSingleCollection = (id: string): string => {
	return `/designcollection/${id}`;
};

export const getAllCollectionsMeta = (): string => {
	return "/designcollections/meta";
};

export const getAllPricePackages = (): string => {
	return "/packages/search";
};

export const getCurrentVersions = (): string => {
	return "/vconfig/options/package";
};

export const getPackageVersionInfo = (): string => {
	return "/vconfig/options/package";
};

export const editPackageApi = (packageId: string): string => {
	return `/package/${packageId}`;
};

export const getAllCoupons = (search: boolean): string => {
	if (search) {
		return "/coupons/search";
	}
	return "/coupons";
};

export const createEditCouponApi = (couponId: string): string => {
	return `/coupon${couponId ? `/${couponId}` : ""}`;
};
