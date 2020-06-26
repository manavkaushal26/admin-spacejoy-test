import { editDesignApi } from "@api/pipelineApi";
import Image from "@components/Image";
import ImageDisplayModal from "@components/ImageDisplayModal";
import {
	DesignerImageComments,
	DesignImagesInterface,
	DesignImgTypes,
	DetailedDesign,
} from "@customTypes/dashboardTypes";
import { CustomDiv } from "@sections/Dashboard/styled";
import { getValueSafely } from "@utils/commonUtils";
import fetcher from "@utils/fetcher";
import { Button, Col, Input, message, Row, Typography } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { StepDiv } from "../styled";
import ImageCommentDrawer from "./Components/ImageCommentsDrawer";

const { Text } = Typography;

interface DesignFinalization {
	designData: DetailedDesign;
	setDesignData: React.Dispatch<React.SetStateAction<DetailedDesign>>;
}

const DesignFinalization: React.FC<DesignFinalization> = ({ designData, setDesignData }) => {
	const [designerNote, setDesignerNote] = useState<string>(null);
	const [designImages, setDesignImages] = useState<DesignImagesInterface[]>([]);
	const [imageId, setImageId] = useState<string>(null);

	const [preview, setPreview] = useState({
		previewImage: "",
		previewVisible: false,
		cdn: false,
	});

	const handleCancel = (): void => {
		setPreview({
			previewImage: "",
			previewVisible: false,
			cdn: false,
		});
	};

	useEffect(() => {
		if (designData) {
			const filteredImages = designData.designImages.filter(image => {
				return image.imgType !== DesignImgTypes.Floorplan;
			});
			setDesignImages(filteredImages);
		}
	}, [designData.designImages]);

	useEffect(() => {
		if (designData) {
			setDesignerNote(designData.description);
		}
	}, [designData.description]);

	const handleTextChange = (e): void => {
		const {
			target: { value },
		} = e;
		setDesignerNote(value);
	};

	const selectedImageComments: DesignerImageComments[] = useMemo(() => {
		return getValueSafely(
			() => [
				...designImages.find(image => {
					return image._id === imageId;
				}).comments,
			],
			[]
		);
	}, [imageId, designImages]);

	const setImageComments = (comments: DesignerImageComments[]): void => {
		const selectedDesignIndex = designImages.map(image => image._id).indexOf(imageId);
		designImages[selectedDesignIndex].comments = comments;
		setDesignImages([...designImages]);
	};

	const saveDesignerNote = async (): Promise<void> => {
		const endpoint = editDesignApi(designData._id);

		const response = await fetcher({
			endPoint: endpoint,
			method: "PUT",
			body: {
				data: {
					description: designerNote,
				},
			},
		});
		if (response.statusCode <= 300) {
			setDesignData(response.data);
			message.success("Description Added successfully");
		} else {
			message.error(response.message);
		}
	};

	const previewImage = (cdn): void => {
		setPreview({
			previewImage: cdn,
			previewVisible: true,
			cdn: true,
		});
	};

	return (
		<StepDiv>
			<Row gutter={[8, 8]}>
				<Col>
					<Row gutter={[4, 4]}>
						<Col span={24}>
							<Text strong>Description</Text>
						</Col>
						<Col span={24}>
							<Text>
								Please Review the uploaded render images. Remarks for each image can be left as comments on that
								particular image. If there is any revision required for the images please use the <b>Send back</b>{" "}
								button to send it back to the render phase. Mark this step as complete once these tasks are done.
							</Text>
						</Col>
					</Row>
				</Col>
				<Col>
					<Row gutter={[4, 4]}>
						{designImages.map(image => {
							return (
								<Col key={image._id} sm={24} md={12} lg={8}>
									<Row>
										<Col span={24}>
											<Image
												width="100%"
												onClick={(): void => {
													previewImage(image.cdn);
												}}
												src={`q_80,w_400/${image.cdn}`}
											/>
										</Col>
										<Col span={24}>
											<CustomDiv>
												<Button onClick={(): void => setImageId(image._id)} block>
													Add Comments
												</Button>
											</CustomDiv>
										</Col>
									</Row>
								</Col>
							);
						})}
					</Row>
				</Col>
				<ImageCommentDrawer
					setImageId={setImageId}
					imageId={imageId}
					designId={designData._id}
					imageComments={selectedImageComments}
					setImageComments={setImageComments}
				/>

				<Col span={24}>
					<Row>
						<Col span={24}>
							<Text strong>Design Note</Text>
						</Col>
						<Col span={24}>
							<Input.TextArea
								style={{ marginBottom: "1rem" }}
								value={designerNote}
								autoSize={{ minRows: 2 }}
								onChange={handleTextChange}
							/>
						</Col>
						<Col span={24}>
							<Button onClick={saveDesignerNote}>Add Description</Button>
						</Col>
					</Row>
				</Col>
			</Row>
			<ImageDisplayModal
				previewImage={preview.previewImage}
				cdn={preview.cdn}
				previewVisible={preview.previewVisible}
				handleCancel={handleCancel}
				altText="Render Image"
			/>
		</StepDiv>
	);
};

export default DesignFinalization;
