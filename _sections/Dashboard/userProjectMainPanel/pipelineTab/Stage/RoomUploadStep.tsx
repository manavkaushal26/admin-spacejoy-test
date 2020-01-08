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
	designDataCopy: DetailedDesign;
}

const RoomUploadStep: React.FC<Stage> = ({ designDataCopy }) => {
	const [roomType, setRoomType] = useState<RoomTypes>(RoomTypes.LivingRoom);
	const [model3dFiles, setModel3dFiles] = useState<Model3DFiles>(Model3DFiles.Glb);
	const [roomName, setRoomName] = useState<string>(null);
	const [roomFileList, setRoomFileList] = useState<UploadFile<any>[]>([]);
	const [sourceFileList, setSourceFileList] = useState<UploadFile<any>[]>([]);

	useEffect(() => {
		if (designDataCopy) {
			if (designDataCopy.room) {
				const {
					room: {
						spatialData: {
							fileUrls: { glb, source, legacy_obj: legacyObj },
						},
					},
				} = designDataCopy;
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
					const fileName = legacyObj.split("/").pop();
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
	}, [designDataCopy]);

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
				designDataCopy._id,
				getValueSafely(() => designDataCopy.room._id, undefined)
			),
		[designDataCopy._id, designDataCopy.room]
	);

	const handleNameChange = e => {
		const {
			target: { value },
		} = e;
		setRoomName(value);
	};

	const handleOnFileUploadChange = (uploadFileType: "room" | "source", info: UploadChangeParam<UploadFile>) => {
		let fileList = [...info.fileList];

		// 1. Limit the number of uploaded files
		// Only to show one recent uploaded files, and old ones will be replaced by the new
		fileList = fileList.slice(-1);

		if (uploadFileType === "room") {
			setRoomFileList(fileList);
		} else if (uploadFileType === "source") {
			setSourceFileList(fileList);
		}
	};

	const room = useMemo(() => designDataCopy.room, []);
	useEffect(() => {
		if (designDataCopy.room) {
			setRoomName(getValueSafely(() => designDataCopy.room.name, ""));
			setRoomType(getValueSafely(() => designDataCopy.room.roomType, RoomTypes.LivingRoom));
		}
	}, [designDataCopy.room]);

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
							<Button disabled={!roomName}>
								<Icon type="upload" />
								Click to Upload
							</Button>
						</Upload>
					</CustomDiv>
					{room && (
						<CustomDiv flexBasis="30ch" type="flex" width="100%">
							<label>Source File</label>
							<Upload
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
								<Button disabled={!roomName}>
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
