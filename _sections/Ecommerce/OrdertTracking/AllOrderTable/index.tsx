import React from "react";
import { Table } from "antd";
import { EcommOrder } from "@customTypes/ecommerceTypes";
import moment from "moment";
import { redirectToLocation } from "@utils/auth";
import OrderItemTable from "../OrderItemTable";

interface AllOrderTable {
	orderData: EcommOrder[];
	total: number;
	pageSize: number;
	pageNo: number;
	setPageNo: React.Dispatch<React.SetStateAction<number>>;
	setPageSize: React.Dispatch<React.SetStateAction<number>>;
}

const AllOrderTable: React.FC<AllOrderTable> = ({ orderData, total, pageSize, pageNo, setPageNo, setPageSize }) => {
	const handleChange = (pageNo, pageSize) => {
		setPageSize(pageSize);
		setPageNo(pageNo);
	};

	const onRowClick = (row: EcommOrder) => {
		redirectToLocation({
			pathname: "/ecommerce/ordertracking/orderdetails",
			query: { orderId: row._id },
			url: `/ecommerce/ordertracking/orderdetails?orderId=${row._id}`,
		});
	};

	return (
		<Table
			rowKey='_id'
			expandable={{
				expandedRowRender: function TableRender(record) {
					return <OrderItemTable orderItems={record.orderItems || []} />;
				},
				rowExpandable: record => record.orderItems && !!record.orderItems.length,
			}}
			dataSource={orderData}
			onRow={record => {
				return { onClick: () => onRowClick(record) };
			}}
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
					return `${record.firstName} ${record.lastName}`;
				}}
			/>
			<Table.Column key='_id' title='Order Id' dataIndex='orderId' />
			<Table.Column key='_id' title='Phone Number' dataIndex='phoneNumber' />
			<Table.Column key='_id' title='Amount' dataIndex='amount' />
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
