import { EcommOrder } from "@customTypes/ecommerceTypes";
import { Table, Typography } from "antd";
import moment from "moment";
import React from "react";
import OrderItemTable from "../OrderItemTable";

const { Text, Link } = Typography;

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
						<Link strong href={`/ecommerce/ordertracking/orderdetails?orderId=${record._id}`}>
							{`${record.firstName} ${record.lastName}`}
						</Link>
					);
				}}
			/>
			<Table.Column key='_id' title='Order Id' dataIndex='orderId' render={text => <Text copyable>{text}</Text>} />
			<Table.Column
				key='_id'
				title='Phone Number'
				dataIndex='phoneNumber'
				render={text => <a href={`tel:${text}`}>{text}</a>}
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
