import React, { useState, useRef, useEffect, useMemo } from "react";
import { StepDiv } from "../styled";
import { CustomDiv } from "@sections/Dashboard/styled";
import { editDesignApi } from "@api/pipelineApi";
import fetcher from "@utils/fetcher";
import {
	DetailedDesign,
	DesignerImageComments,
	DesignImagesInterface,
	DesignImgTypes
} from "@customTypes/dashboardTypes";
import { Typography, message, Input, Button } from "antd";
import ImageCommentDrawer from "./Components/ImageCommentsDrawer";
import { getValueSafely } from "@utils/commonUtils";
import Image from "@components/Image";
import styled from "styled-components";
import ImageDisplayModal from "./Components/ImageDisplayModal";

const { Text } = Typography;

interface DesignFinalization {
	designDataCopy: DetailedDesign;
	setDesignDataCopy: React.Dispatch<React.SetStateAction<DetailedDesign>>;
}

const LastChildJustifiedStartCustomDiv = styled(CustomDiv)`
	div:nth-last-child(1):nth-child(odd) {
		justify-self: flex-start;
	}
`;

const DesignFinalization: React.FC<DesignFinalization> = ({ designDataCopy, setDesignDataCopy }) => {
	const [designerNote, setDesignerNote] = useState<string>(null);
	const [designImages, setDesignImages] = useState<DesignImagesInterface[]>([]);
	const [imageId, setImageId] = useState<string>(null);

	const [preview, setPreview] = useState({
		previewImage: "",
		previewVisible: false,
		cdn: false
	});

	const handleCancel = () => {
		setPreview({
			previewImage: "",
			previewVisible: false,
			cdn: false
		});
	};

	useEffect(() => {
		if (designDataCopy) {
			const filteredImages = designDataCopy.designImages.filter(image => {
				return image.imgType !== DesignImgTypes.Floorplan;
			});
			setDesignImages(filteredImages);
		}
	}, [designDataCopy.designImages]);

	useEffect(() => {
		if (designDataCopy) {
			setDesignerNote(designDataCopy.description);
		}
	}, [designDataCopy.description]);

	const handleTextChange = e => {
		const {
			target: { value }
		} = e;
		setDesignerNote(value);
	};

	const selectedImageComments: DesignerImageComments[] = useMemo(() => {
		return getValueSafely(
			() => [
				...designImages.find(image => {
					return image._id === imageId;
				}).comments
			],
			[]
		);
	}, [imageId, designImages]);

	const setImageComments = (comments: DesignerImageComments[]): void => {
		const selectedDesignIndex = designImages.map(image => image._id).indexOf(imageId);
		designImages[selectedDesignIndex].comments = comments;
		setDesignImages([...designImages]);
	};

	const saveDesignerNote = async () => {
		const endpoint = editDesignApi(designDataCopy._id);

		const data = await fetcher({
			endPoint: endpoint,
			method: "PUT",
			body: {
				data: {
					description: designerNote
				}
			}
		});
		if (data.status !== "error") {
			setDesignDataCopy(data.data);
			message.success("Description Added successfully");
		} else {
			message.error(data.message);
		}
	};

	const ref = useRef(null);

	useEffect(() => {
		ref.current.scrollIntoView({ behavior: "smooth" });
	}, []);

	const previewImage = cdn => {
		setPreview({
			previewImage: cdn,
			previewVisible: true,
			cdn: true
		});
	};

	return (
		<StepDiv>
			<CustomDiv px="1rem" py="1rem">
				<CustomDiv pb="1rem">
					<CustomDiv>
						<Text strong>Description</Text>
					</CustomDiv>
					<CustomDiv>
						<Text>
							Please Review the uploaded render images. Remarks for each image can be left as comments on that
							particular image. If there is any revision required for the images please use the <b>Send back</b> button
							to send it back to the render phase. Mark this step as complete once these tasks are done.
						</Text>
					</CustomDiv>
				</CustomDiv>
				<CustomDiv type="flex" flexDirection="column">
					<LastChildJustifiedStartCustomDiv
						ref={ref}
						type="flex"
						justifyContent="space-evenly"
						flexWrap="wrap"
						width="100%"
					>
						{designImages.map(image => {
							return (
								<CustomDiv
									height="100%"
									type="flex"
									flexBasis="50ch"
									flexDirection="column"
									cursor="pointer"
									justifyContent="center"
									my="1rem"
								>
									<Image
										width="100%"
										onClick={() => {
											previewImage(image.cdn);
										}}
										src={`q_80,w_400/${image.cdn}`}
									/>
									<CustomDiv>
										<Button onClick={() => setImageId(image._id)} block>
											Add Comments
										</Button>
									</CustomDiv>
								</CustomDiv>
							);
						})}
					</LastChildJustifiedStartCustomDiv>
				</CustomDiv>
				<ImageCommentDrawer
					setImageId={setImageId}
					imageId={imageId}
					designId={designDataCopy._id}
					imageComments={selectedImageComments}
					setImageComments={setImageComments}
				/>

				<CustomDiv
					ref={ref}
					type="flex"
					justifyContent="space-evenly"
					flexWrap="wrap"
					flexDirection="column"
					width="100%"
					px="1rem"
					py="1rem"
				>
					<CustomDiv pb="1rem">
						<Text strong>Design Note</Text>
					</CustomDiv>
					<Input.TextArea
						style={{ marginBottom: "1rem" }}
						value={designerNote}
						autoSize={{ minRows: 2 }}
						onChange={handleTextChange}
					/>
					<Button onClick={saveDesignerNote}>Add Description</Button>
				</CustomDiv>
			</CustomDiv>
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
