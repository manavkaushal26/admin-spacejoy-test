import { uploadRenderImages } from "@api/pipelineApi";
import { DesignImgTypes, DetailedDesign, PhaseType, RenderImgUploadTypes } from "@customTypes/dashboardTypes";
import { Status } from "@customTypes/userType";
import { CustomDiv, Form } from "@sections/Dashboard/styled";
import { getBase64, getValueSafely } from "@utils/commonUtils";
import { cloudinary, cookieNames } from "@utils/config";
import getCookie from "@utils/getCookie";
import { Button, Icon, Select, Typography, message } from "antd";
import Upload, { UploadChangeParam } from "antd/lib/upload";
import { UploadFile } from "antd/lib/upload/interface";
import { useEffect, useMemo, useRef, useState } from "react";
import { StepDiv } from "../styled";
import ImageDisplayModal from "./Components/ImageDisplayModal";
import { deleteUploadedImage } from "@api/designApi";
import fetcher from "@utils/fetcher";

const { Option } = Select;
const { Text } = Typography;
interface RenderStep {
	designDataCopy: DetailedDesign;
	setDesignDataCopy: React.Dispatch<React.SetStateAction<DetailedDesign>>;
	phaseData: PhaseType;
	refetchDesignData: () => void;
}

const RenderStep: React.FC<RenderStep> = ({ designDataCopy, setDesignDataCopy, phaseData, refetchDesignData }) => {
	const [imageType, setImageType] = useState<RenderImgUploadTypes>(RenderImgUploadTypes.Render);
	const [designImagesList, setDesignImagesList] = useState<UploadFile[]>([]);
	const [preview, setPreview] = useState<{ previewImage: string; previewVisible: boolean }>({
		previewImage: "",
		previewVisible: false
	});

	const deleteImage = async (file: UploadFile) => {
		const endPoint = deleteUploadedImage(designDataCopy._id, file.uid);

		const response = await fetcher({ endPoint: endPoint, method: "DELETE" });
		if (response.statusCode <= 300) {
			refetchDesignData();
			message.success("Image deleted successfully");
		}
	};

	useEffect(() => {
		if (designDataCopy) {
			const renderImageFiles = designDataCopy.designImages.filter(image => {
				return image.imgType !== DesignImgTypes.Floorplan;
			});

			const renderImageFilesList = renderImageFiles.map((image, index) => {
				const filename = image.path.split("/").pop();
				return {
					uid: image._id,
					name: filename,
					url: `${cloudinary.baseDeliveryURL}/image/upload/${image.cdn}`,
					size: 0,
					type: "image/*"
				};
			});

			setDesignImagesList(renderImageFilesList);
		}
	}, [designDataCopy.designImages]);

	const uploadRenderImage = useMemo(() => uploadRenderImages(designDataCopy._id, imageType), [
		designDataCopy._id,
		imageType
	]);

	const handleOnFileUploadChange = (info: UploadChangeParam<UploadFile>) => {
		setDesignImagesList(info.fileList);
		if (info.file.status === "done") {
			setDesignDataCopy(info.file.response.data);
		}
	};

	const onSelect = selectedValue => {
		setImageType(selectedValue);
	};

	const ref = useRef(null);

	useEffect(() => {
		ref.current.scrollIntoView({ behavior: "smooth" });
	}, []);

	const handlePreview = async file => {
		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj);
		}

		setPreview({
			previewImage: file.url || file.preview,
			previewVisible: true
		});
	};
	const handleCancel = () => setPreview({ previewImage: "", previewVisible: false });

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
					<CustomDiv width="100%">
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
								<Button disabled={getValueSafely(() => phaseData.design3D.status, Status.pending) !== Status.completed}>
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
