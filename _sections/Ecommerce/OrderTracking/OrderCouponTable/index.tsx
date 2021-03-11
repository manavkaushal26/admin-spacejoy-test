import { Table, Typography } from "antd";
import React from "react";

const { Title } = Typography;

interface OrderCoupons {
	_id: string;
	coupon: string;
	createdAt: string;
	discount: string;
}

interface OrderCouponTable {
	data: OrderCoupons[];
}

const OrderCouponTable: React.FC<OrderCouponTable> = ({ data }) => {
	return (
		<>
			<Title level={4}>Order Coupons</Title>
			<Table rowKey='_id' dataSource={data} scroll={{ x: 768 }} pagination={{ hideOnSinglePage: true }}>
				<Table.Column key='_id' title='Coupon' dataIndex='coupon' render={text => text} />
				<Table.Column key='_id' title='Created At' dataIndex='createdAt' render={text => text} />
				<Table.Column key='_id' title='Discount' dataIndex='discount' render={text => <>${text}</>} />
			</Table>
		</>
	);
};

export default OrderCouponTable;
