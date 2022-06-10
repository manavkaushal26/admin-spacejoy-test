import { getOrderFromOrderIdApiEndpoint, getProjectsOverviewApiEndpoint } from "@api/projectApi";
import { CapitalizedText } from "@components/CommonStyledComponents";
import { cloudinary } from "@utils/config";
import fetcher from "@utils/fetcher";
import { Button, Modal, Row, Space, Table, Typography } from "antd";
import type { ColumnsType } from "antd/lib/table";
import moment from "moment-timezone";
import React, { useEffect, useState } from "react";

const { Title, Text, Link } = Typography;

const IncentiveCalView = ({ data, setActionPanelView, user }) => {
	const [loading, setLoading] = useState(false);
	const [visible, setVisible] = useState(false);
	const [projectsData, setProjectsData] = useState([]);
	const [itemsData, setItemsData] = useState({ orderItems: [], size: 0, totalCartPrice: "" });
	const [itemsLoading, setItemsLoading] = useState(false);

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

	async function getProjectsInformation() {
		setLoading(true);
		try {
			const endPoint = getProjectsOverviewApiEndpoint();
			const res = await fetcher({
				endPoint,
				method: "POST",
				body: { projects: data.projects },
			});
			if (res.statusCode <= 300) {
				setProjectsData(res.data);
			} else {
				setProjectsData([]);
			}
		} catch (error) {
			// eslint-disable-next-line no-console
			console.log(error);
		} finally {
			setLoading(false);
		}
	}

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

	useEffect(() => {
		getProjectsInformation();
	}, []);

	const IncentiveCalTableColumns: ColumnsType = [
		{
			title: "Customer Name",
			key: "customerName",
			render: rowData =>
				rowData.customer ? `${rowData.customer.profile.firstName} ${rowData.customer.profile.lastName}` : null,
		},
		{
			title: "Email",
			key: "userEmail",
			// eslint-disable-next-line react/display-name
			render: rowData => (rowData.customer ? `${rowData.customer.email}` : null),
		},
		{
			title: "Project Name",
			key: "projectName",
			render: rowData => (!rowData?.project ? "-" : rowData?.project?.name),
		},
		{
			title: "Project ID",
			key: "projectId",
			// eslint-disable-next-line react/display-name
			render: rowData =>
				!rowData?.project ? (
					"-"
				) : (
					<Link>
						<a href={`/dashboard/pid/${rowData?.project?._id}`} target='_blank' rel='noopener noreferrer'>
							{rowData?.project?._id}
						</a>
					</Link>
				),
		},
		{
			title: "Designer Name",
			key: "designerName",
			render: row => (row?.designer ? row.designer.profile.name : user?.name),
		},
		{
			title: "Order Id",
			// dataIndex: "order",
			key: "order",
			// eslint-disable-next-line react/display-name
			render: rowData => (
				<Space size='middle'>
					<a
						onClick={() => {
							getOrderItemsFromOrderId(rowData.order);
							showModal();
						}}
					>
						{rowData.order}
					</a>
				</Space>
			),
		},
		{
			title: "Order Created",
			key: "orderCreationDate",
			width: 150,
			render: rowData => moment(rowData.orderCreationDate).format("ll"),
			defaultSortOrder: "descend",
			sorter: (a: any, b: any) => new Date(a.orderCreationDate).valueOf() - new Date(b.orderCreationDate).valueOf(),
			sortDirections: ["ascend", "descend", "ascend"],
		},
		{
			title: "Incentive",
			key: "incentive",
			render: rowData => (rowData.incentive === 0 ? "-" : `$${rowData.incentive}`),
			fixed: "right",
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
			<Row style={{ marginBottom: "1rem" }}>
				<Title level={4}>
					Total Design Incentive: <span style={{ color: "#1890ff" }}>${data?.totalIncentive}</span>
				</Title>
			</Row>
			<Table dataSource={projectsData} columns={IncentiveCalTableColumns} loading={loading} scroll={{ x: 1300 }} />
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

export default IncentiveCalView;
