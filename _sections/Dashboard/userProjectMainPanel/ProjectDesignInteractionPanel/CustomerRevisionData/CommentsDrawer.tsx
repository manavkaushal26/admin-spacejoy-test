import { CapitalizedText } from "@components/CommonStyledComponents";
import { RevisionComments, RevisionForm } from "@customTypes/dashboardTypes";
import User from "@customTypes/userType";
import { AvatarColorsList } from "@utils/constants";
import { getLocalStorageValue } from "@utils/storageUtils";
import { Avatar, Button, Comment, Drawer, Form, List, Tooltip, notification, Row, Col, Typography } from "antd";
import TextArea from "antd/lib/input/TextArea";
import React, { useMemo, useState } from "react";
import { editRevisionFormAPI } from "@api/projectApi";
import moment from "moment";
import fetcher from "@utils/fetcher";

const { Text } = Typography;
interface CommentsDrawer {
	open: boolean;
	toggleDrawer: () => void;
	revisionData: RevisionForm;
	updateRevisonData: (data: RevisionForm) => void;
}

interface CommentList {
	comments: RevisionComments[];
	authors: string[];
}

const Editor = ({ onChange, onSubmit, submitting, value }): React.ReactElement => (
	<div>
		<Form.Item>
			<TextArea placeholder="Enter your message" rows={4} onChange={onChange} value={value} />
		</Form.Item>
		<Form.Item>
			<Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
				Add Comment
			</Button>
		</Form.Item>
	</div>
);

export const CommentList = ({ comments, authors }: CommentList): React.ReactElement => {
	return (
		<Row>
			<Col span={24}>
				<List
					dataSource={comments}
					itemLayout="vertical"
					renderItem={(comment: RevisionComments): React.ReactNode => {
						return comment?.text ? (
							<Comment
								author={comment.authorName}
								datetime={
									<Tooltip title={moment(comment.submittedOn).format("MM-DD-YYYY hh:mm a")}>
										<Text>{moment(comment.submittedOn).fromNow()}</Text>
									</Tooltip>
								}
								avatar={
									<Avatar
										style={{ backgroundColor: AvatarColorsList[authors.indexOf(comment.authorName) % authors.length] }}
									>
										{comment.authorName[0]}
									</Avatar>
								}
								content={comment.text}
							/>
						) : (
							<></>
						);
					}}
				/>
			</Col>
		</Row>
	);
};

const CommentsDrawer: React.FC<CommentsDrawer> = ({ open, toggleDrawer, revisionData, updateRevisonData }) => {
	const [newComment, setNewComment] = useState<string>(null);
	const [loading, setLoading] = useState<boolean>(false);

	const authVerification: User = useMemo(() => getLocalStorageValue("authVerification"), []);

	const authors = useMemo(() => Array.from(new Set(revisionData.comments.map(comment => comment.authorName))), [
		revisionData,
	]);

	const handleChange = (e): void => {
		const {
			target: { value },
		} = e;
		setNewComment(value);
	};

	const addComment = async (): Promise<void> => {
		setLoading(true);
		const endPoint = editRevisionFormAPI(revisionData.project);

		const body = {
			comments: [{ text: newComment }],
		};
		try {
			const response = await fetcher({ endPoint, method: "PUT", body });
			if (response.statusCode <= 300) {
				updateRevisonData({
					...revisionData,
					comments: response.data.comments,
				});
				setNewComment(null);
			}
		} catch (e) {
			notification.error({ message: "Failed to add comment" });
		}
		setLoading(false);
	};

	return (
		<Drawer visible={open} width={360} onClose={toggleDrawer} title="Customer Communication">
			<CommentList comments={revisionData.comments} authors={authors} />
			{/* <Comment
				avatar={
					<Avatar style={{ backgroundColor: AvatarColorsList[authors.indexOf(authVerification.name)], color: "white" }}>
						<CapitalizedText>{authVerification.name[0]}</CapitalizedText>
					</Avatar>
				}
				content={<Editor onSubmit={addComment} submitting={loading} value={newComment} onChange={handleChange} />}
			/> */}
		</Drawer>
	);
};

export default CommentsDrawer;
