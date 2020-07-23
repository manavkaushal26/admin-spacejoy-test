import { getOrderItemApi } from "@api/ecommerceApi";
import { OrderItems, Tracking } from "@customTypes/ecommerceTypes";
import fetcher from "@utils/fetcher";
import { Button, Card, Col, Form, Input, notification, Row, Spin, Typography } from "antd";
import React, { useState } from "react";

const { Text, Link } = Typography;

interface TrackingPanel {
	trackingData: Tracking;
	orderItemId: string;
	entryId: string;
	setOrderItemData: (data: Partial<OrderItems>) => void;
}

const TrackingPanel: React.FC<TrackingPanel> = ({ trackingData, orderItemId, entryId, setOrderItemData }) => {
	const [loading, setLoading] = useState<boolean>(false);
	const [form] = Form.useForm();
	const onFinish = async formData => {
		setLoading(true);
		const endPoint = `${getOrderItemApi(entryId)}/orderItemTrackings`;

		try {
			const response = await fetcher({ endPoint, method: trackingData ? "PUT" : "POST", body: formData });
			if (response.statusCode <= 300) {
				setOrderItemData({ tracking: response.data });
				form.setFieldsValue({ vendor: "", trackingNumber: "", trackingUrl: "", orderItem: orderItemId });
			} else {
				throw new Error();
			}
		} catch (e) {
			notification.error({ message: "Failed to update Tracking data" });
		}
		setLoading(false);
	};

	return (
		<Spin spinning={loading}>
			<Row gutter={[8, 16]}>
				<Col span={24}>
					{trackingData ? (
						<Row gutter={[4, 8]}>
							<Col span={24}>
								<Row gutter={[4, 4]}>
									<Col span={24}>
										<Text strong>Vendor</Text>
									</Col>
									<Col span={24}>{trackingData.vendor}</Col>
								</Row>
							</Col>
							<Col span={24}>
								<Row>
									<Col span={24}>
										<Text strong>Tracking Number</Text>
									</Col>
									<Col span={24}>
										<Link target='_blank' href={trackingData.trackingUrl} rel='nofollow noreferrer noopener'>
											{trackingData.trackingNumber}
										</Link>
									</Col>
								</Row>
							</Col>
						</Row>
					) : (
						<Text strong>Tracking Data not available</Text>
					)}
				</Col>
				<Col span={24}>
					<Card size='small' title='Update tracking data'>
						<Form
							form={form}
							initialValues={{ vendor: "", trackingNumber: "", trackingUrl: "", orderItem: orderItemId }}
							labelCol={{ span: 24 }}
							onFinish={onFinish}
						>
							<Form.Item label='Courier Name' name='vendor' rules={[{ required: true }]}>
								<Input />
							</Form.Item>
							<Form.Item label='Tracking Number' name='trackingNumber' rules={[{ required: true }]}>
								<Input />
							</Form.Item>
							<Form.Item label='Tracking Url' name='trackingUrl' rules={[{ required: true }]}>
								<Input type='url' />
							</Form.Item>
							<Form.Item label='Order Item Id' name='orderItem' hidden rules={[{ required: true }]}>
								<Input disabled />
							</Form.Item>
							<Form.Item>
								<Button htmlType='submit' type='primary'>
									Save
								</Button>
							</Form.Item>
						</Form>
					</Card>
				</Col>
			</Row>
		</Spin>
	);
};

export default TrackingPanel;
