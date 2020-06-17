export const getAllCollections = (): string => {
	return "/designcollections";
};

export const getSingleCollection = (id: string): string => {
	return `/designcollection/${id}`;
};

export const getAllCollectionsMeta = (): string => {
	return `/designcollections/meta`;
};

export const getAllPricePackages = (): string => {
	return `/packages/search`;
};

export const getPackageVersionInfo = (): string => {
	return `/vconfig/options/package`;
};

export const editPackageApi = (packageId: string): string => {
	return `/package/${packageId}`;
};
