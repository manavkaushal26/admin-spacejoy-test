/* eslint-disable react/react-in-jsx-scope */
import { CapitalizedText } from "@components/CommonStyledComponents";
import { Button, Modal, Row, Space, Table, Typography } from "antd";
import type { ColumnsType } from "antd/lib/table";
import moment from "moment";
import { useState } from "react";

const { Text, Link } = Typography;

const IncentiveCart = ({ data, setActionPanelView, user }) => {
	const [loading, setLoading] = useState(false);
	const [visible, setVisible] = useState(false);
	const [itemsData, setItemsData] = useState([]);

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

	const userCartTableColumns: ColumnsType = [
		{
			title: "Customer Name",
			key: "userName",
			fixed: "left",
			// eslint-disable-next-line react/display-name
			render: rowData => (
				<p>
					{rowData?.user?.profile?.firstName} {rowData?.user?.profile?.lastName}
				</p>
			),
		},
		{
			title: "Email",
			key: "userEmail",
			width: 250,
			// eslint-disable-next-line react/display-name
			render: rowData => (
				<Space size='middle'>
					<p>{rowData?.user?.email}</p>
				</Space>
			),
		},
		{
			title: "Total Items In Cart",
			key: "size",
			render: rowData => (rowData?.size === 0 ? "-" : rowData.size),
		},
		{
			title: "Total Cart Value",
			key: "totalValue",
			render: rowData => (rowData?.totalCartPrice === 0 ? "-" : `$${rowData.totalCartPrice}`),
		},
		{
			title: "Designer Name",
			key: "designerName",
			render: rowData =>
				rowData?.designerName === null || Object.keys(rowData?.designerName).length === 0
					? "-"
					: `${rowData.designerName.name}`,
		},
		{
			title: "Incentives (estd.)",
			key: "estdIncentive",
			render: rowData => {
				let sum = 0;

				const tempArray = rowData?.items
					?.map(
						item =>
							+(
								(item?.product?.incentive ?? item?.product?.retailer?.incentive?.designer / 100) *
								item?.product?.price *
								item?.quantity
							)
					)
					.filter(number => !isNaN(number));

				for (let i = 0; i < tempArray.length; i++) {
					sum += tempArray[i];
				}

				return sum === 0 ? "-" : `$${sum.toFixed(2)}`;
			},
		},
		{
			title: "Project Created",
			key: "projectCreated",
			render: rowData => moment(rowData.projectCreated).format("ll"),
		},
		{
			title: "Created",
			key: "createdAt",
			render: rowData => moment(rowData.createdAt).format("ll"),
		},
		{
			title: "Last Updated",
			key: "updatedAt",
			render: rowData => moment(rowData.updatedAt).format("ll"),
			defaultSortOrder: "descend",
			sorter: (a: any, b: any) => new Date(a.createdAt).valueOf() - new Date(b.createdAt).valueOf(),
			sortDirections: ["ascend", "descend", "ascend"],
		},
		{
			title: "Action",
			key: "action",
			fixed: "right",
			// eslint-disable-next-line react/display-name
			render: rowData => (
				<Space size='middle'>
					<a
						onClick={() => {
							setItemsData(rowData?.items);
							showModal();
						}}
					>
						View Items
					</a>
				</Space>
			),
		},
	];

	const userCartItemsTableColumns: ColumnsType = [
		{
			title: "Product Name",
			key: "product",
			// eslint-disable-next-line react/display-name
			render: rowData => (
				<Link href={`https://spacejoy.com/product-view/${rowData?.product._id}`} target='_blank'>
					<Space>
						<img
							src={rowData?.product?.imageUrl}
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
			title: "Retailer",
			key: "retailer",
			// eslint-disable-next-line react/display-name
			render: rowData =>
				!rowData?.product?.retailer ? "-" : <CapitalizedText>{rowData.product.retailer.name}</CapitalizedText>,
		},
		{
			title: "Price",
			key: "price",
			render: rowData => (rowData?.product?.price === 0 ? "-" : `$${rowData.product.price}`),
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
							(rowData?.product?.incentive ?? rowData?.product?.retailer?.incentive?.designer / 100) *
							rowData?.product?.price
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
			title: "Incentive Per Product * Qty.",
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
							rowData?.product?.price *
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
			<Table dataSource={data?.result} columns={userCartTableColumns} scroll={{ x: 1300 }} bordered />
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
				<Table dataSource={itemsData} columns={userCartItemsTableColumns} bordered />
			</Modal>
		</div>
	);
};

export default IncentiveCart;
