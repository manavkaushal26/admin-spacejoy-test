import { commentApi } from "@api/ecommerceApi";
import { Comments } from "@customTypes/ecommerceTypes";
import User from "@customTypes/userType";
import fetcher from "@utils/fetcher";
import { getLocalStorageValue } from "@utils/storageUtils";
import { Button, Col, Comment, Form, Input, List, notification, Row, Typography } from "antd";
import { useForm } from "antd/lib/form/Form";
import moment from "moment";
import React, { useEffect, useState } from "react";

const { Text } = Typography;

const EditComment: React.FC<{ comment: Comments; onDeleteDone: (id: string) => void; localUser: Partial<User> }> = ({
	comment,
	onDeleteDone,
}) => {
	const [edit, setEdit] = useState(false);
	const [editableComment, setEditableComment] = useState(comment);
	const [loading, setLoading] = useState(false);

	const onEdit = () => {
		setEdit(prevState => !prevState);
	};

	const authorName = `${editableComment?.user?.profile?.name} - ${editableComment?.user?.email}`;

	const onDelete = async () => {
		setLoading(true);
		const endPoint = `${commentApi()}/${comment._id}`;

		try {
			const response = await fetcher({ endPoint, method: "DELETE" });
			if (response.statusCode <= 300) {
				onDeleteDone(comment._id);
			}
		} catch (e) {
			notification.error({ message: "Failed to delete comment" });
		}
		setLoading(false);
	};

	const actions = [
		<Button key='edit' onClick={onEdit} type='link'>
			Edit
		</Button>,
		<Button loading={loading} key='delete' onClick={onDelete} type='link'>
			Delete
		</Button>,
	];

	const onComplete = async data => {
		setLoading(true);
		const endPoint = `${commentApi()}/${comment._id}`;

		const body = {
			resourceId: comment.resourceId,
			text: data.text,
		};

		try {
			const response = await fetcher({ endPoint: endPoint, method: "PUT", body: body });
			if (response.statusCode <= 300) {
				setEditableComment({ ...response.data, user: comment.user });
				setEdit(false);
			}
		} catch (e) {
			notification.error({ message: "Failed to edit comment" });
		}
		setLoading(false);
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
							<Button loading={loading} htmlType='submit' type='primary'>
								Save
							</Button>
						</Row>
					</Form.Item>
				</Form>
			) : (
				<Comment
					actions={actions}
					author={authorName}
					content={editableComment?.text}
					datetime={moment(editableComment?.updatedAt).fromNow()}
				/>
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
	const [loading, setLoading] = useState<boolean>(false);
	useEffect(() => {
		const localUser = getLocalStorageValue("authVerification");
		setUser(localUser);
	}, []);

	const saveComment = async data => {
		setLoading(true);
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
		setLoading(false);
	};

	const fetchComments = async () => {
		const endPoint = `${commentApi()}?resourceId=${id}`;

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
		if (id) fetchComments();
	}, [id]);
	return (
		<Row>
			<Col span={24}>
				<List
					size='small'
					header={<Text strong>Internal Comments</Text>}
					dataSource={comments}
					locale={{ emptyText: "No Comments" }}
					renderItem={comment => {
						return <EditComment localUser={user} onDeleteDone={onDeleteDone} comment={comment} />;
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
					<Form.Item name='text' label='Your comment' rules={[{ required: true }]}>
						<Input />
					</Form.Item>
					<Form.Item>
						<Row justify='end'>
							<Button loading={loading} htmlType='submit' type='primary'>
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
