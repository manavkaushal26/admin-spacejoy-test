import React, { useState, useMemo, useEffect } from "react";
import { StepsContainer, ShadowDiv, CustomDiv, SilentDivider, Form } from "@sections/Dashboard/styled";
import { Avatar, Typography, Upload, Button, Icon, Select, Input } from "antd";
import { RoomTypes, Model3DFiles, ModelToExtensionMap, DetailedDesign } from "@customTypes/dashboardTypes";
import { uploadRoomApi } from "@api/pipelineApi";

import { cookieNames } from "@utils/config";
import getCookie from "@utils/getCookie";
import { UploadFileStatus, UploadFile, UploadChangeParam } from "antd/lib/upload/interface";
import { getValueSafely } from "@utils/commonUtils";

const { Text } = Typography;
const { Option } = Select;
interface Stage {
	designData: DetailedDesign;
	refetchDesignData: () => void;
	stage: string;
}

const UploadStep: React.FC<Stage> = ({ designData, refetchDesignData }) => {
	const [source, setSource] = useState<BinaryType>(null);
	const [blend, setBlend] = useState<BinaryType>(null);
	const [roomType, setRoomType] = useState<RoomTypes>(RoomTypes.Livingroom);
	const [model3dFiles, setModel3dFiles] = useState<Model3DFiles>(Model3DFiles.Glb);
	const [roomName, setRoomName] = useState<string>("");

	const onSelect = selectedValue => {
		let type: string, value: RoomTypes | Model3DFiles;
		[type, value] = selectedValue.split(":");
		switch (type) {
			case "fileType":
				setModel3dFiles(value as Model3DFiles);
				break;
			case "roomType":
				setRoomType(value as RoomTypes);
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

	const beforeUpload = (file, fileList) => {
		console.log(file);
		return false;
	};

	const handleNameChange = e => {
		const {
			target: { value }
		} = e;
		setRoomName(value);
	};

	const handleOnFileUploadChange = (info: UploadChangeParam<UploadFile>) => {
		console.log(info);
		if (info.file.status === "done") {
			refetchDesignData();
		}
	};

	const room = useMemo(() => designData.room, []);

	useEffect(() => {
		if (designData.room) {
			setRoomName(getValueSafely(() => designData.room.name, ""));
			setRoomType(getValueSafely(() => designData.room.roomType, RoomTypes.Livingroom));
		}
	}, [designData.room]);

	return (
		<StepsContainer>
			<ShadowDiv>
				<CustomDiv px="1rem" py="1rem">
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
											{key}
										</Option>
									);
								})}
							</Select>
						</CustomDiv>
						<CustomDiv flexBasis="30ch" align="baseline" type="flex" flexDirection="row">
							<label>Source File type</label>
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
								supportServerRender={true}
								name="file"
								action={uploadRoomUrl}
								onChange={handleOnFileUploadChange}
								headers={{ Authorization: getCookie(null, cookieNames.authToken) }}
								data={{ name: roomName, fileType: model3dFiles, roomType: roomType }}
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
									supportServerRender={true}
									name="file"
									action={uploadRoomUrl}
									onChange={handleOnFileUploadChange}
									headers={{ Authorization: getCookie(null, cookieNames.authToken) }}
									data={{ name: roomName, fileType: "source", roomType: roomType }}
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
			</ShadowDiv>
		</StepsContainer>
	);
};

export default function Stage(props: Stage): JSX.Element {
	switch (props.stage) {
		case "assets":
			return <UploadStep {...props} />;
		default:
			return (
				<ShadowDiv>
					<CustomDiv type="flex" justifyContent="center">
						<Text>Work in Progress</Text>
					</CustomDiv>
				</ShadowDiv>
			);
	}
}
