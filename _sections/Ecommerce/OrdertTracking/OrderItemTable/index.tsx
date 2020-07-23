import React from "react";
import { Table, Row, Col, Avatar, Typography, Button } from "antd";
import Image from "@components/Image";
import { OrderItems, OrderItemStatus } from "@customTypes/ecommerceTypes";

const { Text, Link } = Typography;

interface OrderItemTable {
	orderItems: OrderItems[];
	toggleOrderItemDrawer?: (data: OrderItems) => void;
}

const OrderItemTable: React.FC<OrderItemTable> = ({ orderItems, toggleOrderItemDrawer }) => {
	return (
		<Table rowKey='_id' dataSource={orderItems || []} scroll={{ x: 768 }} pagination={{ hideOnSinglePage: true }}>
			<Table.Column
				key='_id'
				title='Name'
				render={(_, record: OrderItems) => {
					return (
						<Row gutter={[8, 8]} align='middle'>
							{((record?.product?.productImages && record?.product?.productImages[0]?.cdn) || record?.product?.cdn) && (
								<Col>
									<Avatar shape='square' size='large'>
										<Image
											src={
												(record?.product?.productImages && record?.product?.productImages[0]?.cdn) ||
												record?.product?.cdn
											}
										/>
									</Avatar>
								</Col>
							)}
							<Col>
								<Row>
									<Col span={24}>
										<Text strong>{record?.product?.name}</Text>
									</Col>
									<Col span={24}>
										<Text type='secondary'>{record?.orderItemId}</Text>
									</Col>
								</Row>
							</Col>
						</Row>
					);
				}}
			/>
			<Table.Column key='_id' title='Status' dataIndex='status' render={text => OrderItemStatus[text]} />
			<Table.Column key='_id' title='Quantity' dataIndex='quantity' />
			<Table.Column key='_id' title='Price' dataIndex='price' />
			<Table.Column
				key='_id'
				title='Total'
				render={(_, record: OrderItems) => {
					return record.price * record.quantity;
				}}
			/>
			<Table.Column
				key='_id'
				title='Actions'
				render={(_, record: OrderItems) => (
					<Row align='middle'>
						{toggleOrderItemDrawer || record.tracking ? (
							<>
								{record.tracking && (
									<Col>
										<Link href={record.tracking.trackingUrl} rel='noopener noreferrer' target='_blank'>
											Track
										</Link>
									</Col>
								)}
								{toggleOrderItemDrawer && (
									<Col>
										<Button type='link' onClick={() => toggleOrderItemDrawer(record)}>
											Modify
										</Button>
									</Col>
								)}
							</>
						) : (
							"-"
						)}
					</Row>
				)}
			/>
		</Table>
	);
};

export default OrderItemTable;
