/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { uploadRoomApi } from "@api/pipelineApi";
import {
	DetailedDesign,
	Model3DFiles,
	ModelToExtensionMap,
	RoomLabels,
	RoomTypes,
	DesignPhases,
} from "@customTypes/dashboardTypes";
import { SilentDivider, StatusButton } from "@sections/Dashboard/styled";
import { StepDiv } from "@sections/Dashboard/userProjectMainPanel/pipelineTab/styled";
import { getValueSafely } from "@utils/commonUtils";
import { cookieNames } from "@utils/config";
import getCookie from "@utils/getCookie";
import { Button, Col, Icon, Input, Row, Select, Typography, Upload, notification } from "antd";
import { UploadChangeParam, UploadFile } from "antd/lib/upload/interface";
import React, { useEffect, useMemo, useState } from "react";
import { Status } from "@customTypes/userType";
import fetcher from "@utils/fetcher";
import { updateSubtasks } from "@api/designApi";

const { Text } = Typography;
const { Option } = Select;
interface Stage {
	designData: DetailedDesign;
	setDesignData: React.Dispatch<React.SetStateAction<DetailedDesign>>;
	projectId: string;
}

const RoomUploadStep: React.FC<Stage> = ({ designData, setDesignData, projectId }) => {
	const [roomType, setRoomType] = useState<RoomTypes>(RoomTypes.LivingRoom);
	const [model3dFiles, setModel3dFiles] = useState<Model3DFiles>(Model3DFiles.Glb);
	const [roomName, setRoomName] = useState<string>(null);
	const [roomFileList, setRoomFileList] = useState<UploadFile<any>[]>([]);
	const [sourceFileList, setSourceFileList] = useState<UploadFile<any>[]>([]);

	useEffect(() => {
		if (designData) {
			if (designData.room) {
				const {
					room: {
						spatialData: {
							fileUrls: { glb, source, legacy_obj: legacyObj },
						},
					},
				} = designData;
				if (glb) {
					const uploadedRoomFiles = glb.split("/").pop();
					setRoomFileList([
						{
							uid: "-1",
							name: uploadedRoomFiles,
							status: "done",
							url: glb,
							size: 0,
							type: "application/octet-stream",
						},
					]);
				} else if (legacyObj) {
					const uploadedRoomFiles = legacyObj.split("/").pop();
					setRoomFileList([
						{
							uid: "-1",
							name: uploadedRoomFiles,
							status: "done",
							url: legacyObj,
							size: 0,
							type: "application/octet-stream",
						},
					]);
				}
				if (source) {
					const fileName = source.split("/").pop();
					setSourceFileList([
						{
							uid: "-1",
							name: fileName,
							status: "done",
							url: source,
							size: 0,
							type: "application/octet-stream",
						},
					]);
				}
			}
		}
	}, [designData]);

	const onSelect = selectedValue => {
		const type: string = selectedValue.split(":")[0];
		const value: RoomTypes | Model3DFiles = selectedValue.split(":")[1];
		switch (type) {
			case "fileType":
				setModel3dFiles(value as Model3DFiles);
				break;
			case "roomType":
				setRoomType(value as RoomTypes);
				break;
			default:
		}
	};

	const uploadRoomUrl = useMemo(
		() =>
			uploadRoomApi(
				designData._id,
				getValueSafely(() => designData.room._id, undefined)
			),
		[designData._id, designData.room]
	);

	const handleNameChange = e => {
		const {
			target: { value },
		} = e;
		setRoomName(value);
	};

	const handleOnFileUploadChange = (uploadFileType: "room" | "source", info: UploadChangeParam<UploadFile>): void => {
		let fileList = [...info.fileList];

		fileList = fileList.slice(-1);
		// 1. Limit the number of uploaded files
		// Only to show one recent uploaded files, and old ones will be replaced by the new
		if (info.file.status === "done") {
			setDesignData({
				...designData,
				room: { ...info.file.response.data },
			});
		}
		if (uploadFileType === "room") {
			setRoomFileList(fileList);
		} else if (uploadFileType === "source") {
			setSourceFileList(fileList);
		}
	};

	const room = useMemo(() => designData.room, []);
	useEffect(() => {
		if (designData.room) {
			setRoomName(getValueSafely(() => designData.room.name, ""));
			setRoomType(getValueSafely(() => designData.room.roomType, RoomTypes.LivingRoom));
		}
	}, [designData.room]);

	const assetModelling = getValueSafely(() => designData.phases.modelling.assetModelling, Status.pending);

	const roomModelling = getValueSafely(() => designData.phases.modelling.roomModelling, Status.pending);

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
						currentPhase: DesignPhases.modelling,
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
				message: "Successful",
				icon: <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />,
				description: error.message,
			});
		}
	};

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
								This step involes upload of <b>Room File</b> and any other files related to the design. Mark this step
								as complete once these tasks are done.
							</Text>
						</Col>
					</Row>
				</Col>
				<Col>
					<Row gutter={[8, 8]}>
						<Col>
							<Text strong>Rooms</Text>
						</Col>
						<Col>
							<SilentDivider />
						</Col>
						<Col>
							<Row gutter={[4, 4]}>
								<Col>
									<Text>Room Name</Text>
								</Col>
								<Col>
									<Input value={roomName} onChange={handleNameChange} />
								</Col>
							</Row>
						</Col>
						<Col>
							<Row gutter={[4, 4]}>
								<Col>
									<Text>Room type</Text>
								</Col>
								<Col>
									<Select value={`roomType:${roomType}`} onSelect={onSelect}>
										{Object.keys(RoomTypes).map(key => {
											return (
												<Option key={key} value={`roomType:${RoomTypes[key]}`}>
													{RoomLabels[key]}
												</Option>
											);
										})}
									</Select>
								</Col>
							</Row>
						</Col>
						<Col>
							<Row gutter={[4, 4]}>
								<Col>
									<Row gutter={[4, 4]}>
										<Col>
											<Text>Room File type</Text>
										</Col>
										<Col>
											<Select value={`fileType:${model3dFiles}`} onSelect={onSelect}>
												{Object.keys(Model3DFiles).map(key => {
													return (
														<Option key={key} value={`fileType:${Model3DFiles[key]}`}>
															{key}
														</Option>
													);
												})}
											</Select>
										</Col>
									</Row>
								</Col>
							</Row>
						</Col>

						<Col>
							<Row gutter={[4, 4]}>
								<Col>
									<Text>Room File</Text>
								</Col>
								<Col>
									<Upload
										disabled={!projectId}
										supportServerRender
										name="file"
										fileList={roomFileList}
										action={uploadRoomUrl}
										onRemove={(): false => false}
										onChange={(info): void => handleOnFileUploadChange("room", info)}
										headers={{ Authorization: getCookie(null, cookieNames.authToken) }}
										data={{ name: roomName, fileType: model3dFiles, roomType }}
										accept={ModelToExtensionMap[model3dFiles]}
									>
										<Button disabled={!roomName || !projectId}>
											<Icon type="upload" />
											Click to Upload
										</Button>
									</Upload>
								</Col>
							</Row>
						</Col>
						{room && (
							<Col>
								<Row gutter={[4, 4]}>
									<Col>
										<Text>Source File</Text>
									</Col>
									<Col>
										<Upload
											disabled={!projectId}
											supportServerRender
											name="file"
											fileList={sourceFileList}
											action={uploadRoomUrl}
											onRemove={(): false => false}
											onChange={(info): void => handleOnFileUploadChange("source", info)}
											headers={{ Authorization: getCookie(null, cookieNames.authToken) }}
											data={{ name: roomName, fileType: "source", roomType }}
											accept=".blend"
										>
											<Button disabled={!roomName || !projectId}>
												<Icon type="upload" />
												Click to Upload
											</Button>
										</Upload>
									</Col>
								</Row>
							</Col>
						)}
					</Row>
				</Col>
				<Col>
					<Row type="flex" gutter={[8, 8]}>
						<Col xs={24} md={12}>
							<Row gutter={[8, 8]}>
								<Col span={24}>Asset Creation</Col>
								<Col span={12}>
									<StatusButton
										block
										status={assetModelling}
										disabled={assetModelling === Status.completed}
										name="assetModelling"
										type="primary"
										icon={assetModelling === Status.completed ? "check" : null}
										onClick={(e): Promise<void> => markSubtaskComplete(e, Status.completed)}
									>
										{assetModelling === Status.completed ? "Completed" : "Mark as Complete"}
									</StatusButton>
								</Col>
								<Col span={12}>
									<Button
										name="assetModelling"
										onClick={(e): Promise<void> => markSubtaskComplete(e, Status.pending)}
										block
										disabled={assetModelling !== Status.completed}
										type="danger"
									>
										{assetModelling === Status.completed ? "Mark as Incomplete" : "Not yet Complete"}
									</Button>
								</Col>
							</Row>
						</Col>
						<Col xs={24} md={12}>
							<Row gutter={[8, 8]}>
								<Col span={24}>Room Modelling</Col>
								<Col span={12}>
									<StatusButton
										block
										status={roomModelling}
										disabled={roomModelling === Status.completed}
										name="roomModelling"
										icon={roomModelling === Status.completed ? "check" : null}
										type="primary"
										onClick={(e): Promise<void> => markSubtaskComplete(e, Status.completed)}
									>
										{roomModelling === Status.completed ? "Completed" : "Mark as Complete"}
									</StatusButton>
								</Col>
								<Col span={12}>
									<Button
										onClick={(e): Promise<void> => markSubtaskComplete(e, Status.pending)}
										name="roomModelling"
										disabled={roomModelling !== Status.completed}
										type="danger"
										block
									>
										{roomModelling === Status.completed ? "Mark as Incomplete" : "Not yet Complete"}
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

export default RoomUploadStep;
