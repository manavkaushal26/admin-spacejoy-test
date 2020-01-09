import { deleteUploadedImage } from "@api/designApi";
import { uploadRenderImages } from "@api/pipelineApi";
import { DesignImgTypes, DetailedDesign } from "@customTypes/dashboardTypes";
import { CustomDiv, Form, SilentDivider } from "@sections/Dashboard/styled";
import { getBase64 } from "@utils/commonUtils";
import { cloudinary, cookieNames } from "@utils/config";
import fetcher from "@utils/fetcher";
import getCookie from "@utils/getCookie";
import { Button, Icon, message, Typography, Upload } from "antd";
import { UploadChangeParam, UploadFile } from "antd/lib/upload/interface";
import React, { useEffect, useMemo, useState } from "react";
import { StepDiv } from "../styled";
import ImageDisplayModal from "./Components/ImageDisplayModal";

const { Text } = Typography;

interface MoodboardAndFloorPlanStep {
	designData: DetailedDesign;
	setDesignData: React.Dispatch<React.SetStateAction<DetailedDesign>>;
}

const MoodboardAndFloorPlanStep: React.FC<MoodboardAndFloorPlanStep> = ({ designData, setDesignData }) => {
	const [floorPlanList, setFloorPlanList] = useState<UploadFile<any>[]>([]);
	const [preview, setPreview] = useState({
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
			const floorplanImages = designData.designImages.filter(image => {
				return image.imgType === DesignImgTypes.Floorplan;
			});
			const floorPlanFileList = floorplanImages.map(image => {
				const filename = image.path.split("/").pop();
				return {
					uid: image._id,
					name: filename,
					url: `${cloudinary.baseDeliveryURL}/image/upload/${image.cdn}`,
					size: 0,
					type: "image/*",
				};
			});
			setFloorPlanList(floorPlanFileList);
		}
	}, [designData.designImages]);

	const handleOnFileUploadChange = (info: UploadChangeParam<UploadFile>): void => {
		setFloorPlanList([...info.fileList]);
		if (info.file.status === "done") {
			setDesignData({
				...designData,
				designImages: [...info.file.response.data.designImages],
			});
		}
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

	const floorPlanUploadEndpoint = useMemo(() => uploadRenderImages(designData._id, "floorplan"), [designData._id]);
	const handleCancel = (): void => setPreview({ previewImage: "", previewVisible: false });

	return (
		<StepDiv>
			<CustomDiv px="1rem" py="1rem" pt="1.5rem" width="100%">
				<CustomDiv pb="1rem">
					<CustomDiv>
						<Text strong>Description</Text>
					</CustomDiv>
					<CustomDiv>
						<Text>
							This step involves the creation of <b>Moodboard</b> and the upload of <b>Floorplans</b>(if any) to the
							design. Mark this step as complete once these tasks are done.
						</Text>
					</CustomDiv>
				</CustomDiv>
				<Form>
					<Text strong>Upload Floor Plan (Optional)</Text>
					<SilentDivider />
					<CustomDiv flexBasis="30ch" type="flex" width="100%">
						<label>Floorplan</label>
						<Upload
							multiple
							supportServerRender
							name="files"
							fileList={floorPlanList}
							listType="picture-card"
							onPreview={handlePreview}
							action={floorPlanUploadEndpoint}
							onRemove={deleteImage}
							onChange={handleOnFileUploadChange}
							headers={{ Authorization: getCookie(null, cookieNames.authToken) }}
							accept="images/*"
						>
							<Button>
								<Icon type="upload" />
								Click to Upload
							</Button>
						</Upload>
					</CustomDiv>
					<ImageDisplayModal
						previewImage={preview.previewImage}
						previewVisible={preview.previewVisible}
						altText="floorplan"
						handleCancel={handleCancel}
					/>
				</Form>
			</CustomDiv>
		</StepDiv>
	);
};

export default MoodboardAndFloorPlanStep;
