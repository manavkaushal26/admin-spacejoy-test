import { EcommOrder } from "@customTypes/ecommerceTypes";
import { Col, Row, Table, Typography } from "antd";
import moment from "moment";
import Link from "next/link";
import React from "react";
import OrderItemTable from "../OrderItemTable";

const { Text, Link: TextLink } = Typography;

interface AllOrderTable {
	orderData: EcommOrder[];
	total: number;
	pageSize: number;
	pageNo: number;
	setPageNo: React.Dispatch<React.SetStateAction<number>>;
	setPageSize: React.Dispatch<React.SetStateAction<number>>;
	loading: boolean;
}

const AllOrderTable: React.FC<AllOrderTable> = ({
	orderData,
	total,
	pageSize,
	pageNo,
	setPageNo,
	setPageSize,
	loading,
}) => {
	const handleChange = (pageNo, pageSize) => {
		setPageSize(pageSize);
		setPageNo(pageNo);
	};

	return (
		<Table
			loading={loading}
			rowKey='_id'
			scroll={{ x: 768 }}
			expandable={{
				expandedRowRender: function TableRender(record) {
					return <OrderItemTable orderItems={record.orderItems || []} orderId={record._id} />;
				},
				rowExpandable: record => record.orderItems && !!record.orderItems.length,
			}}
			dataSource={orderData}
			pagination={{
				current: pageNo,
				total,
				pageSizeOptions: ["12", "24", "36", "48"],
				pageSize,
				onChange: handleChange,
				hideOnSinglePage: true,
			}}
		>
			<Table.Column
				key='_id'
				title='Name'
				render={(_text, record: EcommOrder) => {
					return (
						<Row>
							<Col span={24}>
								<Link href={{ pathname: "/ecommerce/ordertracking/orderdetails", query: { orderId: record._id } }}>
									<TextLink strong>{`${record.firstName} ${record.lastName}`}</TextLink>
								</Link>
							</Col>
							<Col span={24}>
								<TextLink href={`mailto:${record?.user?.email}?subject=${record?.orderId}%20update`}>
									{record?.user?.email}
								</TextLink>
							</Col>
						</Row>
					);
				}}
			/>
			<Table.Column key='_id' title='Order Id' dataIndex='orderId' render={text => <Text copyable>{text}</Text>} />
			<Table.Column
				key='_id'
				title='Phone Number'
				dataIndex='phoneNumber'
				render={text => (
					<TextLink strong href={`tel:${text}`}>
						{text}
					</TextLink>
				)}
			/>
			<Table.Column key='_id' title='Amount' dataIndex='amount' render={text => <Text>${text}</Text>} />
			<Table.Column key='_id' title='Status' dataIndex='status' />
			<Table.Column
				key='_id'
				title='Created At'
				dataIndex='createdAt'
				render={text => {
					const formattedTime = moment(text).format("YYYY-MM-DD hh:mm");
					return formattedTime;
				}}
			/>
		</Table>
	);
};

export default AllOrderTable;
