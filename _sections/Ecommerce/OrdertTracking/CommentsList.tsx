import { commentApi } from "@api/ecommerceApi";
import { Comments } from "@customTypes/ecommerceTypes";
import User from "@customTypes/userType";
import fetcher from "@utils/fetcher";
import { getLocalStorageValue } from "@utils/storageUtils";
import { Button, Col, Comment, Form, Input, List, notification, Row, Typography } from "antd";
import { useForm } from "antd/lib/form/Form";
import React, { useEffect, useState } from "react";

const { Text } = Typography;

const EditComment: React.FC<{ comment: Comments; onDeleteDone: (id: string) => void }> = ({
	comment,
	onDeleteDone,
}) => {
	const [edit, setEdit] = useState(false);
	const [editableComment, setEditableComment] = useState(comment);

	const onEdit = () => {
		setEdit(prevState => !prevState);
	};

	const authorName = `${editableComment?.user?.profile?.name} - ${editableComment?.user?.email}`;

	const onDelete = async () => {
		const endPoint = `${commentApi()}/${comment._id}`;

		try {
			const response = await fetcher({ endPoint, method: "DELETE" });
			if (response.statusCode <= 300) {
				setEditableComment(undefined);
				onDeleteDone(comment._id);
			}
		} catch (e) {
			notification.error({ message: "Failed to delete comment" });
		}
	};

	const actions = [
		<Button key='edit' onClick={onEdit} type='link'>
			Edit
		</Button>,
		<Button key='delete' onClick={onDelete} type='link'>
			Delete
		</Button>,
	];

	const onComplete = async data => {
		const endPoint = `${commentApi()}/${comment._id}`;

		const body = {
			resourceType: comment.resourceType,
			resourceId: comment.resourceId,
			text: data.text,
		};

		try {
			const response = await fetcher({ endPoint: endPoint, method: "PUT", body: body });
			if (response.statusCode <= 300) {
				setEditableComment(response.data);
				setEdit(false);
			}
		} catch (e) {
			notification.error({ message: "Failed to edit comment" });
		}
	};

	return editableComment ? (
		<>
			{edit ? (
				<Form initialValues={editableComment} onFinish={onComplete} labelCol={{ span: 24 }}>
					<Form.Item name='text' label='Comment' rules={[{ required: true }]}>
						<Input />
					</Form.Item>
					<Form.Item>
						<Row justify='end'>
							<Button htmlType='submit' type='primary'>
								Save
							</Button>
						</Row>
					</Form.Item>
				</Form>
			) : (
				<Comment actions={actions} author={authorName} content={editableComment?.text} />
			)}
		</>
	) : null;
};

interface CommentsList {
	id: string;
	type: "Order" | "OrderItem";
}

const CommentsList: React.FC<CommentsList> = ({ id, type }) => {
	const [comments, setComments] = useState<Comments[]>([]);
	const [form] = useForm();
	const [user, setUser] = useState<Partial<User>>({});

	useEffect(() => {
		const localUser = getLocalStorageValue("authVerification");
		setUser(localUser);
	}, []);

	const saveComment = async data => {
		const endPoint = commentApi();
		const body = {
			resourceType: type,
			resourceId: id,
			text: data.text,
		};

		try {
			const response = await fetcher({ endPoint: endPoint, method: "POST", body });
			if (response.statusCode <= 300) {
				setComments([
					...comments,
					{
						...response.data,
						user: {
							email: user?.email,
							profile: { name: user?.name },
						},
					},
				]);
				form.setFieldsValue({ text: "" });
			} else throw new Error();
		} catch (e) {
			notification.error({ message: "Failed to save Comment" });
		}
	};

	const fetchComments = async () => {
		const endPoint = `${commentApi()}?resourceType=${type}&resourceId=${id}`;

		try {
			const response = await fetcher({ endPoint, method: "GET" });
			if (response.statusCode <= 300) {
				setComments(response.data.comments);
			} else {
				throw new Error();
			}
		} catch (e) {
			notification.error({ message: "Failed to fetch Comments" });
		}
	};

	const onDeleteDone = (id: string) => {
		setComments(
			comments.filter(item => {
				return item._id !== id;
			})
		);
	};

	useEffect(() => {
		fetchComments();
	}, []);

	return (
		<Row>
			<Col span={24}>
				<List
					header={<Text strong>Internal Comments</Text>}
					dataSource={comments}
					locale={{ emptyText: "No Comments" }}
					renderItem={comment => {
						return <EditComment onDeleteDone={onDeleteDone} comment={comment} />;
					}}
				/>
			</Col>
			<Col span={24}>
				<Form
					form={form}
					onFinish={saveComment}
					labelCol={{ span: 24 }}
					validateMessages={{ required: "'${label}' is required!" }}
				>
					<Form.Item name='text' label='Comment' rules={[{ required: true }]}>
						<Input />
					</Form.Item>
					<Form.Item>
						<Row justify='end'>
							<Button htmlType='submit' type='primary'>
								Add Comment
							</Button>
						</Row>
					</Form.Item>
				</Form>
			</Col>
		</Row>
	);
};

export default CommentsList;
