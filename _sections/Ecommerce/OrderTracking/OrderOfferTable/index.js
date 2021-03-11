import { Table, Typography } from "antd";
import React from "react";

const { Title } = Typography;

export default function index({ data }) {
	return (
		<>
			<Title level={4}>Order Offers</Title>
			<Table rowKey='_id' dataSource={data} scroll={{ x: 768 }} pagination={{ hideOnSinglePage: true }}>
				<Table.Column key='_id' title='Retailer' render={(_, record) => record?.offer?.retailer?.name} />
				<Table.Column
					key='_id'
					title='Offer Discount'
					render={(_, record) => {
						return record?.offer?.discountType === "flat"
							? `$${record?.offer?.discount}`
							: `${record?.offer?.discount}%`;
					}}
				/>
				<Table.Column key='_id' title='Discount Type' render={(_, record) => record?.offer?.discountType} />
				<Table.Column
					key='_id'
					title='Max Discount'
					render={(_, record) => {
						return record?.offer?.discountType === "flat" ? "-" : `$${record?.offer?.maxDiscount}`;
					}}
				/>
				<Table.Column key='_id' title='Created At' dataIndex='createdAt' render={text => text} />
				<Table.Column key='_id' title='Final Discount' dataIndex='discount' render={text => <>{`$${text}`}</>} />
			</Table>
		</>
	);
}
