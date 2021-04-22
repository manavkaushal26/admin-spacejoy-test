import { getOrderItemApi } from "@api/ecommerceApi";
import { OrderItems, Tracking } from "@customTypes/ecommerceTypes";
import fetcher from "@utils/fetcher";
import { Button, Card, Col, Comment, Form, Input, List, notification, Row, Spin, Typography } from "antd";
import moment from "moment-timezone";
import React, { useState } from "react";
const { Text, Link } = Typography;

interface TrackingPanel {
	trackingData: Tracking[];
	orderItemId: string;
	entryId: string;
	setOrderItemData: (data: Partial<OrderItems>) => void;
}

interface EditableComment {
	tracking: Tracking;
}

const EditableComment: React.FC<EditableComment> = ({ tracking }) => {
	const [comment, setComment] = useState<Tracking>({ ...tracking });
	const [edit, setEdit] = useState(false);
	const onFinish = async data => {
		const endPoint = `${getOrderItemApi(tracking.orderItem)}/orderItemTrackings/${tracking._id}`;

		try {
			const response = await fetcher({ endPoint, method: "PUT", body: data });
			if (response.statusCode <= 300) {
				setComment(data);
				setEdit(false);
			} else {
				throw new Error();
			}
		} catch (e) {
			notification.error({ message: "Failed to Save comment" });
		}
	};

	return !edit ? (
		<Comment
			actions={[
				<a type='link' key='edit' onClick={() => setEdit(true)}>
					<small>Edit</small>
				</a>,
			]}
			author={comment.vendor}
			content={
				<Link target='_blank' href={comment.trackingUrl} rel='nofollow noreferrer noopener'>
					{comment.trackingNumber}
				</Link>
			}
			datetime={moment(comment.createdAt).fromNow()}
		/>
	) : (
		<Form
			initialValues={{
				vendor: tracking.vendor,
				trackingNumber: tracking.trackingNumber,
				trackingUrl: tracking.trackingUrl,
			}}
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
			<Form.Item>
				<Button htmlType='submit' type='primary'>
					Save
				</Button>
			</Form.Item>
		</Form>
	);
};

const TrackingPanel: React.FC<TrackingPanel> = ({ trackingData, orderItemId, entryId, setOrderItemData }) => {
	const [loading, setLoading] = useState<boolean>(false);
	const [form] = Form.useForm();

	const onFinish = async formData => {
		setLoading(true);
		const endPoint = `${getOrderItemApi(entryId)}/orderItemTrackings`;

		try {
			const response = await fetcher({ endPoint, method: "POST", body: formData });
			if (response.statusCode <= 300) {
				setOrderItemData({ tracking: [response.data, ...trackingData] });
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
						<List
							dataSource={trackingData}
							renderItem={item => {
								return <EditableComment tracking={item} />;
							}}
						/>
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
