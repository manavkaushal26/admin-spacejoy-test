/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { uploadRoomApi } from "@api/pipelineApi";
import { DetailedDesign, Model3DFiles, ModelToExtensionMap, RoomLabels, RoomTypes } from "@customTypes/dashboardTypes";
import { CustomDiv, Form, SilentDivider } from "@sections/Dashboard/styled";
import { StepDiv } from "@sections/Dashboard/userProjectMainPanel/pipelineTab/styled";
import { getValueSafely } from "@utils/commonUtils";
import { cookieNames } from "@utils/config";
import getCookie from "@utils/getCookie";
import { Button, Icon, Input, Select, Typography, Upload } from "antd";
import { UploadChangeParam, UploadFile } from "antd/lib/upload/interface";
import React, { useEffect, useMemo, useState } from "react";

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

	return (
		<StepDiv>
			<CustomDiv px="1rem" py="1rem" pt="1.5rem" width="100%">
				<CustomDiv pb="1rem">
					<CustomDiv>
						<Text strong>Description</Text>
					</CustomDiv>
					<CustomDiv>
						<Text>
							This step involes upload of <b>Room File</b> and any other files related to the design. Mark this step as
							complete once these tasks are done.
						</Text>
					</CustomDiv>
				</CustomDiv>
				<Form>
					<Text strong>Rooms</Text>
					<SilentDivider />
					<CustomDiv flexBasis="30ch" align="baseline" type="flex" flexDirection="row">
						<label>Room Name</label>
						<CustomDiv>
							<Input value={roomName} onChange={handleNameChange} />
						</CustomDiv>
					</CustomDiv>
					<CustomDiv flexBasis="30ch" align="baseline" type="flex" flexDirection="row">
						<label>Room type</label>
						<Select value={`roomType:${roomType}`} onSelect={onSelect}>
							{Object.keys(RoomTypes).map(key => {
								return (
									<Option key={key} value={`roomType:${RoomTypes[key]}`}>
										{RoomLabels[key]}
									</Option>
								);
							})}
						</Select>
					</CustomDiv>
					<CustomDiv flexBasis="30ch" align="baseline" type="flex" flexDirection="row">
						<label>Room File type</label>
						<Select value={`fileType:${model3dFiles}`} onSelect={onSelect}>
							{Object.keys(Model3DFiles).map(key => {
								return (
									<Option key={key} value={`fileType:${Model3DFiles[key]}`}>
										{key}
									</Option>
								);
							})}
						</Select>
					</CustomDiv>

					<CustomDiv flexBasis="30ch" type="flex" width="100%">
						<label>Room File</label>
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
					</CustomDiv>
					{room && (
						<CustomDiv flexBasis="30ch" type="flex" width="100%">
							<label>Source File</label>
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
						</CustomDiv>
					)}
				</Form>
			</CustomDiv>
		</StepDiv>
	);
};

export default RoomUploadStep;
