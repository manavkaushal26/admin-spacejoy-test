import { getOrderFromOrderIdApiEndpoint, getProjectsOverviewApiEndpoint } from "@api/projectApi";
import { CapitalizedText } from "@components/CommonStyledComponents";
import { cloudinary } from "@utils/config";
import fetcher from "@utils/fetcher";
import { Button, Modal, Row, Space, Table, Typography } from "antd";
import moment from "moment-timezone";
import React, { useEffect, useState } from "react";

const { Title, Link } = Typography;

const IncentiveCalView = ({ data, setActionPanelView }) => {
	const [loading, setLoading] = useState(false);
	const [visible, setVisible] = useState(false);
	const [projectsData, setProjectsData] = useState([]);
	const [itemsData, setItemsData] = useState({ orderItems: [], size: 0, totalCartPrice: "" });
	const [itemsLoading, setItemsLoading] = useState(false);

	const showModal = () => {
		setVisible(true);
	};

	const handleCancel = () => {
		setVisible(false);
		setItemsData({ orderItems: [], size: 0, totalCartPrice: "" });
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

	const IncentiveCalTableColumns = [
		{
			title: "Project Name",
			key: "projectName",
			render: rowData => (!rowData?.project ? "-" : rowData?.project?.name),
		},
		{
			title: "Project ID",
			key: "projectId",
			render: rowData => (!rowData?.project ? "-" : rowData?.project?._id),
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
			title: "Order Created (Month)",
			key: "orderCreationDate",
			render: rowData => moment(rowData.orderCreationDate).format("MMMM, YYYY"),
		},
		{
			title: "Incentive",
			key: "incentive",
			render: rowData => (rowData.incentive === 0 ? "-" : `$${rowData.incentive}`),
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
			title: "Qty.",
			dataIndex: "quantity",
			key: "quantity",
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
					Total Last Month Design Incentive: <span style={{ color: "#1890ff" }}>${data?.monthlyIncentive}</span>
				</Title>
			</Row>
			<Table dataSource={projectsData} columns={IncentiveCalTableColumns} loading={loading} />
			<Modal
				visible={visible}
				title='Order Items'
				onCancel={handleCancel}
				footer={[
					<Button key='back' onClick={handleCancel}>
						Close
					</Button>,
				]}
				width={1000}
			>
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
