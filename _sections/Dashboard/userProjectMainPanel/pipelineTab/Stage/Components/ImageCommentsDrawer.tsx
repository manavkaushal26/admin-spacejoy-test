import { DeleteTwoTone } from "@ant-design/icons";
import { addRenderImageComment } from "@api/pipelineApi";
import { DesignerImageComments } from "@customTypes/dashboardTypes";
import User, { Status } from "@customTypes/userType";
import { BorderedParagraph, CustomDiv, EndCol } from "@sections/Dashboard/styled";
import { getValueSafely } from "@utils/commonUtils";
import fetcher from "@utils/fetcher";
import { getLocalStorageValue } from "@utils/storageUtils";
import { Avatar, Button, Col, Drawer, Input, Row, Spin, Typography } from "antd";
import React, { useEffect, useState } from "react";

const { Text } = Typography;

interface ImagesCommentDrawer {
	imageId: string;
	designId: string;
	imageComments: DesignerImageComments[];
	setImageComments: (comments: DesignerImageComments[]) => void;
	setImageId: React.Dispatch<React.SetStateAction<string>>;
}

const ImageCommentDrawer: React.FC<ImagesCommentDrawer> = ({
	imageId,
	imageComments,
	designId,
	setImageComments,
	setImageId,
}) => {
	const [authVerification, setAuthVerification] = useState<User>(null);
	const [newComment, setNewComment] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		setAuthVerification(getLocalStorageValue<User>("authVerification"));
	}, []);

	const saveComment = async (): Promise<void> => {
		setLoading(true);
		const endpoint = addRenderImageComment(designId, imageId);
		const body = [...imageComments];
		await fetcher({ endPoint: endpoint, body: { data: { comments: body } }, method: "PUT" });
		setLoading(false);
	};

	useEffect(() => {
		if (imageId) saveComment();
	}, [imageId, imageComments]);

	const addNote = async (): Promise<void> => {
		const body = [...imageComments];
		const data: DesignerImageComments[] = [
			{
				author: authVerification.name,
				text: newComment,
				status: Status.pending,
			},
			...body,
		];
		await setImageComments(data);
		setNewComment("");
	};

	const onNewComment = (e): void => {
		const {
			target: { value },
		} = e;
		setNewComment(value);
	};

	const editImageComments = (id: string, value): void => {
		const modifiedImageComments = imageComments.map(comment => {
			const modComment = { ...comment };

			if (comment._id === id) {
				modComment.text = value;
				modComment.status = Status.pending;
			}
			return modComment;
		});
		setImageComments(modifiedImageComments);
	};

	const deleteImageComments = (text: string): void => {
		const modifiedImageComments = imageComments.filter(image => {
			return image.text !== text;
		});
		setImageComments(modifiedImageComments);
	};

	return (
		<Drawer width="640" visible={!!imageId} onClose={(): void => setImageId(null)}>
			<CustomDiv height="100%" width="100%">
				<Spin spinning={loading}>
					<Row align="stretch" justify="start">
						<Col span={2}>
							<CustomDiv px="12px">
								<Avatar>{getValueSafely(() => authVerification.name[0], "")}</Avatar>
							</CustomDiv>
						</Col>
						<Col span={20}>
							<Input.TextArea value={newComment} onChange={onNewComment} />
						</Col>
					</Row>
					<CustomDiv py="10px">
						<Row>
							<Col span={2} />
							<EndCol span={20}>
								<Button type="primary" onClick={addNote}>
									Add Comment
								</Button>
							</EndCol>
						</Row>
					</CustomDiv>
					{imageComments.map(comment => (
						<CustomDiv py="12px" key={getValueSafely(() => comment._id, "")}>
							<Row align="stretch" justify="start">
								<CustomDiv width="100%" inline textOverflow="ellipsis" py="16px" align="center">
									<CustomDiv textOverflow="ellipsis" inline px="12px">
										<Avatar>{getValueSafely(() => comment.author[0], "")}</Avatar>{" "}
									</CustomDiv>
									<Text strong ellipsis>
										{getValueSafely(() => comment.author, "")}
									</Text>
									{authVerification.name === comment.author && (
										<CustomDiv px="8px">
											<DeleteTwoTone onClick={(): void => deleteImageComments(comment.text)} />
										</CustomDiv>
									)}
								</CustomDiv>
							</Row>
							<Row>
								<Col span={2} />
								<Col span={20}>
									<BorderedParagraph
										editable={
											comment.author === authVerification.name
												? {
														onChange: (value: string): void => {
															editImageComments(comment._id, value);
														},
												  }
												: false
										}
									>
										{comment.text}
									</BorderedParagraph>
								</Col>
							</Row>
						</CustomDiv>
					))}
				</Spin>
			</CustomDiv>
		</Drawer>
	);
};

export default ImageCommentDrawer;
