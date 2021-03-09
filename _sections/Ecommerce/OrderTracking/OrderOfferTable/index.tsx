import { Table, Typography } from "antd";
import React from "react";

const { Title } = Typography;

interface OrderOffers {
	_id: string;
	coupon: string;
	createdAt: string;
	discount: string;
}

interface OrderOfferTable {
	data: OrderOffers[];
}

const OrderOfferTable: React.FC<OrderOfferTable> = ({ data }) => {
	return (
		<>
			<Title level={4}>Order Offers</Title>
			<Table rowKey='_id' dataSource={data} scroll={{ x: 768 }} pagination={{ hideOnSinglePage: true }}>
				<Table.Column key='_id' title='Offer' dataIndex='coupon' render={text => text} />
				<Table.Column key='_id' title='Created At' dataIndex='createdAt' render={text => text} />
				<Table.Column key='_id' title='Discount' dataIndex='discount' render={text => <>${text}</>} />
			</Table>
		</>
	);
};

export default OrderOfferTable;
