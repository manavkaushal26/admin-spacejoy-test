import { CheckCircleTwoTone, CheckOutlined, LoadingOutlined, UploadOutlined } from "@ant-design/icons";
import { updateSubtasks } from "@api/designApi";
import { uploadRoomApi } from "@api/pipelineApi";
import {
	DesignPhases,
	DetailedDesign,
	Model3DFiles,
	ModelToExtensionMap,
	RoomLabels,
	RoomTypes,
} from "@customTypes/dashboardTypes";
import { Status } from "@customTypes/userType";
import { SilentDivider, StatusButton } from "@sections/Dashboard/styled";
import { StepDiv } from "@sections/Dashboard/userProjectMainPanel/pipelineTab/styled";
import { getValueSafely } from "@utils/commonUtils";
import { cookieNames } from "@utils/config";
import fetcher from "@utils/fetcher";
import getCookie from "@utils/getCookie";
import { Button, Col, Input, notification, Radio, Row, Select, Typography, Upload } from "antd";
import { UploadChangeParam, UploadFile } from "antd/lib/upload/interface";
import axios from "axios";
import dynamic from "next/dynamic";
import React, { useEffect, useMemo, useState } from "react";

const ModelViewer = dynamic(() => import("@components/ModelViewer"));

const { Text } = Typography;
const { Option } = Select;
interface Stage {
	designData: DetailedDesign;
	setDesignData: React.Dispatch<React.SetStateAction<DetailedDesign>>;
	projectId: string;
	updateDesignState: (currentStage, status: Status | "reset", e: any) => Promise<void>;
}

const radioStyle = {
	display: "flex",
	minHeight: "30px",
	alignItems: "center",
	margin: "5px 0px",
};

