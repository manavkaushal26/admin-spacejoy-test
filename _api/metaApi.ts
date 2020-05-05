export const getAllCollections = (): string => {
	return "/designcollections";
};

export const getSingleCollection = (id: string): string => {
	return `/designcollection/${id}`;
};

export const getAllCollectionsMeta = (): string => {
	return `/designcollections/meta`;
};
