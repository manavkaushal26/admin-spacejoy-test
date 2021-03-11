import { ArrowLeftOutlined, RedoOutlined } from "@ant-design/icons";
import { getDesignMapping, getOrderApi } from "@api/ecommerceApi";
import { EcommerceOrderStatusReverseMap, EcommOrder, OrderItems } from "@customTypes/ecommerceTypes";
import { MaxHeightDiv } from "@sections/Dashboard/styled";
import CommentsList from "@sections/Ecommerce/OrderTracking/CommentsList";
import OrderCouponTable from "@sections/Ecommerce/OrderTracking/OrderCouponTable";
import OrderEditDrawer from "@sections/Ecommerce/OrderTracking/OrderEditDrawer";
import OrderEmailModal from "@sections/Ecommerce/OrderTracking/OrderEmailModal";
import OrderItemDrawer from "@sections/Ecommerce/OrderTracking/OrderItemDrawer";
import OrderItemTable from "@sections/Ecommerce/OrderTracking/OrderItemTable";
import OrderOfferTable from "@sections/Ecommerce/OrderTracking/OrderOfferTable";
import PaymentsDrawer from "@sections/Ecommerce/OrderTracking/PaymentsDrawer";
import PageLayout from "@sections/Layout";
import { ProtectRoute, redirectToLocation } from "@utils/authContext";
import { company } from "@utils/config";
import { useScraper } from "@utils/customHooks/useScraper";
import fetcher from "@utils/fetcher";
import IndexPageMeta from "@utils/meta";
import { Button, Col, Descriptions, notification, Row, Spin, Typography } from "antd";
import moment from "moment";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { LoudPaddingDiv } from "pages/platformanager";
import React, { useEffect, useMemo, useState } from "react";
import { CSVLink } from "react-csv";

const { Text, Link, Title } = Typography;

interface OrderTracking {
	orderId: string;
	orderItemId: string;
	orderData?: EcommOrder;
}

