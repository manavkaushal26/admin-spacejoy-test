export interface PriceEntry {
	label: string;
	value: number;
	inPercent?: number;
	inAmount?: number;
}

export interface PriceData {
	price: PriceEntry;
	salePrice: PriceEntry;
	savings: PriceEntry;
	isSaleActive: true;
	versionNumber: number;
	_id: string;
	slug: string;
	id: string;
}
