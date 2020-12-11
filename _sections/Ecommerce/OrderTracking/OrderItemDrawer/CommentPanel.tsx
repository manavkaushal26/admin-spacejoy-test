import { getOrderItemApi } from "@api/ecommerceApi";
import { OrderItemComments, OrderItems, OrderItemStatus, OrderItemStatuses } from "@customTypes/ecommerceTypes";
import fetcher from "@utils/fetcher";
import { Button, Card, Col, Comment, Form, Input, List, notification, Row, Select, Spin, Typography } from "antd";
import moment from "moment";
import React, { useState } from "react";

const { Text } = Typography;

interface CommentPanel {
	commentData: OrderItemComments[];
	entryId: string;
	setOrderItemData: (data: Partial<OrderItems>) => void;
	orderItemStatus: OrderItemStatuses;
}

interface EditableComment {
	quote: string;
	description: string;
	updatedAt: string;
	actions: JSX.Element[];
	commentId: string;
	idOfEditingComment: string;
	completeEditing: () => void;
	orderItemId: string;
	status: OrderItemStatuses;
}

const EditableComment: React.FC<EditableComment> = ({
	commentId,
	quote,
	description,
	updatedAt,
	idOfEditingComment,
	completeEditing,
	actions,
	orderItemId,
	status: orderItemStatus,
}) => {
	const [comment, setComment] = useState({ quote, description, updatedAt, orderItemId, orderItemStatus });

	const onFinish = async data => {
		const endPoint = `${getOrderItemApi(orderItemId)}/orderItemComments/${commentId}`;
		try {
			const response = await fetcher({ endPoint, method: "PUT", body: data });
			if (response.statusCode <= 300) {
				setComment(data);
				completeEditing();
			} else {
				throw new Error();
			}
		} catch (e) {
			notification.error({ message: "Failed to Save comment" });
		}
	};

	return idOfEditingComment !== commentId ? (
		<Comment
			actions={actions}
			author={`Status: ${OrderItemStatus[comment.orderItemStatus]}`}
			content={
				<Row>
					<Col span={24}>
						<Text>{comment.quote}</Text>
					</Col>
					<Col span={24}>
						<Text type='secondary'>
							<small>{comment.description}</small>
						</Text>
					</Col>
				</Row>
			}
			datetime={updatedAt}
		/>
	) : (
		<Form
			initialValues={{ quote: comment.quote, description: comment.description, status: comment?.orderItemStatus }}
			labelCol={{ span: 24 }}
			onFinish={onFinish}
		>
			<Form.Item label='Quote' name='quote' rules={[{ required: true }]}>
				<Input />
			</Form.Item>
			<Form.Item label='Description' name='description'>
				<Input />
			</Form.Item>
			<Form.Item label='Status' name='orderItemStatus'>
				<Select>
					{Object.keys(OrderItemStatuses)
						.filter((_, index) => index < 11)
						.map(key => {
							return (
								<Select.Option key={key} value={key}>
									{OrderItemStatus[key]}
								</Select.Option>
							);
						})}
				</Select>
			</Form.Item>
			<Form.Item>
				<Row gutter={[4, 4]}>
					<Col>
						<Button htmlType='submit' type='primary'>
							Save
						</Button>
					</Col>
					<Col>
						<Button htmlType='button' onClick={completeEditing}>
							Cancel
						</Button>
					</Col>
				</Row>
			</Form.Item>
		</Form>
	);
};

const CommentPanel: React.FC<CommentPanel> = ({ entryId, commentData, setOrderItemData, orderItemStatus }) => {
	const [loading, setLoading] = useState(false);
	const [idOfEditingComment, setIdOfEditingComment] = useState<string>("");

	const [form] = Form.useForm();

	const onFinish = async formData => {
		setLoading(true);
		const endPoint = `${getOrderItemApi(entryId)}/orderItemComments`;

		try {
			const response = await fetcher({ endPoint, method: "POST", body: formData });
			if (response.statusCode < 300) {
				setOrderItemData({ comments: [...commentData, response.data] });
				const { setFieldsValue } = form;
				setFieldsValue({ quote: "", description: "" });
			} else {
				throw new Error();
			}
		} catch (e) {
			notification.error({ message: "Failed to post comment" });
		}
		setLoading(false);
	};

	const completeEditing = (id?: string) => {
		setIdOfEditingComment(id);
	};

	return (
		<Spin spinning={loading}>
			<Row gutter={[8, 16]}>
				<Col span={24}>
					<List
						dataSource={commentData}
						renderItem={(item: OrderItemComments) => {
							return (
								<li>
									<EditableComment
										commentId={item._id}
										actions={[
											<a type='link' key='edit' onClick={() => completeEditing(item._id)}>
												<small>Edit</small>
											</a>,
										]}
										quote={item.quote}
										description={item.description}
										updatedAt={moment(item.createdAt).fromNow()}
										idOfEditingComment={idOfEditingComment}
										completeEditing={completeEditing}
										orderItemId={entryId}
										status={item?.orderItemStatus}
									/>
								</li>
							);
						}}
					/>
				</Col>
				<Col span={24}>
					<Card size='small' title='Update status'>
						<Form
							initialValues={{ quote: "", description: "", orderItemStatus: orderItemStatus }}
							labelCol={{ span: 24 }}
							form={form}
							onFinish={onFinish}
						>
							<Form.Item label='Update' name='quote' rules={[{ required: true }]}>
								<Input />
							</Form.Item>
							<Form.Item label='Description' name='description'>
								<Input />
							</Form.Item>
							<Form.Item label='Status' name='orderItemStatus' rules={[{ required: true }]}>
								<Select>
									{Object.keys(OrderItemStatuses)
										.filter((_, index) => index < 11)
										.map(key => {
											return (
												<Select.Option key={key} value={key}>
													{OrderItemStatus[key]}
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
					</Card>
				</Col>
			</Row>
		</Spin>
	);
};

export default CommentPanel;
