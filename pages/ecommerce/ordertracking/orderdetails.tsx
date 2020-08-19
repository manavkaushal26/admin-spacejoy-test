import { ArrowLeftOutlined, RedoOutlined } from "@ant-design/icons";
import { getOrderApi } from "@api/ecommerceApi";
import { scrapeAssetById } from "@api/scraperApi";
import { EcommerceOrderStatusReverseMap, EcommOrder, OrderItems } from "@customTypes/ecommerceTypes";
import { ScrapedAssetType } from "@customTypes/moodboardTypes";
import User from "@customTypes/userType";
import { MaxHeightDiv } from "@sections/Dashboard/styled";
import CommentsList from "@sections/Ecommerce/OrdertTracking/CommentsList";
import OrderEditDrawer from "@sections/Ecommerce/OrdertTracking/OrderEditDrawer";
import OrderEmailModal from "@sections/Ecommerce/OrdertTracking/OrderEmailModal";
import OrderItemDrawer from "@sections/Ecommerce/OrdertTracking/OrderItemDrawer";
import OrderItemTable from "@sections/Ecommerce/OrdertTracking/OrderItemTable";
import PaymentsDrawer from "@sections/Ecommerce/OrdertTracking/PaymentsDrawer";
import PageLayout from "@sections/Layout";
import { redirectToLocation, withAuthVerification } from "@utils/auth";
import { getValueSafely } from "@utils/commonUtils";
import { company, page } from "@utils/config";
import fetcher from "@utils/fetcher";
import IndexPageMeta from "@utils/meta";
import { Button, Col, Descriptions, notification, Row, Spin, Typography } from "antd";
import moment from "moment";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { LoudPaddingDiv } from "pages/platformanager";
import React, { useEffect, useMemo, useState } from "react";
import { CSVLink } from "react-csv";
import useWebSocket from "react-use-websocket";

const { Text, Link, Title } = Typography;

interface OrderTracking {
	authVerification: Partial<User>;
	isServer: boolean;
	orderId: string;
	orderItemId: string;
}

const returnSocketId = (lastMessage: MessageEvent) => {
	return getValueSafely(() => JSON.parse(lastMessage.data.replace("42", "")), "");
};

