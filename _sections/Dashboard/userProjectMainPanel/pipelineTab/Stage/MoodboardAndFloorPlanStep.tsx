import { uploadRenderImages } from "@api/pipelineApi";
import { DesignImgTypes, DetailedDesign } from "@customTypes/dashboardTypes";
import { CustomDiv, Form, SilentDivider } from "@sections/Dashboard/styled";
import { getBase64 } from "@utils/commonUtils";
import { cloudinary, cookieNames } from "@utils/config";
import getCookie from "@utils/getCookie";
import { Button, Icon, Typography, Upload, message } from "antd";
import { UploadChangeParam, UploadFile } from "antd/lib/upload/interface";
import React, { useEffect, useMemo, useState } from "react";
import { StepDiv } from "../styled";
import ImageDisplayModal from "./Components/ImageDisplayModal";
import { deleteUploadedImage } from "@api/designApi";
import fetcher from "@utils/fetcher";

const { Text } = Typography;

interface MoodboardAndFloorPlanStep {
	designDataCopy: DetailedDesign;
	setDesignDataCopy: React.Dispatch<React.SetStateAction<DetailedDesign>>;
	refetchDesignData: () => void;
}

const MoodboardAndFloorPlanStep: React.FC<MoodboardAndFloorPlanStep> = ({
	designDataCopy,
	setDesignDataCopy,
	refetchDesignData
}) => {
	const [floorPlanList, setFloorPlanList] = useState<UploadFile<any>[]>([]);
	const [preview, setPreview] = useState({
		previewImage: "",
		previewVisible: false
	});

	const deleteImage = async (file: UploadFile) => {
		const endPoint = deleteUploadedImage(designDataCopy._id, file.uid);

		const response = await fetcher({ endPoint: endPoint, method: "DELETE" });
		if (response.status <= 300) {
			refetchDesignData();
			message.success("Image deleted successfully");
		}
	};

	useEffect(() => {
		if (designDataCopy) {
			const floorplanImages = designDataCopy.designImages.filter(image => {
				return image.imgType === DesignImgTypes.Floorplan;
			});
			const floorPlanFileList = floorplanImages.map((image, index) => {
				const filename = image.path.split("/").pop();
				return {
					uid: image._id,
					name: filename,
					url: `${cloudinary.baseDeliveryURL}/image/upload/${image.cdn}`,
					size: 0,
					type: "image/*"
				};
			});
			setFloorPlanList(floorPlanFileList);
		}
	}, [designDataCopy.designImages]);

	const handleOnFileUploadChange = (info: UploadChangeParam<UploadFile>) => {
		setFloorPlanList([...info.fileList]);
		if (info.file.status === "done") {
			setDesignDataCopy(info.file.response.data);
		}
	};

	const handlePreview = async file => {
		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj);
		}

		setPreview({
			previewImage: file.url || file.preview,
			previewVisible: true
		});
	};

	const floorPlanUploadEndpoint = useMemo(() => uploadRenderImages(designDataCopy._id, "floorplan"), [
		designDataCopy._id
	]);
	const handleCancel = () => setPreview({ previewImage: "", previewVisible: false });

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
