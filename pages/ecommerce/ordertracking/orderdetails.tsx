import { ArrowLeftOutlined } from "@ant-design/icons";
import { getOrderApi } from "@api/ecommerceApi";
import { EcommerceOrderStatusReverseMap, EcommOrder, OrderItems } from "@customTypes/ecommerceTypes";
import User from "@customTypes/userType";
import { MaxHeightDiv } from "@sections/Dashboard/styled";
import OrderEditDrawer from "@sections/Ecommerce/OrdertTracking/OrderEditDrawer";
import OrderEmailModal from "@sections/Ecommerce/OrdertTracking/OrderEmailModal";
import OrderItemDrawer from "@sections/Ecommerce/OrdertTracking/OrderItemDrawer";
import OrderItemTable from "@sections/Ecommerce/OrdertTracking/OrderItemTable";
import PaymentsDrawer from "@sections/Ecommerce/OrdertTracking/PaymentsDrawer";
import PageLayout from "@sections/Layout";
import { redirectToLocation, withAuthVerification } from "@utils/auth";
import { company } from "@utils/config";
import fetcher from "@utils/fetcher";
import IndexPageMeta from "@utils/meta";
import { Button, Col, Descriptions, Divider, notification, Row, Spin, Typography } from "antd";
import moment from "moment";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { LoudPaddingDiv } from "pages/platformanager";
import React, { useEffect, useState } from "react";

const { Text } = Typography;

interface OrderTracking {
	authVerification: Partial<User>;
	isServer: boolean;
	orderId: string;
	orderItemId: string;
}

const OrderTracking: NextPage<OrderTracking> = ({ authVerification, isServer, orderId, orderItemId }) => {
	const [order, setOrder] = useState<EcommOrder>();
	const [orderItem, setOrderItem] = useState<OrderItems>();
	const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [editOrder, setEditOrder] = useState<boolean>(false);
	const [paymentDrawerOpen, setPaymentDrawerOpen] = useState<boolean>(false);
	const [emailModalVisible, setEmailModalVisible] = useState<boolean>(false);

	const Router = useRouter();

	useEffect(() => {
		if (order && orderItemId) {
			const foundOrderItem = order.orderItems.find(singleItem => singleItem.orderItemId.includes(orderItemId));

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
		const newOrderItems = order.orderItems.map(orderItem => {
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

	return (
		<PageLayout isServer={isServer} authVerification={authVerification} pageName='Order Tracking'>
			<Head>
				{IndexPageMeta}
				<title>Orders | {company.product}</title>
			</Head>
			<MaxHeightDiv>
				<LoudPaddingDiv>
					<Spin spinning={loading}>
						<Row gutter={[0, 16]}>
							<Col span={24}>
								<Descriptions
									title={
										<Row justify='space-between' align='middle'>
											<Col>
												<Row gutter={[8, 0]} align='middle'>
													<Col>
														<ArrowLeftOutlined onClick={goBack} />
													</Col>
													<Col>Order Details ({order?.orderId})</Col>
												</Row>
											</Col>
											<Col>
												<Row gutter={[4, 4]}>
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
									}
									bordered
									layout='vertical'
									column={6}
									size='small'
								>
									<Descriptions.Item label='Order Id'>
										<Text strong>{order?.orderId}</Text>
									</Descriptions.Item>
									<Descriptions.Item label='Name'>
										<Text strong>
											{order?.firstName} {order?.lastName}
										</Text>
									</Descriptions.Item>
									<Descriptions.Item label='Phone Number'>
										<Text strong>{order?.phoneNumber}</Text>
									</Descriptions.Item>
									<Descriptions.Item label='Email'>
										<Text strong>{order?.user?.email}</Text>
									</Descriptions.Item>
									<Descriptions.Item label='Status'>
										<Text strong>{EcommerceOrderStatusReverseMap[order?.status]}</Text>
									</Descriptions.Item>
									<Descriptions.Item label='No of Products'>
										<Text strong>{order?.orderItems?.length || 0}</Text>
									</Descriptions.Item>
									<Descriptions.Item label='Product Amount'>
										<Text strong>
											{(order?.amount - order?.shippingCharge - order?.tax + order?.discount)?.toFixed(2)}
										</Text>
									</Descriptions.Item>
									<Descriptions.Item label='Discount'>
										<Text strong>{order?.discount}</Text>
									</Descriptions.Item>
									<Descriptions.Item label='Sub-Total'>
										<Text strong>{(order?.amount - order?.shippingCharge - order?.tax)?.toFixed(2)}</Text>
									</Descriptions.Item>
									<Descriptions.Item label='Shipping Charge'>
										<Text strong>{order?.shippingCharge}</Text>
									</Descriptions.Item>
									<Descriptions.Item label='Tax'>
										<Text strong>{order?.tax}</Text>
									</Descriptions.Item>
									<Descriptions.Item label='Total'>
										<Text strong>{order?.amount}</Text>
									</Descriptions.Item>
									{order?.originalOrder && order?.originalOrder?.amount !== order.amount && (
										<>
											<Descriptions.Item label='Product Amount'>
												<Text strong>
													{(
														order?.originalOrder?.amount -
														order?.originalOrder?.shippingCharge -
														order?.originalOrder?.tax +
														order?.originalOrder?.discount
													)?.toFixed(2)}
												</Text>
											</Descriptions.Item>
											<Descriptions.Item label='Discount'>
												<Text strong>{order?.originalOrder?.discount}</Text>
											</Descriptions.Item>
											<Descriptions.Item label='Sub-Total'>
												<Text strong>
													{(
														order?.originalOrder?.amount -
														order?.originalOrder?.shippingCharge -
														order?.originalOrder?.tax
													)?.toFixed(2)}
												</Text>
											</Descriptions.Item>
											<Descriptions.Item label='Shipping Charge'>
												<Text strong>{order?.originalOrder?.shippingCharge}</Text>
											</Descriptions.Item>
											<Descriptions.Item label='Tax'>
												<Text strong>{order?.originalOrder?.tax}</Text>
											</Descriptions.Item>
											<Descriptions.Item label='Total'>
												<Text strong>{order?.originalOrder?.amount}</Text>
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
								<Divider />
							</Col>
							<Col span={24}>
								<OrderItemTable orderItems={order?.orderItems} toggleOrderItemDrawer={toggleOrderItemDrawer} />
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