const OrderTracking: NextPage<OrderTracking> = ({ authVerification, isServer, orderId, orderItemId }) => {
	const [order, setOrder] = useState<EcommOrder>();
	const [orderItem, setOrderItem] = useState<OrderItems>();
	const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [editOrder, setEditOrder] = useState<boolean>(false);
	const [paymentDrawerOpen, setPaymentDrawerOpen] = useState<boolean>(false);
	const [emailModalVisible, setEmailModalVisible] = useState<boolean>(false);
	const [requestId, setRequestId] = useState("");
	const [scrapedData, setScrapedData] = useState<Record<string, ScrapedAssetType>>();
	const [scraping, setScraping] = useState<boolean>(false);
	const Router = useRouter();
	const { lastMessage } = useWebSocket(page.WssUrl);

	useEffect(() => {
		if (order && orderItemId) {
			const foundOrderItem = order?.orderItems.find(singleItem => singleItem.orderItemId.includes(orderItemId));

			if (foundOrderItem) {
				setOrderItem(foundOrderItem);
				setDrawerOpen(true);
			} else {
				notification.warn({ message: "Order Item not found" });
			}
		}
	}, [order]);

	const fetchAndPopulateOrder = async () => {
		setLoading(true);
		const endPoint = getOrderApi(orderId);
		try {
			const response = await fetcher({
				endPoint,
				method: "GET",
			});
			if (response.statusCode <= 200) {
				setOrder(response.data);
			} else {
				throw new Error();
			}
		} catch (e) {
			notification.error({ message: "Failed to fetch order" });
		}
		setLoading(false);
	};

	const fetchCurrentDataForAssets = async () => {
		setScraping(true);
		const assetIds = order?.orderItems.map(orderItem => {
			return orderItem?.product?._id;
		});

		const endPoint = scrapeAssetById();
		try {
			if (assetIds.length) {
				const response = await fetcher({ endPoint, method: "POST", body: { ids: assetIds, requestId } });
				if (response.statusCode <= 300) {
					notification.info({ message: "Scraping products data. This might take a while" });
				} else {
					throw new Error();
				}
			}
		} catch (e) {
			notification.error({ message: "Failed to get scraped data" });
			setScraping(false);
		}
	};

	useEffect(() => {
		try {
			if (!!order && !!order?.orderItems && lastMessage) {
				const [event, data] = returnSocketId(lastMessage);
				if (event === "OAuthCrossLogin.CONNECTION") {
					setRequestId(prevState => data?.id || prevState);
				} else if (event === "Scrape:Response") {
					setScrapedData(data);
					setScraping(false);
				} else if (event === "Scrape:Error") {
					setScraping(false);
				}
			}
		} catch (e) {}
	}, [order, lastMessage]);

	useEffect(() => {
		if (requestId) fetchCurrentDataForAssets();
	}, [requestId]);

	const toggleOrderItemDrawer = (orderItemToSet?: OrderItems) => {
		if (!orderItemToSet) {
			setDrawerOpen(false);
			setOrderItem(undefined);
			redirectToLocation({
				pathname: "/ecommerce/ordertracking/orderdetails",
				query: {
					orderId: orderId,
				},
				url: `/ecommerce/ordertracking/orderdetails?orderId=${orderId}`,
				options: { shallow: true },
			});
		}
		if (orderItemToSet) {
			setOrderItem(orderItemToSet);
			setDrawerOpen(true);
			redirectToLocation({
				pathname: "/ecommerce/ordertracking/orderdetails",
				query: {
					orderId: orderId,
					orderItemId: orderItemToSet.orderItemId,
				},
				url: `/ecommerce/ordertracking/orderdetails?orderId=${orderId}&orderItemId=${orderItemToSet.orderItemId}`,
				options: { shallow: true },
			});
		}
	};

	const toggleEditPaymentDrawer = () => {
		setPaymentDrawerOpen(prevState => !prevState);
	};
	const toggleEmailModal = () => {
		setEmailModalVisible(prevState => !prevState);
	};

	const setOrderData = orderData => {
		setOrder(orderData);
	};

	const updateOrderItemData = (data: OrderItems) => {
		const newOrderItems = order?.orderItems.map(orderItem => {
			if (orderItem._id === data._id) {
				return {
					...orderItem,
					...data,
				};
			}
			return { ...orderItem };
		});
		setOrder({
			...order,
			orderItems: newOrderItems,
		});
	};

	useEffect(() => {
		if (!orderId) {
			notification.error({ message: "Order Id Missing" });
		}
	}, [orderId]);

	const toggleEditOrderDrawer = () => {
		setEditOrder(prevState => !prevState);
	};

	useEffect(() => {
		fetchAndPopulateOrder();
	}, []);

	const goBack = () => {
		Router.push({ pathname: "/ecommerce/ordertracking", query: {} }, "/ecommerce/ordertracking");
	};

	const csvData = useMemo(() => {
		const data = [];
		data.push(["Order Id", order?.orderId]);
		data.push(["Name", `${order?.firstName} ${order?.lastName}`]);
		data.push(["Phone Number", order?.phoneNumber]);
		data.push(["Email", order?.user?.email]);
		data.push(["Status", order?._id]);
		data.push(["Payment Id", order?.payment]);
		data.push(["Created At", moment(order?.createdAt).format("MM-DD-YYYY")]);
		data.push(["Address", order?.address]);

		data.push(["No of Products", order?.orderItems?.length || 0]);
		data.push([]);
		data.push(["Product Amount", "Discount", "Sub-Total", "Shipping Charge", "Tax", "Total"]);
		data.push([
			(order?.amount - order?.shippingCharge - order?.tax + order?.discount)?.toFixed(2),
			order?.discount,
			(order?.amount - order?.shippingCharge - order?.tax)?.toFixed(2),
			order?.shippingCharge,
			order?.tax,
			order?.amount,
		]);
		data.push([]);
		data.push([
			"Original Product Amount",
			"Original Discount",
			"Original Sub-Total",
			"Original Shipping Charge",
			"Original Tax",
			"Original Total",
		]);
		data.push([
			(
				order?.originalOrder?.amount -
				order?.originalOrder?.shippingCharge -
				order?.originalOrder?.tax +
				order?.originalOrder?.discount
			)?.toFixed(2),
			order?.discount,
			(order?.originalOrder?.amount - order?.originalOrder?.shippingCharge - order?.originalOrder?.tax)?.toFixed(2),
			order?.originalOrder?.shippingCharge,
			order?.originalOrder?.tax,
			order?.originalOrder?.amount,
		]);
		data.push([]);
		data.push([]);

		data.push([
			"Product Name",
			"Order Item Id",
			"Retailer",
			"Retailer Link",
			"Asset URL",
			"Asset Store URL",
			"Status",
			"Quantity",
			"Price",
			"Total",
			"Tracking",
			"Live Update",
			"Return Status",
			"Return Reason",
			"Cancellation Status",
			"Cancellation Reason",
		]);

		order?.orderItems?.map(item => {
			data.push([
				item.product.name,
				item.orderItemId,
				item.product?.retailer?.name,
				item.product?.retailLink,
				`${company.customerPortalLink}/product-view/${item?.product?._id}`,
				`${company.url}/assetstore/assetdetails?assetId=${item?.product?._id}`,
				item.status,
				item.quantity,
				item.price,
				(item.price * item.quantity).toFixed(2),
				item.tracking
					? item.tracking.reduce(
							(acc, curr) => acc.concat(`${curr.vendor}-${curr.trackingNumber}-${curr.trackingUrl}\n`),
							""
					  )
					: "",
				item.comments
					? item.comments.reduce(
							(acc, curr) =>
								acc.concat(`${curr.quote}-${curr.description}-${moment(curr?.createdAt).format("MM-DD-YYYY")}\n`),
							""
					  )
					: "",
				item?.return?.status || "",
				item?.return?.reason || item?.return?.declineComment || item?.return?.comment || "",
				item?.cancellation?.status || "",
				item?.cancellation?.reason || item?.cancellation?.declineComment || item?.cancellation?.comment || "",
			]);
		});
		return data;
	}, [order]);
	const prefix = useMemo(() => {
		return order?.originalOrder && order?.originalOrder?.amount !== order?.amount ? "Current " : "";
	}, [order?.originalOrder, order?.amount]);

	return (
		<PageLayout isServer={isServer} authVerification={authVerification} pageName='Order Tracking'>
			<Head>
				{IndexPageMeta}
				<title>Orders | {company.product}</title>
			</Head>
			<MaxHeightDiv>
				<LoudPaddingDiv>
					<Spin spinning={loading}>
						<Row gutter={[8, 16]}>
							<Col span={24}>
								<Row justify='space-between' align='middle'>
									<Col>
										<Row gutter={[8, 0]} align='middle'>
											<Col>
												<ArrowLeftOutlined onClick={goBack} />
											</Col>
											<Col>
												<Text strong>Order Details ({order?.orderId})</Text>
											</Col>
										</Row>
									</Col>
									<Col>
										<Row gutter={[4, 8]}>
											<Col>
												<CSVLink
													className='ant-btn ant-btn-link'
													data={csvData}
													filename={`${order?.user?.email}-${order?.orderId}.csv`}
													target='_blank'
												>
													Download CSV
												</CSVLink>
											</Col>
											<Col>
												<Button type='link' onClick={toggleEditPaymentDrawer}>
													Payment details
												</Button>
											</Col>

											<Col>
												<Button onClick={toggleEmailModal}>Email Customer</Button>
											</Col>
											<Col>
												<Button type='primary' onClick={toggleEditOrderDrawer}>
													Edit Order
												</Button>
											</Col>
										</Row>
									</Col>
								</Row>
							</Col>
							<Col span={24}>
								<Descriptions bordered layout='vertical' column={{ lg: 6, md: 4, sm: 3, xs: 2 }} size='small'>
									<Descriptions.Item label='Order Id'>
										<Text strong copyable>
											{order?.orderId}
										</Text>
									</Descriptions.Item>
									<Descriptions.Item label='Name'>
										<Text strong>
											{order?.firstName} {order?.lastName}
										</Text>
									</Descriptions.Item>
									<Descriptions.Item label='Phone Number'>
										<Link strong href={`tel:${order?.phoneNumber}`}>
											<a>{order?.phoneNumber}</a>
										</Link>
									</Descriptions.Item>
									<Descriptions.Item label='Email'>
										<Link href={`mailto:${order?.user?.email}?subject=${order?.orderId}%20update`} strong>
											<a>{order?.user?.email}</a>
										</Link>
									</Descriptions.Item>
									<Descriptions.Item label='Status'>
										<Text strong>{EcommerceOrderStatusReverseMap[order?.status]}</Text>
									</Descriptions.Item>
									<Descriptions.Item label='No of Products'>
										<Text strong>{order?.orderItems?.length || 0}</Text>
									</Descriptions.Item>
									<Descriptions.Item label={`${prefix}Product Amount`}>
										<Text strong>
											${(order?.amount - order?.shippingCharge - order?.tax + order?.discount)?.toFixed(2)}
										</Text>
									</Descriptions.Item>
									<Descriptions.Item label={`${prefix}Discount`}>
										<Text strong>${order?.discount}</Text>
									</Descriptions.Item>
									<Descriptions.Item label={`${prefix}Sub-Total`}>
										<Text strong>${(order?.amount - order?.shippingCharge - order?.tax)?.toFixed(2)}</Text>
									</Descriptions.Item>
									<Descriptions.Item label={`${prefix}Shipping Charge`}>
										<Text strong>${order?.shippingCharge}</Text>
									</Descriptions.Item>
									<Descriptions.Item label={`${prefix}Tax`}>
										<Text strong>${order?.tax}</Text>
									</Descriptions.Item>
									<Descriptions.Item label={`${prefix}Total`}>
										<Text strong>${order?.amount}</Text>
									</Descriptions.Item>
									{order?.originalOrder && order?.originalOrder?.amount !== order?.amount && (
										<>
											<Descriptions.Item label='Original Product Amount'>
												<Text strong>
													$
													{(
														order?.originalOrder?.amount -
														order?.originalOrder?.shippingCharge -
														order?.originalOrder?.tax +
														order?.originalOrder?.discount
													)?.toFixed(2)}
												</Text>
											</Descriptions.Item>
											<Descriptions.Item label='Original Discount'>
												<Text strong>${order?.originalOrder?.discount}</Text>
											</Descriptions.Item>
											<Descriptions.Item label='Original Sub-Total'>
												<Text strong>
													$
													{(
														order?.originalOrder?.amount -
														order?.originalOrder?.shippingCharge -
														order?.originalOrder?.tax
													)?.toFixed(2)}
												</Text>
											</Descriptions.Item>
											<Descriptions.Item label='Original Shipping Charge'>
												<Text strong>${order?.originalOrder?.shippingCharge}</Text>
											</Descriptions.Item>
											<Descriptions.Item label='Original Tax'>
												<Text strong>${order?.originalOrder?.tax}</Text>
											</Descriptions.Item>
											<Descriptions.Item label='Original Total'>
												<Text strong>${order?.originalOrder?.amount}</Text>
											</Descriptions.Item>
										</>
									)}
									<Descriptions.Item label='Payment Id'>
										<Text strong>{order?.payment}</Text>
									</Descriptions.Item>
									<Descriptions.Item label='Created At'>
										<Text strong>{moment(order?.createdAt).format("MM-DD-YYYY")}</Text>
									</Descriptions.Item>

									<Descriptions.Item label='Address'>
										<Text strong>{order?.address}</Text>
									</Descriptions.Item>
								</Descriptions>
							</Col>
							<Col span={24}>
								<CommentsList type='Order' id={order?._id} />
							</Col>
							<Col>
								<Row>
									<Col>
										<Title level={4}>Product List</Title>
									</Col>
									{scraping && (
										<Col>
											<Button type='link'>
												<RedoOutlined spin={scraping} style={{ transform: "rotate(180deg)" }} />
												Fetching Asset data
											</Button>
										</Col>
									)}
								</Row>
							</Col>
							<Col span={24}>
								<OrderItemTable
									scrapedData={scrapedData}
									orderItems={order?.orderItems}
									toggleOrderItemDrawer={toggleOrderItemDrawer}
								/>
							</Col>
						</Row>
					</Spin>
					<PaymentsDrawer
						orderId={orderId}
						toggleDrawer={toggleEditPaymentDrawer}
						open={paymentDrawerOpen}
						originalAmount={order?.originalOrder?.amount}
						amount={order?.amount}
					/>
					<OrderEmailModal
						open={emailModalVisible}
						onClose={toggleEmailModal}
						orderId={orderId}
						orderItems={order?.orderItems}
						order={order}
					/>
					{orderItem && (
						<OrderItemDrawer
							orderItemData={orderItem}
							open={drawerOpen}
							setOrderItemData={updateOrderItemData}
							closeDrawer={toggleOrderItemDrawer}
						/>
					)}
					{editOrder && (
						<OrderEditDrawer
							open={editOrder}
							orderData={order}
							closeDrawer={toggleEditOrderDrawer}
							setOrderData={setOrderData}
						/>
					)}
				</LoudPaddingDiv>
			</MaxHeightDiv>
		</PageLayout>
	);
};

OrderTracking.getInitialProps = async ({ req, query }) => {
	const orderId = query.orderId as string;
	const orderItemId = query.orderItemId as string;

	return {
		isServer: !!req,
		authVerification: { name: "", email: "" },
		orderId,
		orderItemId,
	};
};

export default withAuthVerification(OrderTracking);
