import { getOrderFromOrderIdApiEndpoint } from "@api/projectApi";
import { CapitalizedText } from "@components/CommonStyledComponents";
import { imageKitConfig } from "@utils/config";
import fetcher from "@utils/fetcher";
import { Button, Modal, Row, Space, Table, Typography } from "antd";
import type { ColumnsType } from "antd/lib/table";
import moment from "moment";
import { useState } from "react";

const { Text, Title, Link } = Typography;

const DesignerLeaderboard = ({ data, setActionPanelView }) => {
	const [loading, setLoading] = useState(false);
	const [visible, setVisible] = useState(false);
	const [itemsLoading, setItemsLoading] = useState(false);
	const [itemsData, setItemsData] = useState({ orderItems: [], size: 0, totalCartPrice: "" });

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

	async function getOrderItemsFromOrderId(orderId: string) {
		setItemsLoading(true);
		try {
			const endPoint = getOrderFromOrderIdApiEndpoint();
			const res = await fetcher({
				endPoint,
				method: "POST",
				body: { orderId: orderId },
			});
			if (res.statusCode <= 300) {
				setItemsData(res.data);
			} else {
				setItemsData({ orderItems: [], size: 0, totalCartPrice: "" });
			}
		} catch (error) {
			// eslint-disable-next-line no-console
			console.log(error);
		} finally {
			setItemsLoading(false);
		}
	}

	const expandedRowRender = rowData => {
		const columns: ColumnsType = [
			{
				title: "Order Id",
				key: "orderId",
				// eslint-disable-next-line react/display-name
				render: row =>
					row?.orderId ? (
						<Link
							onClick={() => {
								getOrderItemsFromOrderId(row.orderId);
								showModal();
							}}
						>
							{row.orderId}
						</Link>
					) : (
						"-"
					),
			},
			{
				title: "Incentive",
				key: "incentive",
				render: row => `$${row?.incentive}`,
				sorter: (a: any, b: any) => a.incentive - b.incentive,
				sortDirections: ["ascend", "descend", "ascend"],
			},
			{
				title: "Order Created",
				key: "orderCreated",
				render: row => moment(row.subListInfo).format("LL"),
				defaultSortOrder: "descend",
				sorter: (a: any, b: any) => new Date(a.subListInfo).valueOf() - new Date(b.subListInfo).valueOf(),
				sortDirections: ["ascend", "descend", "ascend"],
			},
		];

		return <Table columns={columns} dataSource={rowData.subListInfo} pagination={false} />;
	};

	const columns: ColumnsType = [
		{ title: "Designer Name", key: "name", render: row => (row?.designerInfo ? row.designerInfo.profile.name : "-") },
		{
			title: "Total Order Value",
			key: "totalOrderValue",
			render: row => (row?.totalOrderValue ? `$${row.totalOrderValue}` : null),
		},
		{
			title: "Total Incentive Earned",
			key: "totalIncentiveEarned",
			render: row => (row?.totalIncentiveEarned ? `$${row.totalIncentiveEarned}` : null),
		},
		{
			title: "Rank",
			dataIndex: "ranking",
			key: "ranking",
		},
	];

	const orderCartItemsTableColumns = [
		{
			title: "Product Name",
			key: "product",
			// eslint-disable-next-line react/display-name
			render: rowData => (
				<Link href={`https://spacejoy.com/product-view/${rowData?.product._id}`} target='_blank'>
					<Space>
						<img
							src={`${imageKitConfig.baseDeliveryURL}/${rowData?.product?.cdn}`}
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
			render: rowData => (rowData?.price === 0 ? "-" : `$${rowData.price.toFixed(2)}`),
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
			<Table
				dataSource={data?.leaderboard}
				rowKey={(record: any) => record._id}
				columns={columns}
				expandable={{ expandedRowRender }}
				pagination={false}
			/>
			<Modal
				visible={visible}
				title='Order Items'
				onOk={handleOk}
				onCancel={handleCancel}
				footer={[
					<Button key='back' onClick={handleCancel}>
						Close
					</Button>,
				]}
				afterClose={() => setItemsData({ orderItems: [], size: 0, totalCartPrice: "" })}
				width={1000}
			>
				<Row style={{ marginBottom: "1rem" }}>
					<Title level={4}>
						Total Cart Value:{" "}
						<span style={{ color: "#1890ff" }}>{itemsData?.totalCartPrice ? `$${itemsData.totalCartPrice}` : ""}</span>
					</Title>
				</Row>
				<Table
					dataSource={itemsData ? itemsData.orderItems : []}
					columns={orderCartItemsTableColumns}
					loading={itemsLoading}
					bordered
				/>
			</Modal>
		</div>
	);
};

export default DesignerLeaderboard;
