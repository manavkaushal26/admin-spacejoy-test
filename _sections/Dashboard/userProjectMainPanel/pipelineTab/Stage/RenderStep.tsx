import { deleteUploadedImage } from "@api/designApi";
import { uploadRenderImages } from "@api/pipelineApi";
import { DesignImgTypes, DetailedDesign, PhaseType, RenderImgUploadTypes } from "@customTypes/dashboardTypes";
import { CustomDiv, Form } from "@sections/Dashboard/styled";
import { getBase64 } from "@utils/commonUtils";
import { cloudinary, cookieNames } from "@utils/config";
import fetcher from "@utils/fetcher";
import getCookie from "@utils/getCookie";
import { Button, Icon, message, Select, Typography } from "antd";
import Upload, { UploadChangeParam } from "antd/lib/upload";
import { UploadFile } from "antd/lib/upload/interface";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { StepDiv } from "../styled";
import ImageDisplayModal from "./Components/ImageDisplayModal";

const { Option } = Select;
const { Text } = Typography;
interface RenderStep {
	designData: DetailedDesign;
	setDesignData: React.Dispatch<React.SetStateAction<DetailedDesign>>;
	phaseData: PhaseType;
}

const RenderStep: React.FC<RenderStep> = ({ designData, setDesignData }) => {
	const [imageType, setImageType] = useState<RenderImgUploadTypes>(RenderImgUploadTypes.Render);
	const [designImagesList, setDesignImagesList] = useState<UploadFile[]>([]);
	const [preview, setPreview] = useState<{ previewImage: string; previewVisible: boolean }>({
		previewImage: "",
		previewVisible: false,
	});

	const deleteImage = async (file: UploadFile): Promise<void> => {
		const endPoint = deleteUploadedImage(designData._id, file.uid);
		const response: {
			statusCode: number;
			data: DetailedDesign;
		} = await fetcher({ endPoint, method: "DELETE" });
		if (response.statusCode <= 300) {
			setDesignData({
				...designData,
				designImages: [...response.data.designImages],
			});
			message.success("Image deleted successfully");
		}
	};

	useEffect(() => {
		if (designData) {
			const renderImageFiles = designData.designImages.filter(image => {
				return image.imgType !== DesignImgTypes.Floorplan;
			});
			const renderImageFilesList = renderImageFiles.map(image => {
				const filename = image.path.split("/").pop();
				return {
					uid: image._id,
					name: filename,
					url: `${cloudinary.baseDeliveryURL}/image/upload/${image.cdn}`,
					size: 0,
					type: "image/*",
				};
			});

			setDesignImagesList(renderImageFilesList);
		}
	}, [designData.designImages]);

	const uploadRenderImage = useMemo(() => uploadRenderImages(designData._id, imageType), [designData._id, imageType]);

	const handleOnFileUploadChange = (info: UploadChangeParam<UploadFile>): void => {
		setDesignImagesList(info.fileList);
		if (info.file.status === "done") {
			setDesignData({
				...designData,
				designImages: [...info.file.response.data.designImages],
			});
		}
	};

	const onSelect = (selectedValue): void => {
		setImageType(selectedValue);
	};

	const ref = useRef(null);

	useEffect(() => {
		ref.current.scrollIntoView({ behavior: "smooth" });
	}, []);

	const handlePreview = async (file): Promise<void> => {
		const fileCopy = { ...file };
		if (!fileCopy.url && !fileCopy.preview) {
			fileCopy.preview = await getBase64(fileCopy.originFileObj);
		}

		setPreview({
			previewImage: fileCopy.url || fileCopy.preview,
			previewVisible: true,
		});
	};
	const handleCancel = (): void => setPreview({ previewImage: "", previewVisible: false });

	return (
		<StepDiv>
			<CustomDiv ref={ref} width="100%" px="1rem" py="1rem">
				<CustomDiv pb="1rem">
					<CustomDiv>
						<Text strong>Description</Text>
					</CustomDiv>
					<CustomDiv>
						<Text>
							Upload the Renders of the Room in this step. Please make sure you select appropriate type before uploading
							the image. Mark this step as complete once these tasks are done.
						</Text>
					</CustomDiv>
				</CustomDiv>
				<Form>
					<CustomDiv align="baseline" type="flex" flexDirection="row">
						<label>Image Type</label>
						<CustomDiv inline pl="1rem" flexBasis="15ch">
							<Select value={imageType} onSelect={onSelect} style={{ width: "100%" }}>
								{Object.keys(RenderImgUploadTypes).map(key => {
									return (
										<Option key={key} value={RenderImgUploadTypes[key]}>
											{key}
										</Option>
									);
								})}
							</Select>
						</CustomDiv>
					</CustomDiv>
					<CustomDiv width="100%" type="flex">
						<label>Images</label>
						<CustomDiv inline pl="1rem">
							<Upload
								multiple
								supportServerRender
								name="files"
								fileList={designImagesList}
								action={uploadRenderImage}
								listType="picture-card"
								onPreview={handlePreview}
								onRemove={deleteImage}
								onChange={handleOnFileUploadChange}
								headers={{ Authorization: getCookie(null, cookieNames.authToken) }}
								accept="image/*"
							>
								<Button>
									<Icon type="upload" />
									Click to Upload
								</Button>
							</Upload>
						</CustomDiv>
					</CustomDiv>
				</Form>
			</CustomDiv>
			<ImageDisplayModal
				handleCancel={handleCancel}
				previewImage={preview.previewImage}
				previewVisible={preview.previewVisible}
				altText="previewImages"
			/>
		</StepDiv>
	);
};

export default RenderStep;