const RoomUploadStep: React.FC<Stage> = ({ designData, setDesignData, projectId, updateDesignState }) => {
	const [roomType, setRoomType] = useState<RoomTypes>(RoomTypes.LivingRoom);
	const [model3dFiles, setModel3dFiles] = useState<Model3DFiles>(Model3DFiles.Glb);
	const [roomName, setRoomName] = useState<string>(null);
	const [roomFileList, setRoomFileList] = useState<UploadFile<any>[]>([]);
	const [sourceFileList, setSourceFileList] = useState<UploadFile<any>[]>([]);
	const [isGlobal, setIsGlobal] = useState<boolean>(false);
	const [isNewRoom, setIsNewRoom] = useState<boolean>(false);
	const [files, setFiles] = useState({
		room: {
			url: "",
			file: {},
			link: "",
		},
		source: {
			url: "",
			file: {},
			link: "",
		},
	});

	const submitRoomUrlAfterUpload = useMemo(
		() =>
			`${uploadRoomApi(
				designData._id,
				getValueSafely(() => (!isNewRoom ? designData.room._id : undefined), undefined)
			)}${isGlobal ? "?isGlobal=true" : ""}`,
		[designData._id, designData.room, isGlobal, isNewRoom]
	);

	useEffect(() => {
		if (designData) {
			if (designData?.room) {
				if (room?.spatialData?.fileUrls?.glb) {
					const uploadedRoomFiles = room.spatialData.fileUrls.glb.split("/").pop();
					setRoomFileList([
						{
							uid: "-1",
							name: uploadedRoomFiles,
							status: "done",
							url: room.spatialData.fileUrls.glb,
							size: 0,
							type: "application/octet-stream",
						},
					]);
				} else if (room?.spatialData?.fileUrls?.legacy_obj) {
					const uploadedRoomFiles = room.spatialData.fileUrls.legacy_obj.split("/").pop();
					setRoomFileList([
						{
							uid: "-1",
							name: uploadedRoomFiles,
							status: "done",
							url: room.spatialData.fileUrls.legacy_obj,
							size: 0,
							type: "application/octet-stream",
						},
					]);
				}
				if (room?.spatialData?.fileUrls?.source) {
					const fileName = room.spatialData.fileUrls.source.split("/").pop();
					setSourceFileList([
						{
							uid: "-1",
							name: fileName,
							status: "done",
							url: room.spatialData.fileUrls.source,
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

	const onChange = (e): void => {
		const {
			target: { name, value },
		} = e;
		if (name === "roomName") {
			setRoomName(value);
		} else if (name === "isNewRoom") {
			setIsNewRoom(value);
		} else if (name === "isGlobal") {
			setIsGlobal(value);
		}
	};

	const uploadFileToGoogleStorage = async (url, fileType, file) => {
		if (url.length !== 0) {
			try {
				await axios.put(url, file, { headers: { "Content-Type": "application/octet-stream" } });
				return true;
			} catch (error) {
				return false;
			}
		} else {
			notification.error({ message: "Error", description: "URL is empty" });
		}
	};

	const handleOnChange = async (
		uploadFileType: "room" | "source",
		info: UploadChangeParam<UploadFile>
	): Promise<void> => {
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

	const submitRoomData = async options => {
		const { onError, data, action } = options;
		const config = {
			headers: { Authorization: getCookie(null, cookieNames.authToken) },
		};
		try {
			const isUploadComplete = await uploadFileToGoogleStorage(files.room.url, "room", files.room.file);
			if (isUploadComplete) {
				await axios
					.post(action, data, config)
					.then(res => {
						setDesignData({
							...designData,
							room: { ...designData.room, ...res.data.data },
						});
						notification.success({
							message: "Success",
							description: "Glb File Updated In DB",
						});
					})
					.catch(err => {
						setDesignData({
							...designData,
							room: { ...designData.room },
						});
						notification.success({
							message: "Error",
							description: err.message,
						});
					});
			}
		} catch (err) {
			setDesignData({
				...designData,
				room: { ...designData.room },
			});
			onError(() => {
				notification.error({
					message: "Error",
					description: err.message,
				});
			});
		}
	};
	const submitSourceData = async options => {
		const { onError, data, action } = options;
		const config = {
			headers: { Authorization: getCookie(null, cookieNames.authToken) },
		};
		try {
			const isUploadComplete = await uploadFileToGoogleStorage(files.source.url, "source", files.source.file);
			if (isUploadComplete) {
				await axios
					.post(action, data, config)
					.then(res => {
						setDesignData({
							...designData,
							room: { ...designData.room, ...res.data.data },
						});
						notification.success({
							message: "Success",
							description: "Source File Updated In DB",
						});
					})
					.catch(err => {
						setDesignData({
							...designData,
							room: { ...designData.room },
						});
						notification.success({
							message: "Error",
							description: err.message,
						});
					});
			}
		} catch (err) {
			onError(() => {
				notification.error({
					message: "Error",
					description: err.message,
				});
			});
		}
	};

	const room = useMemo(() => designData.room, [designData.room]);
	useEffect(() => {
		if (designData.room) {
			setRoomName(getValueSafely(() => designData.room.name, ""));
			setRoomType(getValueSafely(() => designData.room.roomType, RoomTypes.LivingRoom));
		}
	}, [designData.room]);

	const assetModelling = useMemo(
		() => getValueSafely(() => designData.phases.modelling.assetModelling, Status.pending),
		[designData.phases]
	);

	const roomModelling = useMemo(
		() => getValueSafely(() => designData.phases.modelling.roomModelling, Status.pending),
		[designData.phases]
	);

	useEffect(() => {
		if (
			assetModelling === Status.completed &&
			roomModelling === Status.completed &&
			designData.phases.modelling.status !== Status.completed
		) {
			updateDesignState(DesignPhases.modelling, designData.phases.modelling.status, undefined);
		}
	}, [assetModelling, roomModelling]);

	const markSubtaskComplete = async (name, status: Status): Promise<void> => {
		notification.open({
			key: name,
			message: "Please Wait",
			icon: <LoadingOutlined />,
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
					icon: <CheckCircleTwoTone twoToneColor='#52c41a' />,
					description: "Status is successfully updated",
				});
			} else {
				throw Error(response.message);
			}
		} catch (error) {
			notification.open({
				key: name,
				message: "Successful",
				icon: <CheckCircleTwoTone twoToneColor='#52c41a' />,
				description: error.message,
			});
		}
	};

	return (
		<StepDiv>
			<Row gutter={[16, 16]}>
				<Col span={24}>
					<Row gutter={[8, 8]}>
						<Col span={24}>
							<Text strong>Description</Text>
						</Col>
						<Col span={24}>
							<Text>
								This step involes upload of <b>Room File</b> and any other files related to the design. Mark this step
								as complete once these tasks are done.
							</Text>
						</Col>
					</Row>
				</Col>
				{roomFileList.length !== 0 && designData?.room?.spatialData?.fileUrls?.glb && (
					<Col span={24}>
						<Row gutter={[8, 8]}>
							<Col sm={24}>
								<Text strong>Room Model View</Text>
							</Col>
							<Col>
								<ModelViewer centerCamera type='glb' pathToFile={designData?.room?.spatialData?.fileUrls?.glb} />
							</Col>
						</Row>
					</Col>
				)}
				<Col span={24}>
					<Row gutter={[8, 8]}>
						<Col sm={24}>
							<Text strong>Rooms</Text>
						</Col>
						<Col sm={24}>
							<SilentDivider />
						</Col>
						<Col sm={24} md={12}>
							<Row gutter={[4, 4]}>
								<Col span={24}>
									<Text>Room Name</Text>
								</Col>
								<Col span={24}>
									<Input value={roomName} name='roomName' onChange={onChange} />
								</Col>
							</Row>
						</Col>
						<Col sm={24} md={12}>
							<Row gutter={[4, 4]}>
								<Col span={24}>
									<Text>Room type</Text>
								</Col>
								<Col span={24}>
									<Select style={{ width: "100%" }} value={`roomType:${roomType}`} onSelect={onSelect}>
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
						<Col sm={24} md={12}>
							<Row gutter={[4, 4]}>
								<Col span={24}>
									<Text>Room File type</Text>
								</Col>
								<Col span={24}>
									<Select style={{ width: "100%" }} value={`fileType:${model3dFiles}`} onSelect={onSelect}>
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
						<Col sm={24}>
							<SilentDivider />
						</Col>
						{!(designData.room && designData.room._id) ? (
							<Col sm={24}>
								<Row gutter={[4, 4]}>
									<Col span={24}>
										<Text>Upload Room to all Designs?</Text>
									</Col>
									<Col span={24}>
										<Radio.Group name='isGlobal' onChange={onChange} value={isGlobal}>
											<Radio value>Yes</Radio>
											<Radio value={false}>No</Radio>
										</Radio.Group>
									</Col>
								</Row>
							</Col>
						) : (
							<Col sm={24}>
								<Row>
									<Col span={24}>
										<Text>Upload type?</Text>
									</Col>
									<Col span={24}>
										<Radio.Group name='isNewRoom' onChange={onChange} value={isNewRoom}>
											<Radio style={radioStyle} value>
												<Row>Create New Room</Row>
											</Radio>
											<Radio style={radioStyle} value={false}>
												<Row>
													<Col>
														<Text>
															Update Current Room <small>Note:- All Designs with the same room will be affected</small>
														</Text>
													</Col>
												</Row>
											</Radio>
										</Radio.Group>
									</Col>
								</Row>
							</Col>
						)}

						<Col md={24}>
							<Row gutter={[4, 4]}>
								<Col>
									<Text>Room File</Text>
								</Col>
								<Col>
									<Upload
										disabled={!projectId}
										supportServerRender
										fileList={roomFileList}
										action={submitRoomUrlAfterUpload}
										beforeUpload={async file => {
											try {
												const roomUploadUrl = await fetcher({
													endPoint: "/v1/signUrl/room",
													method: "POST",
													body: {
														roomId: designData.room && designData.room._id ? designData.room._id : Date.now(),
														fileType: "glb",
													},
												});
												setFiles({
													...files,
													room: {
														...files.room,
														url: roomUploadUrl.data.url,
														file: file,
														link: roomUploadUrl.data.link,
													},
												});
											} catch (error) {
												notification.error({
													message: "Failed",
													description: "Error While Getting Room Upload URL",
												});
											}
										}}
										onRemove={(): false => false}
										onChange={info => handleOnChange("room", info)}
										data={{ file: files.room.link, name: roomName, fileType: model3dFiles, roomType }}
										accept={ModelToExtensionMap[model3dFiles]}
										customRequest={submitRoomData}
									>
										<Button disabled={!roomName || !projectId}>
											<UploadOutlined /> Click to Upload
										</Button>
									</Upload>
								</Col>
							</Row>
						</Col>
						{room && (
							<Col md={24}>
								<Row gutter={[4, 4]}>
									<Col>
										<Text>Source File</Text>
									</Col>
									<Col>
										<Upload
											disabled={!projectId}
											supportServerRender
											fileList={sourceFileList}
											action={submitRoomUrlAfterUpload}
											beforeUpload={async file => {
												try {
													const sourceUploadUrl = await fetcher({
														endPoint: "/v1/signUrl/room",
														method: "POST",
														body: {
															roomId: designData.room && designData.room._id ? designData.room._id : Date.now(),
															fileType: "source",
														},
													});
													setFiles({
														...files,
														source: {
															...files.source,
															url: sourceUploadUrl.data.url,
															file: file,
															link: sourceUploadUrl.data.link,
														},
													});
												} catch (error) {
													notification.error({
														message: "Failed",
														description: "Error While Getting Source Upload URL",
													});
												}
											}}
											onRemove={(): false => false}
											onChange={(info): Promise<void> => handleOnChange("source", info)}
											data={{ file: files.source.link, name: roomName, fileType: "source", roomType }}
											accept='.blend'
											customRequest={submitSourceData}
										>
											<Button disabled={!roomName || !projectId}>
												<UploadOutlined />
												Click to Upload
											</Button>
										</Upload>
									</Col>
								</Row>
							</Col>
						)}
					</Row>
				</Col>
				<Col span={24}>
					<Row gutter={[8, 8]}>
						<Col xs={24} md={12}>
							<Row gutter={[8, 8]}>
								<Col span={24}>Asset Creation</Col>
								<Col span={12}>
									<StatusButton
										block
										status={assetModelling}
										disabled={assetModelling === Status.completed}
										type='primary'
										icon={assetModelling === Status.completed ? <CheckOutlined /> : null}
										onClick={(): Promise<void> => markSubtaskComplete("assetModelling", Status.completed)}
									>
										{assetModelling === Status.completed ? "Completed" : "Mark as Complete"}
									</StatusButton>
								</Col>
								<Col span={12}>
									<Button
										onClick={(): Promise<void> => markSubtaskComplete("assetModelling", Status.pending)}
										block
										disabled={assetModelling !== Status.completed}
										danger
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
										icon={roomModelling === Status.completed ? <CheckOutlined /> : null}
										type='primary'
										onClick={(): Promise<void> => markSubtaskComplete("roomModelling", Status.completed)}
									>
										{roomModelling === Status.completed ? "Completed" : "Mark as Complete"}
									</StatusButton>
								</Col>
								<Col span={12}>
									<Button
										onClick={(): Promise<void> => markSubtaskComplete("roomModelling", Status.pending)}
										disabled={roomModelling !== Status.completed}
										danger
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
