import { getQuizDiscussions } from "@api/quizApi";
import Image from "@components/Image";
import { QuizDiscussion } from "@customTypes/dashboardTypes";
import User from "@customTypes/userType";
import { SizeAdjustedModal } from "@sections/AssetStore/styled";
import { BiggerButtonCarousel } from "@sections/Dashboard/styled";
import { getValueSafely, stringToUrl } from "@utils/commonUtils";
import fetcher from "@utils/fetcher";
import { getLocalStorageValue } from "@utils/storageUtils";
import { Button, Card, Col, Comment, List, notification, Row, Typography, Upload } from "antd";
import TextArea from "antd/lib/input/TextArea";
import parse from "html-react-parser";
import moment from "moment-timezone";
import React, { useEffect, useState } from "react";

const { Text } = Typography;

interface QuizDiscussions {
	projectId: string;
}

const DiscussionView = ({
	quizDiscussions,
	deleteQuizDiscussions,
}: {
	quizDiscussions: QuizDiscussion[];
	deleteQuizDiscussions: (id: string) => Promise<void>;
}): JSX.Element => {
	const [visible, setVisible] = useState<boolean>(false);
	const [viewImages, setImages] = useState<string[]>([]);

	const [loading, setLoading] = useState(false);

	const openImages = (images?: string[]): void => {
		if (images) {
			setImages(images);
			setVisible(true);
		} else {
			setImages([]);
			setVisible(false);
		}
	};

	const onDelete = async id => {
		setLoading(true);
		try {
			deleteQuizDiscussions(id);
		} catch (e) {
			notification.error({ message: "Failed to delete discussions", description: e?.message });
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<List
				itemLayout='horizontal'
				dataSource={quizDiscussions}
				renderItem={(item: QuizDiscussion): JSX.Element => {
					return (
						<li>
							<Comment
								actions={
									item?.images?.length !== 0
										? [
												<span key='view'>
													<Text>
														<Button
															onClick={(): void => openImages(item.images)}
															style={{ padding: "0px" }}
															size='small'
															type='link'
														>
															<small>View Photos</small>
														</Button>
													</Text>
												</span>,
												<Button key='delete' type='link' danger loading={loading} onClick={() => onDelete(item._id)}>
													Delete
												</Button>,
										  ]
										: [
												<Button key='delete' type='link' danger loading={loading} onClick={() => onDelete(item._id)}>
													Delete
												</Button>,
										  ]
								}
								author={`${item.user?.profile?.firstName}`}
								content={parse(stringToUrl(item.comments))}
								datetime={moment(item.createdAt).fromNow()}
							/>
						</li>
					);
				}}
			/>
			<SizeAdjustedModal
				style={{ top: "20px" }}
				visible={visible}
				onCancel={(): void => openImages()}
				footer={(): JSX.Element => <></>}
			>
				<BiggerButtonCarousel autoplay>
					{viewImages.map(image => (
						<Row key={image}>
							<Col span={24}>
								<Image preview width='100%' src={`${image}`} />
							</Col>
							<Col span={24}>
								<Row justify='center' gutter={[4, 4]}>
									<Col>
										<Text strong>Link to Image: </Text>
									</Col>
									<Col>
										<Text copyable>{image}</Text>
									</Col>
								</Row>
							</Col>
						</Row>
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
			if (response.statusCode <= 300) {
				setQuizDiscussions(response.data);
			} else {
				notification.error({ message: "Failed to fetch discussions" });
			}
		} catch (_e) {
			notification.error({ message: "Failed to fetch discussions" });
		}
	};

	const deleteQuizDiscussions = async id => {
		const endPoint = `${getQuizDiscussions(projectId)}/${id}`;

		const response = await fetcher({ endPoint, method: "DELETE" });
		if (!(response.statusCode <= 300)) {
			throw new Error(response.message || response.data.message);
		}
		setQuizDiscussions(prevState => prevState.filter(entry => entry?._id !== id));
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
					...response.data,
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
			<Col span={24}>
				<Card size='small'>
					<DiscussionView quizDiscussions={quizDiscussions} deleteQuizDiscussions={deleteQuizDiscussions} />
				</Card>
			</Col>
			<Col span={24}>
				<Row gutter={[8, 8]}>
					<Col span={24}>
						<TextArea placeholder='Enter comment' value={comment} onChange={onChange} />
					</Col>
					<Col span={24}>
						<Row justify='space-between'>
							<Col md={20}>
								<Upload
									multiple
									className='upload-list-inline'
									listType='picture'
									fileList={fileList}
									beforeUpload={beforeUpload}
									onRemove={onRemove}
									accept='image/*'
								>
									<Button>Select Images</Button>
								</Upload>
							</Col>
							<Col>
								<Button disabled={comment.length === 0} loading={loading} type='primary' onClick={handleUpload}>
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
