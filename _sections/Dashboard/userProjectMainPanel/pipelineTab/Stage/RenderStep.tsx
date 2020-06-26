import { UploadOutlined } from "@ant-design/icons";
import { deleteUploadedImageApi } from "@api/designApi";
import { uploadRenderImages } from "@api/pipelineApi";
import ImageDisplayModal from "@components/ImageDisplayModal";
import { DesignImgTypes, DetailedDesign, PhaseType, RenderImgUploadTypes } from "@customTypes/dashboardTypes";
import { getBase64 } from "@utils/commonUtils";
import { cloudinary, cookieNames } from "@utils/config";
import fetcher from "@utils/fetcher";
import getCookie from "@utils/getCookie";
import { Button, Col, message, Modal, Row, Select, Typography } from "antd";
import Upload, { UploadChangeParam } from "antd/lib/upload";
import { UploadFile } from "antd/lib/upload/interface";
import React, { useEffect, useMemo, useState } from "react";
import { StepDiv } from "../styled";

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
		const endPoint = deleteUploadedImageApi(designData._id, file.uid);
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

	const confirmDelete = (file: UploadFile): boolean => {
		Modal.confirm({
			title: "Are you sure?",
			content: "This action is irreversible",
			onOk: () => deleteImage(file),
		});
		return false;
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
			<Row gutter={[4, 4]}>
				<Col>
					<Row gutter={[4, 4]}>
						<Col span={24}>
							<Text strong>Description</Text>
						</Col>
						<Col span={24}>
							<Text>
								Upload the Renders of the Room in this step. Please make sure you select appropriate type before
								uploading the image. Mark this step as complete once these tasks are done.
							</Text>
						</Col>
					</Row>
				</Col>

				<Col span={24}>
					<Row gutter={[4, 4]}>
						<Col span={24}>
							<Text strong>Image Type</Text>
						</Col>
						<Col span={24}>
							<Select value={imageType} onSelect={onSelect} style={{ width: "100%" }}>
								{Object.keys(RenderImgUploadTypes).map(key => {
									return (
										<Option key={key} value={RenderImgUploadTypes[key]}>
											{key}
										</Option>
									);
								})}
							</Select>
						</Col>
					</Row>
				</Col>
				<Col span={24}>
					<Row gutter={[4, 4]}>
						<Col span={24}>
							<Text strong>Images</Text>
						</Col>
						<Col span={24}>
							<Upload
								multiple
								supportServerRender
								name="files"
								fileList={designImagesList}
								action={uploadRenderImage}
								listType="picture-card"
								onPreview={handlePreview}
								onRemove={confirmDelete}
								onChange={handleOnFileUploadChange}
								headers={{ Authorization: getCookie(null, cookieNames.authToken) }}
								accept="image/*"
							>
								<Button>
									<UploadOutlined />
									Click to Upload
								</Button>
							</Upload>
						</Col>
					</Row>
				</Col>
			</Row>
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
