import { OrderItems as OrderItem, OrderItemStatus } from "@customTypes/ecommerceTypes";
import { Col, Collapse, Drawer, Row, Typography, Form, Select, Button, Modal, notification } from "antd";
import React, { useState } from "react";
import CancelPanel from "./CancelPanel";
import CommentPanel from "./CommentPanel";
import ReturnPanel from "./ReturnPanel";
import TrackingPanel from "./TrackingPanel";
import { getOrderItemApi } from "@api/ecommerceApi";
import fetcher from "@utils/fetcher";

const { Text } = Typography;

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
					...response.data,
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
				<Form initialValues={{ status: orderItemData.status }} onFinish={handleFinish}>
					<Form.Item label='Status' name='status'>
						<Select>
							{Object.entries(OrderItemStatus)
								.filter((_, index) => index < 6)
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
					/>
				</Collapse.Panel>
				<Collapse.Panel
					header={`Return ${orderItem.cancel ? "(Disabled as Cancellation is initiated)" : ""}`}
					key='return'
					disabled={!!orderItem.cancel}
				>
					<ReturnPanel entryId={orderItem._id} returnData={orderItem.return} setOrderItemData={updateOrderItemData} />
				</Collapse.Panel>

				<Collapse.Panel
					header={`Cancellation ${orderItem.return ? "(Disabled as Return is initiated)" : ""}`}
					key='cancel'
					disabled={!!orderItem.return}
				>
					<CancelPanel entryId={orderItem._id} cancelData={orderItem.cancel} setOrderItemData={updateOrderItemData} />
				</Collapse.Panel>
			</Collapse>
		</Drawer>
	);
};

export default OrderItemDrawer;
