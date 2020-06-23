export interface BasicCoupon {
	constraints: {
		minAmount: number;
		maxAmount: number;
	};
	endTime: string;
	status: string;
	isPercent: boolean;
	maxUsePerUser: number;
	maxDiscount: number;
	category: string;
	impressions: number;
	_id: string;
	code: string;
	title: string;
	description: string;
	amount: number;
	startTime: string;
	createdAt: string;
	updatedAt: string;
}
