import { getOrderItemApi } from "@api/ecommerceApi";
import { OrderItems as OrderItem, OrderItemStatus } from "@customTypes/ecommerceTypes";
import fetcher from "@utils/fetcher";
import { Button, Col, Collapse, Drawer, Form, InputNumber, Modal, notification, Row, Select, Typography } from "antd";
import React, { useState } from "react";
import CommentsList from "../CommentsList";
import CancelPanel from "./CancelPanel";
import CommentPanel from "./CommentPanel";
import ReturnPanel from "./ReturnPanel";
import TrackingPanel from "./TrackingPanel";

const { Text } = Typography;

const validateMessages = {
	required: "'${label}' is required!",
};

interface OrderItemDrawer {
	orderItemData: OrderItem;
	open: boolean;
	closeDrawer: () => void;
	setOrderItemData: (data: Partial<OrderItem>) => void;
}

const OrderItemDrawer: React.FC<OrderItemDrawer> = ({ orderItemData, open, closeDrawer, setOrderItemData }) => {
	const [orderItem, setOrderItem] = useState<OrderItem>(() => orderItemData);
	const [activeCollapseKey, setActiveCollapseKey] = useState<string>("");
	const onKeyChange = value => {
		setActiveCollapseKey(activeCollapseKey.length ? value[1] || "" : value[0]);
	};

	const updateOrderItemData = (data: Partial<OrderItem>) => {
		setOrderItem({ ...orderItem, ...data });
		setOrderItemData({ ...orderItem, ...data });
	};

	const updateStatus = async data => {
		const endPoint = getOrderItemApi(orderItemData._id);
		try {
			const response = await fetcher({ endPoint, method: "PUT", body: data });
			if (response.statusCode <= 300) {
				updateOrderItemData({
					...orderItemData,
					...data,
					status: response.data.status,
					price: response.data.price,
					quantity: response.data.quantity,
				});
				notification.success({ message: "Updated status" });
			} else {
				throw new Error();
			}
		} catch (e) {
			notification.error({ message: "Failed to update status" });
		}
	};

	const handleFinish = data => {
		Modal.confirm({
			title: "This will change the status of the order Item. Are you sure you want to proceed?",
			onOk: () => updateStatus(data),
		});
	};

	return (
		<Drawer
			width={360}
			visible={open}
			onClose={() => closeDrawer()}
			title={
				<Row>
					<Col span={24}>
						<Text strong>{orderItemData?.product?.name}</Text>
					</Col>
					<Col span={24}>
						<Text type='secondary'>{orderItemData?.orderItemId}</Text>
					</Col>
				</Row>
			}
		>
			{!orderItemData.status.includes("cancel") && !orderItemData.status.includes("returns") && (
				<Form
					validateMessages={validateMessages}
					labelCol={{ span: 24 }}
					initialValues={{ status: orderItemData.status, price: orderItemData.price, quantity: orderItemData.quantity }}
					onFinish={handleFinish}
				>
					<Form.Item label='Price' name='price' rules={[{ required: true, type: "number", min: 0 }]}>
						<InputNumber style={{ width: "100%" }} />
					</Form.Item>
					<Form.Item label='Quantity' name='quantity' rules={[{ required: true, type: "number", min: 0 }]}>
						<InputNumber style={{ width: "100%" }} />
					</Form.Item>
					<Form.Item label='Status' name='status' rules={[{ required: true }]}>
						<Select>
							{Object.entries(OrderItemStatus)
								.filter((_, index) => index < 5)
								.map(([value, key]) => {
									return (
										<Select.Option key={key} value={value}>
											{key}
										</Select.Option>
									);
								})}
						</Select>
					</Form.Item>
					<Form.Item>
						<Button htmlType='submit' type='primary'>
							Save
						</Button>
					</Form.Item>
				</Form>
			)}
			<Collapse activeKey={activeCollapseKey} onChange={onKeyChange}>
				<Collapse.Panel header='Tracking' key='tracking'>
					<TrackingPanel
						orderItemId={orderItem.orderItemId}
						trackingData={orderItem.tracking}
						entryId={orderItem._id}
						setOrderItemData={updateOrderItemData}
					/>
				</Collapse.Panel>
				<Collapse.Panel header='Live Updates' key='comments'>
					<CommentPanel
						commentData={orderItem.comments}
						entryId={orderItem._id}
						setOrderItemData={updateOrderItemData}
						orderItemStatus={orderItem?.status}
					/>
				</Collapse.Panel>
				<Collapse.Panel
					header={`Return ${orderItem.cancellation ? "(Disabled as Cancellation is initiated)" : ""}`}
					key='return'
					disabled={!!orderItem.cancellation}
				>
					<ReturnPanel entryId={orderItem._id} returnData={orderItem.return} setOrderItemData={updateOrderItemData} />
				</Collapse.Panel>

				<Collapse.Panel
					header={`Cancellation ${orderItem.return ? "(Disabled as Return is initiated)" : ""}`}
					key='cancel'
					disabled={!!orderItem.return}
				>
					<CancelPanel
						entryId={orderItem._id}
						cancelData={orderItem.cancellation}
						setOrderItemData={updateOrderItemData}
					/>
				</Collapse.Panel>
				<Collapse.Panel header='Internal Comments' key='comment'>
					<Col span={24}>
						<CommentsList type='OrderItem' id={orderItem?._id} />
					</Col>
				</Collapse.Panel>
			</Collapse>
		</Drawer>
	);
};

export default OrderItemDrawer;
