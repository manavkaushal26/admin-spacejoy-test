import { deleteUploadedImageApi, updateSubtasks } from "@api/designApi";
import { uploadRenderImages } from "@api/pipelineApi";
import ImageDisplayModal from "@components/ImageDisplayModal";
import { DesignImgTypes, DesignPhases, DetailedDesign } from "@customTypes/dashboardTypes";
import { Status } from "@customTypes/userType";
import { SilentDivider, StatusButton } from "@sections/Dashboard/styled";
import { getBase64, getValueSafely } from "@utils/commonUtils";
import { cloudinary, cookieNames } from "@utils/config";
import fetcher from "@utils/fetcher";
import getCookie from "@utils/getCookie";
import { Button, Col, Icon, message, Modal, notification, Row, Typography, Upload } from "antd";
import { UploadChangeParam, UploadFile } from "antd/lib/upload/interface";
import React, { useEffect, useMemo, useState } from "react";
import { StepDiv } from "@sections/Dashboard/userProjectMainPanel/pipelineTab/styled";

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

	const markSubtaskComplete = async (e, status: Status): Promise<void> => {
		const {
			target: { name },
		} = e;
		notification.open({
			key: name,
			message: "Please Wait",
			icon: <Icon type="loading" />,
			description: "Status being Updated",
		});
		const endPoint = updateSubtasks(designData._id);
		try {
			const response = await fetcher({
				endPoint,
				method: "PUT",
				body: {
					data: {
						currentPhase: DesignPhases.concept,
						requirement: name,
						status,
					},
				},
			});
			if (response.status === "success" && response.statusCode <= 300) {
				setDesignData({
					...designData,
					phases: response.data.phases,
				});
				notification.open({
					key: name,
					message: "Successful",
					icon: <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />,
					description: "Status is successfully updated",
				});
			} else {
				throw Error(response.message);
			}
		} catch (error) {
			notification.open({
				key: name,
				message: "Error",
				icon: <Icon type="close-circle" theme="twoTone" twoToneColor="#f5222d" />,
				description: error.message,
			});
		}
	};

	const floorPlanStatus = getValueSafely(() => designData.phases.concept.floorplanCreation, Status.pending);

	const moodboardStatus = getValueSafely(() => designData.phases.concept.moodboardCreation, Status.pending);

	return (
		<StepDiv>
			<Row gutter={[16, 16]}>
				<Col>
					<Row gutter={[8, 8]}>
						<Col>
							<Text strong>Description</Text>
						</Col>
						<Col>
							<Text>
								This step involves the creation of <b>Moodboard</b> and the upload of <b>Floorplans</b>(if any) to the
								design. Mark this step as complete once these tasks are done.
							</Text>
						</Col>
					</Row>
				</Col>
				<Col>
					<Row gutter={[8, 8]}>
						<Col>
							<Text strong>Upload Floor Plan (Optional)</Text>
						</Col>
						<Col>
							<SilentDivider />
						</Col>
						<Col>
							<Row gutter={[4, 4]}>
								<Col>
									<Text>Floorplan</Text>
								</Col>
								<Col>
									<Upload
										multiple
										supportServerRender
										name="files"
										fileList={floorPlanList}
										listType="picture-card"
										onPreview={handlePreview}
										action={floorPlanUploadEndpoint}
										onRemove={confirmDelete}
										onChange={handleOnFileUploadChange}
										headers={{ Authorization: getCookie(null, cookieNames.authToken) }}
										accept="image/*"
									>
										<Button>
											<Icon type="upload" />
											Click to Upload
										</Button>
									</Upload>
								</Col>
							</Row>
						</Col>
					</Row>
					<ImageDisplayModal
						previewImage={preview.previewImage}
						previewVisible={preview.previewVisible}
						altText="floorplan"
						handleCancel={handleCancel}
					/>
				</Col>
				<Col>
					<Row type="flex" gutter={[8, 8]}>
						<Col xs={24} md={12}>
							<Row gutter={[8, 8]}>
								<Col span={24}>FloorPlan</Col>
								<Col span={12}>
									<StatusButton
										block
										type="primary"
										name="floorplanCreation"
										status={floorPlanStatus}
										onClick={(e): Promise<void> => markSubtaskComplete(e, Status.completed)}
										disabled={floorPlanStatus === Status.completed}
										icon="check"
									>
										{floorPlanStatus === Status.completed ? "Completed" : "Mark as Complete"}
									</StatusButton>
								</Col>

								<Col span={12}>
									<Button
										block
										name="floorplanCreation"
										onClick={(e): Promise<void> => markSubtaskComplete(e, Status.pending)}
										disabled={floorPlanStatus !== Status.completed}
										type="danger"
									>
										{floorPlanStatus === Status.completed ? "Mark as Incomplete" : "Not yet completed"}
									</Button>
								</Col>
							</Row>
						</Col>
						<Col xs={24} md={12}>
							<Row gutter={[8, 8]}>
								<Col span={24}>Moodboard</Col>
								<Col span={12}>
									<StatusButton
										block
										name="moodboardCreation"
										onClick={(e): Promise<void> => markSubtaskComplete(e, Status.completed)}
										status={moodboardStatus}
										disabled={moodboardStatus === Status.completed}
										icon="check"
										type="primary"
									>
										{moodboardStatus === Status.completed ? "Completed" : "Mark as Complete"}
									</StatusButton>
								</Col>
								<Col span={12}>
									<Button
										onClick={(e): Promise<void> => markSubtaskComplete(e, Status.pending)}
										name="moodboardCreation"
										type="danger"
										disabled={moodboardStatus !== Status.completed}
										block
									>
										{moodboardStatus === Status.completed ? "Mark as Incomplete" : "Not yet completed"}
									</Button>
								</Col>
							</Row>
						</Col>
					</Row>
				</Col>
			</Row>
		</StepDiv>
	);
};

export default MoodboardAndFloorPlanStep;
