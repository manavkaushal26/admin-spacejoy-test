import { cloudinary } from "@utils/config";
import { Button, Modal, Row, Space, Table, Typography } from "antd";
import React, { useState } from "react";

const { Text, Link } = Typography;

const ShoppingData = ({ data, setActionPanelView }) => {
	const [loading, setLoading] = useState(false);
	const [visible, setVisible] = useState(false);
	const [itemsData, setItemsData] = useState([]);

	const ordersData = data?.orders;

	const showModal = () => {
		setVisible(true);
	};

	const handleOk = () => {
		setLoading(true);
		setTimeout(() => {
			setLoading(false);
			setVisible(false);
		}, 3000);
	};

	const handleCancel = () => {
		setVisible(false);
	};

	const shoppingDataTableColumns = [
		{
			title: "Order Id",
			dataIndex: "orderId",
			key: "orderId",
		},
		{
			title: "Total Number of items",
			key: "totalQty",
			// eslint-disable-next-line react/display-name
			render: rowData =>
				rowData.orderItems.map(item => item.quantity).reduce((prev: number, next: number) => prev + next, 0),
		},
		{
			title: "Total Incentive",
			key: "totalIncentive",
			render: rowData => {
				let sum = 0;

				const tempArray = rowData?.orderItems
					?.map(
						item =>
							+(
								(item?.product?.incentive ?? item?.product?.retailer?.incentive?.designer / 100) *
								item?.price *
								item?.quantity
							).toFixed(2)
					)
					.filter(number => !isNaN(number));

				for (let i = 0; i < tempArray.length; i++) {
					sum += tempArray[i];
				}

				return sum === 0 ? "-" : `$${sum}`;
			},
		},
		{
			title: "Action",
			key: "action",
			// eslint-disable-next-line react/display-name
			render: rowData => (
				<Space size='middle'>
					<a
						onClick={() => {
							setItemsData(rowData?.orderItems);
							showModal();
						}}
					>
						View Items
					</a>
				</Space>
			),
		},
	];

	const shoppingDataItemsTableColumns = [
		{
			title: "Product Name",
			key: "product",
			// eslint-disable-next-line react/display-name
			render: rowData => (
				<Link href={`https://spacejoy.com/product-view/${rowData?.product._id}`} target='_blank'>
					<Space>
						<img
							src={`${cloudinary.baseDeliveryURL}/${rowData?.product?.cdn}`}
							alt=''
							width={50}
							height={50}
							style={{ border: "1px solid #d3d3d3" }}
						/>
						<Link>{rowData?.product?.name}</Link>
					</Space>
				</Link>
			),
		},
		{
			title: "Incentive Per Product",
			key: "incentive",
			// eslint-disable-next-line react/display-name
			render: rowData => {
				return rowData?.product?.incentive || rowData?.product?.retailer?.incentive?.designer ? (
					<Text>
						$
						{(
							(rowData?.product?.incentive ?? rowData?.product?.retailer?.incentive?.designer / 100) * rowData?.price
						).toFixed(2)}
					</Text>
				) : (
					0
				);
			},
		},
		{
			title: "Qty.",
			dataIndex: "quantity",
			key: "quantity",
		},
		{
			title: "Total Incentive Per Product",
			key: "totalIncentive",
			// eslint-disable-next-line react/display-name
			render: rowData => {
				return rowData?.product?.incentive || rowData?.product?.retailer?.incentive?.designer ? (
					<Text>
						$
						{(
							(rowData?.product?.incentive
								? rowData?.product?.incentive
								: rowData?.product?.retailer?.incentive?.designer / 100) *
							rowData?.price *
							rowData?.quantity
						).toFixed(2)}
					</Text>
				) : (
					0
				);
			},
		},
	];

	return (
		<div style={{ marginLeft: "2rem" }}>
			<Row>
				<Button
					onClick={() => {
						setActionPanelView("ActionPanel");
					}}
					style={{ marginBottom: "1rem" }}
				>
					Back
				</Button>
			</Row>
			<Table dataSource={ordersData} columns={shoppingDataTableColumns} />
			<Modal
				visible={visible}
				title='Per Product Incentives'
				onOk={handleOk}
				onCancel={handleCancel}
				footer={[
					<Button key='back' onClick={handleCancel}>
						Close
					</Button>,
				]}
				width={1000}
			>
				<Table dataSource={itemsData} columns={shoppingDataItemsTableColumns} bordered />
			</Modal>
		</div>
	);
};

export default ShoppingData;