const OrderTracking: NextPage<OrderTracking> = ({ orderId, orderItemId, orderData }) => {
	const [order, setOrder] = useState<EcommOrder>(orderData);
	const [orderItem, setOrderItem] = useState<OrderItems>();
	const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [editOrder, setEditOrder] = useState<boolean>(false);
	const [paymentDrawerOpen, setPaymentDrawerOpen] = useState<boolean>(false);
	const [emailModalVisible, setEmailModalVisible] = useState<boolean>(false);
	const [orderCoupons, setOrderCoupons] = useState<[]>([]);
	const [orderOffers, setOrderOffers] = useState<[]>([]);
	const { scrapedData, error: scrapingError, scraping, triggerScraping } = useScraper(
		orderId,
		order?.orderItems.map(item => item?.product?._id)
	);

	useEffect(() => {
		if (scraping) notification.info({ message: "Scraping Products data. This may take a minute" });
	}, [scraping]);

	useEffect(() => {
		if (scrapingError) notification.error({ message: "Failed to scrape Data" });
	}, [scrapingError]);

	const Router = useRouter();

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

	const fetchOrderOffers = async () => {
		const response = await fetcher({
			endPoint: `/v1/orders/${orderId}/orderOffers`,
			method: "GET",
		});
		if (response.statusCode <= 300) {
			setOrderOffers(response?.data);
		} else {
			throw new Error();
		}
	};

	const fetchOrderCoupons = async () => {
		const response = await fetcher({
			endPoint: `/v1/orders/${orderId}/orderCoupons`,
			method: "GET",
		});
		if (response.statusCode <= 300) {
			setOrderCoupons(response?.data);
		} else {
			throw new Error();
		}
	};

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
		if (!orderData) {
			fetchAndPopulateOrder();
		}
		fetchOrderOffers();
		fetchOrderCoupons();
	}, []);

	const goBack = () => {
		Router.push({ pathname: "/ecommerce/ordertracking" });
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

		// order item columns

		const { orderItems = [] } = order || {};
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
			"Design Project Link",
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
				item?.designProjectInfo?.projectId
					? `${company.url}/dashboard/pid/${item.designProjectInfo.projectId}/did/${item.designProjectInfo.designId}`
					: "No mapping available",
			]);
		});
		return data;
	}, [order]);
	const prefix = useMemo(() => {
		return order?.originalOrder && order?.originalOrder?.amount !== order?.amount ? "Current " : "";
	}, [order?.originalOrder, order?.amount]);
	console.log(orderCoupons, orderOffers);
	return (
		<PageLayout pageName='Order Tracking'>
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
												<Text>
													<ArrowLeftOutlined onClick={goBack} />
												</Text>
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
									<Descriptions.Item label='Created At (UTC)'>
										<Text strong>{moment.utc(order?.createdAt).format("MM-DD-YYYY")}</Text>
									</Descriptions.Item>

									<Descriptions.Item label='Address'>
										<Text strong>{order?.address}</Text>
									</Descriptions.Item>
								</Descriptions>
							</Col>
							<Col span={24}>
								<CommentsList type='Order' id={order?._id} />
							</Col>
							<Col span={24}>
								<OrderCouponTable data={orderCoupons} />
							</Col>
							<Col span={24}>
								<OrderOfferTable data={orderOffers} />
							</Col>
							<Col>
								<Row gutter={[8, 8]} align='top'>
									<Col>
										<Title level={4}>Product List</Title>
									</Col>
									{scraping ? (
										<Col>
											<Link>
												<Row gutter={[4, 4]} align='middle'>
													<Col>
														<RedoOutlined spin={scraping} style={{ transform: "rotate(180deg)" }} />
													</Col>
													<Col>Fetching Asset data</Col>
												</Row>
											</Link>
										</Col>
									) : (
										<Col>
											<Button type='link' onClick={triggerScraping}>
												Fetch Asset Data
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

export const getServerSideProps: GetServerSideProps<OrderTracking> = async ctx => {
	const { query } = ctx;
	const orderId = (query.orderId || "") as string;
	const orderItemId = (query.orderItemId || "") as string;
	const endPoint = getOrderApi(orderId);

	try {
		const response = await fetcher({
			ctx,
			endPoint,
			method: "GET",
		});
		if (response.statusCode <= 200) {
			const { data: { orderItems = [] } = {} } = response;
			const itemsArray = orderItems.map(item => item._id);
			const itemDesignMappingEndPoint = getDesignMapping();
			try {
				const resData = await fetcher({
					ctx,
					endPoint: itemDesignMappingEndPoint,
					method: "POST",
					body: {
						orderItemIds: itemsArray,
					},
				});
				if (resData.statusCode <= 200) {
					const { data: { mappings = [] } = {} } = resData;
					const itemDesignMap = {};

					mappings.forEach(mapping => {
						itemDesignMap[mapping.orderItem] = {};
						itemDesignMap[mapping.orderItem].projectId = mapping.project._id;
						itemDesignMap[mapping.orderItem].projectName = mapping.project.name;
						itemDesignMap[mapping.orderItem].designId = mapping.design._id;
						itemDesignMap[mapping.orderItem].designName = mapping.design.name;
					});
					const orderData = {
						...response.data,
						orderItems: [...response.data.orderItems].map(k => {
							if (itemDesignMap[k._id]) {
								return { ...k, designProjectInfo: itemDesignMap[k._id] };
							}
							return { ...k, designProjectInfo: {} };
						}),
					};

					return {
						props: { orderId, orderItemId, orderData },
					};
				} else {
					return {
						props: {
							orderId,
							orderItemId,
							orderData: response.data,
						},
					};
				}
			} catch {
				return {
					props: { orderId, orderItemId, orderData: response.data },
				};
			}
		} else {
			throw new Error();
		}
	} catch (e) {
		return {
			props: { orderId, orderItemId },
		};
	}
};

export default ProtectRoute(OrderTracking);
