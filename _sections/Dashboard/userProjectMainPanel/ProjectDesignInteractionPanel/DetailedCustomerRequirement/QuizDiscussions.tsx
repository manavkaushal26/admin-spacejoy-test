import React, { useState, useEffect } from "react";
import { Row, Upload, Col, Button, Form, notification, Comment, List, Card, Typography, Modal } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { UploadFile } from "antd/lib/upload/interface";
import { PaddedDiv } from "@sections/Header/styled";
import fetcher from "@utils/fetcher";
import ImageDisplayModal from "@components/ImageDisplayModal";
import { QuizDiscussion } from "@customTypes/dashboardTypes";
import { getQuizDiscussions } from "@api/quizApi";
import moment from "moment";
import { BiggerButtonCarousel } from "@sections/Dashboard/styled";
import Image from "@components/Image";
import { SizeAdjustedModal } from "@sections/AssetStore/styled";
import { getLocalStorageValue } from "@utils/storageUtils";
import User from "@customTypes/userType";
import { getValueSafely } from "@utils/commonUtils";

const { Text } = Typography;

interface QuizDiscussions {
	projectId: string;
}

const DiscussionView = ({ quizDiscussions }: { quizDiscussions: QuizDiscussion[] }): JSX.Element => {
	const [visible, setVisible] = useState<boolean>(false);
	const [viewImages, setImages] = useState<string[]>([]);

	const openImages = (images?: string[]): void => {
		if (images) {
			setImages(images);
			setVisible(true);
		} else {
			setImages([]);
			setVisible(false);
		}
	};

	return (
		<>
			<List
				itemLayout="horizontal"
				dataSource={quizDiscussions}
				renderItem={(item: QuizDiscussion): JSX.Element => (
					<li>
						<Comment
							actions={
								item?.images?.length !== 0
									? [
											<span key="view">
												<Text>
													<Button
														onClick={(): void => openImages(item.images)}
														style={{ padding: "0px" }}
														size="small"
														type="link"
													>
														<small>View Photos</small>
													</Button>
												</Text>
											</span>,
									  ]
									: []
							}
							author={`${item.user?.profile?.firstName}`}
							content={item.comments}
							datetime={moment(item.createdAt).fromNow()}
						/>
					</li>
				)}
			/>
			<SizeAdjustedModal
				style={{ top: "20px" }}
				visible={visible}
				onCancel={(): void => openImages()}
				footer={(): JSX.Element => <></>}
			>
				<BiggerButtonCarousel autoplay>
					{viewImages.map(image => (
						<div key={image}>
							<Image nolazy width="100%" src={image} />
						</div>
					))}
				</BiggerButtonCarousel>
			</SizeAdjustedModal>
		</>
	);
};

const QuizDiscussions: React.FC<QuizDiscussions> = ({ projectId }) => {
	const [quizDiscussions, setQuizDiscussions] = useState<QuizDiscussion[]>([]);

	const [fileList, setFileList] = useState([]);
	const [comment, setComment] = useState("");
	const [loading, setLoading] = useState<boolean>(false);

	const fetchAndPopulateQuizDiscussion = async (): Promise<void> => {
		const endPoint = getQuizDiscussions(projectId);
		try {
			const response = await fetcher({
				endPoint,
				method: "GET",
			});
			if (response) {
				setQuizDiscussions(response);
			} else {
				notification.error({ message: "Failed to fetch discussions" });
			}
		} catch (_e) {
			notification.error({ message: "Failed to fetch discussions" });
		}
	};

	const authVerification: User = getLocalStorageValue("authVerification");

	useEffect(() => {
		fetchAndPopulateQuizDiscussion();
	}, [projectId]);

	const onRemove = (file): void => {
		setFileList(prevFileList => {
			const index = prevFileList.indexOf(file);
			const newFileList = prevFileList.slice();
			newFileList.splice(index, 1);
			return newFileList;
		});
	};

	const beforeUpload = (file): boolean => {
		setFileList(prevFileList => [...prevFileList, file]);
		return false;
	};

	const clearComment = (): void => {
		setComment("");
		setFileList([]);
	};

	const handleUpload = async (): Promise<void> => {
		if (comment !== "") {
			const endPoint = getQuizDiscussions(projectId);
			setLoading(true);
			const formData = new FormData();
			fileList.forEach(file => {
				formData.append("files", file, file.fileName);
			});

			formData.append("comments", comment);
			formData.append("type", "quiz");

			const response = await fetcher({
				isMultipartForm: true,
				endPoint,
				method: "POST",
				body: formData,
			});
			setQuizDiscussions(prevDiscussions => [
				...prevDiscussions,
				{
					...response,
					user: {
						profile: { firstName: getValueSafely(() => authVerification.name.split(" ")[0], "Unknown") },
					},
				},
			]);
			clearComment();

			setLoading(false);
		}
	};

	const onChange = (e): void => {
		const {
			target: { value },
		} = e;
		setComment(value);
	};

	return (
		<Row gutter={[8, 8]}>
			<Col>
				<Card size="small">
					<DiscussionView quizDiscussions={quizDiscussions} />
				</Card>
			</Col>
			<Col>
				<Row gutter={[8, 8]}>
					<Col span={24}>
						<TextArea placeholder="Enter comment" value={comment} onChange={onChange} />
					</Col>
					<Col span={24}>
						<Row type="flex" justify="space-between">
							<Col md={20}>
								<Upload
									multiple
									className="upload-list-inline"
									listType="picture"
									beforeUpload={beforeUpload}
									onRemove={onRemove}
									accept="image/*"
								>
									<Button size="default">Select Images</Button>
								</Upload>
							</Col>
							<Col>
								<Button disabled={comment.length === 0} loading={loading} type="primary" onClick={handleUpload}>
									Save
								</Button>
							</Col>
						</Row>
					</Col>
				</Row>
			</Col>
		</Row>
	);
};

export default QuizDiscussions;
