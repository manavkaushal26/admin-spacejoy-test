import { OrderItems as OrderItem } from "@customTypes/ecommerceTypes";
import { Col, Collapse, Drawer, Row, Typography } from "antd";
import React, { useState } from "react";
import CancelPanel from "./CancelPanel";
import CommentPanel from "./CommentPanel";
import ReturnPanel from "./ReturnPanel";
import TrackingPanel from "./TrackingPanel";

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
			<Collapse activeKey={activeCollapseKey} onChange={onKeyChange}>
				<Collapse.Panel header='Tracking' key='tracking'>
					<TrackingPanel
						orderItemId={orderItem.orderItemId}
						trackingData={orderItem.tracking}
						entryId={orderItem._id}
						setOrderItemData={updateOrderItemData}
					/>
				</Collapse.Panel>
				<Collapse.Panel header='Status Updates' key='comments'>
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
