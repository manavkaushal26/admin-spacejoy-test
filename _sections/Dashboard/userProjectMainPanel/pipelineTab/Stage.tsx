import React, { useState } from "react";
import { StepsContainer, ShadowDiv, CustomDiv, SilentDivider, Form } from "@sections/Dashboard/styled";
import { Avatar, Typography, Upload, Button, Icon, Select } from "antd";
import { RoomTypes, Model3DFiles } from "@customTypes/dashboardTypes";

const { Text } = Typography;
const { Option } = Select;
interface Stage {
	stage: string;
}

const UploadStep = () => {
	const [source, setSource] = useState<BinaryType>(null);
	const [blend, setBlend] = useState<BinaryType>(null);
	const [roomType, setRoomType] = useState<RoomTypes>(RoomTypes.Livingroom);
	const [model3dFiles, setModel3dFiles] = useState<Model3DFiles>(Model3DFiles.Gltf);

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

	const beforeUpload = (file, fileList) => {
		return false;
	};

	return (
		<StepsContainer>
			<ShadowDiv>
				<CustomDiv px="1.5rem" py="1.5rem">
					<CustomDiv inline pr="0.5rem">
						<Avatar>1</Avatar>
					</CustomDiv>
					<Text strong>Upload Room and Assets</Text>
				</CustomDiv>
				<SilentDivider />
				<CustomDiv px="1rem" py="1rem">
					<Form>
						<Text strong>Rooms</Text>
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
							<label>Source</label>
							<Upload name="file" accept=".zip,.glb,.blend" beforeUpload={beforeUpload}>
								<Button>
									<Icon type="upload" /> Click to Upload
								</Button>
							</Upload>
						</CustomDiv>
						<CustomDiv flexBasis="30ch" type="flex" width="100%">
							<label>Blend</label>
							<Upload name="file" accept=".zip,.glb,.blend">
								<Button>
									<Icon type="upload" /> Click to Upload
								</Button>
							</Upload>
						</CustomDiv>
					</Form>
				</CustomDiv>
			</ShadowDiv>
		</StepsContainer>
	);
};

export default function Stage({ stage }: Stage): JSX.Element {
	switch (stage) {
		case "assets":
			return UploadStep();
	}
}
