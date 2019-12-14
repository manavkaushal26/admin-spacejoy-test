import React, { useState, useMemo, useEffect } from "react";
import {
	StepsContainer,
	ShadowDiv,
	CustomDiv,
	SilentDivider,
	Form,
	EndCol,
	BorderedParagraph,
	FitIcon
} from "@sections/Dashboard/styled";
import { Avatar, Typography, Upload, Button, Icon, Select, Input, Drawer, Row, Col, Spin } from "antd";
import {
	RoomTypes,
	Model3DFiles,
	ModelToExtensionMap,
	DetailedDesign,
	RoomLabels,
	DesignImgTypes,
	DesignImagesInterface,
	DesignerImageComments
} from "@customTypes/dashboardTypes";
import { uploadRoomApi, uploadRenderImages, addRenderImageComment } from "@api/pipelineApi";

import { cookieNames } from "@utils/config";
import getCookie from "@utils/getCookie";
import { UploadFile, UploadChangeParam } from "antd/lib/upload/interface";
import { getValueSafely } from "@utils/commonUtils";
import Image from "@components/Image";
import User, { Status } from "@customTypes/userType";
import { getLocalStorageValue } from "@utils/storageUtils";
import fetcher from "@utils/fetcher";

const { Title, Text } = Typography;
const { Option } = Select;
interface Stage {
	designData: DetailedDesign;
	refetchDesignData: () => void;
	stage: string;
}

const UploadStep: React.FC<Stage> = ({ designData, refetchDesignData }) => {
	const [roomType, setRoomType] = useState<RoomTypes>(RoomTypes.LivingRoom);
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
		return false;
	};

	const handleNameChange = e => {
		const {
			target: { value }
		} = e;
		setRoomName(value);
	};

	const handleOnFileUploadChange = (info: UploadChangeParam<UploadFile>) => {
		if (info.file.status === "done") {
			refetchDesignData();
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

const Design3D: React.FC = () => {
	return (
		<StepsContainer>
			<ShadowDiv>
				<CustomDiv type="flex" justifyContent="space-evenly" width="100%" px="1rem" py="1rem">
					<CustomDiv inline>
						<a target="_blank" href="https://apps.apple.com/us/app/spacejoy/id1489951014?ls=1&mt=12">
							<Image src="q_80,w_284/v1571050296/shared/app-store_dvz21i.png" alt="macStore" width="284px" />
						</a>
					</CustomDiv>
					<CustomDiv inline>
						<a target="_blank" href="//www.microsoft.com/store/apps/9n954dnxj4zx?cid=storebadge&ocid=badge">
							<Image
								src="q_80,w_284/v1571050296/shared/windows_m7lpx7.png"
								alt="Microsoft Store"
								width="284px"
								height="104px"
							/>
						</a>
					</CustomDiv>
				</CustomDiv>
			</ShadowDiv>
		</StepsContainer>
	);
};

const RenderDesign: React.FC<Stage> = ({ designData, refetchDesignData }) => {
	const [imageType, setImageType] = useState<DesignImgTypes>(DesignImgTypes.Render);

	const uploadRenderImage = useMemo(() => uploadRenderImages(designData._id, imageType), [designData._id, imageType]);

	const handleOnFileUploadChange = (info: UploadChangeParam<UploadFile>) => {
		if (info.file.status === "done") {
			refetchDesignData();
		}
	};

	const onSelect = selectedValue => {
		setImageType(selectedValue);
	};

	return (
		<StepsContainer>
			<ShadowDiv>
				<CustomDiv type="flex" justifyContent="space-evenly" width="100%" px="1rem" py="1rem">
					<CustomDiv flexBasis="30ch" align="baseline" type="flex" flexDirection="row">
						<label>Image Type</label>
						<CustomDiv inline pl="1rem" flexBasis="15ch">
							<Select value={imageType} onSelect={onSelect} style={{ width: "100%" }}>
								{Object.keys(DesignImgTypes).map(key => {
									return (
										<Option key={key} value={DesignImgTypes[key]}>
											{key}
										</Option>
									);
								})}
							</Select>
						</CustomDiv>
					</CustomDiv>
					<CustomDiv flexBasis="30ch" width="100%">
						<label>Source File</label>
						<CustomDiv inline pl="1rem">
							<Upload
								multiple
								supportServerRender={true}
								name="files"
								action={uploadRenderImage}
								onChange={handleOnFileUploadChange}
								headers={{ Authorization: getCookie(null, cookieNames.authToken) }}
								accept="image/*"
							>
								<Button
									disabled={
										getValueSafely(() => designData.phases.design3D.status, Status.pending) !== Status.completed
									}
								>
									<Icon type="upload" />
									Click to Upload
								</Button>
							</Upload>
						</CustomDiv>
					</CustomDiv>
				</CustomDiv>
			</ShadowDiv>
		</StepsContainer>
	);
};

interface ImagesCommentDrawer {
	imageId: string;
	designId: string;
	imageComments: DesignerImageComments[];
	setImageComments: (comments: DesignerImageComments[]) => void;
	setImageId: React.Dispatch<React.SetStateAction<string>>;
}

const ImageCommentDrawer: React.FC<ImagesCommentDrawer> = ({
	imageId,
	imageComments,
	designId,
	setImageComments,
	setImageId
}) => {
	const [authVerification, setAuthVerification] = useState<User>(null);
	const [newComment, setNewComment] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		setAuthVerification(getLocalStorageValue<User>("authVerification"));
	}, []);

	const saveComment = async () => {
		setLoading(true);
		const endpoint = addRenderImageComment(designId, imageId);
		const body = [...imageComments];
		await fetcher({ endPoint: endpoint, body: { data: { comments: body } }, method: "PUT" });
		setLoading(false);
	};

	useEffect(() => {
		if (imageId) saveComment();
	}, [imageId, imageComments]);

	const addNote = async () => {
		const body = [...imageComments];
		console.log(body);
		const data: DesignerImageComments[] = [
			{
				author: authVerification.name,
				text: newComment,
				status: Status.pending
			},
			...body
		];
		await setImageComments(data);
	};

	const onNewComment = e => {
		const {
			target: { value }
		} = e;
		setNewComment(value);
	};

	const editImageComments = (id: string, value) => {
		const modifiedImageComments = imageComments.map(comment => {
			if (comment._id === id) {
				comment.text = value;
				comment.status = Status.pending;
			}
			return {
				...comment
			};
		});
		setImageComments(modifiedImageComments);
	};

	const deleteImageComments = (text: string) => {
		const modifiedImageComments = imageComments.filter(image => {
			return image.text !== text;
		});
		setImageComments(modifiedImageComments);
	};

	return (
		<Drawer width="640" visible={!!imageId} onClose={() => setImageId(null)}>
			<CustomDiv height="100%">
				<Spin spinning={loading}>
					<Row type="flex" align="stretch" justify="start">
						<Col span={2}>
							<CustomDiv px="12px">
								<Avatar>{getValueSafely(() => authVerification.name[0], "")}</Avatar>
							</CustomDiv>
						</Col>
						<Col sm={22} md={22} lg={18} xl={14}>
							<Input.TextArea onChange={onNewComment} autosize={{ minRows: 2 }} />
						</Col>
					</Row>
					<CustomDiv py="10px">
						<Row type="flex">
							<Col span={2} />
							<EndCol md={22} lg={18} xl={14}>
								<Button type="primary" onClick={addNote}>
									Add Comment
								</Button>
							</EndCol>
						</Row>
					</CustomDiv>
					{imageComments.map(comment => (
						<CustomDiv py="12px" key={getValueSafely(() => comment._id, "")}>
							<Row type="flex" align="stretch" justify="start">
								<CustomDiv width="100%" inline type="flex" textOverflow="ellipsis" py="16px" align="center">
									<CustomDiv textOverflow="ellipsis" inline type="flex" px="12px">
										<Avatar>{getValueSafely(() => comment.author[0], "")}</Avatar>{" "}
									</CustomDiv>
									<Text strong ellipsis>
										{getValueSafely(() => comment.author, "")}
									</Text>
									{authVerification.name === comment.author && (
										<CustomDiv px="8px">
											<FitIcon onClick={() => deleteImageComments(comment.text)} theme="twoTone" type="delete" />
										</CustomDiv>
									)}
								</CustomDiv>
							</Row>
							<Row>
								<Col span={2} />
								<Col md={22} lg={18} xl={14}>
									<BorderedParagraph
										editable={
											comment.author === authVerification.name
												? {
														onChange: (value: string) => {
															editImageComments(comment._id, value);
														}
												  }
												: false
										}
									>
										{comment.text}
									</BorderedParagraph>
								</Col>
							</Row>
						</CustomDiv>
					))}
				</Spin>
			</CustomDiv>
		</Drawer>
	);
};

const RevisionStage: React.FC<Stage> = ({ designData }) => {
	const [designImages, setDesignImages] = useState<DesignImagesInterface[]>([]);
	const [imageId, setImageId] = useState<string>(null);
	useEffect(() => {
		if (designData) {
			setDesignImages(designData.designImages);
		}
	}, [designData.designImages]);

	const selectedImageComments: DesignerImageComments[] = useMemo(() => {
		return getValueSafely(
			() => [
				...designImages.find(image => {
					return image._id === imageId;
				}).comments
			],
			[]
		);
	}, [imageId, designImages]);

	const setImageComments = (comments: DesignerImageComments[]): void => {
		const selectedDesignIndex = designImages.map(image => image._id).indexOf(imageId);
		designImages[selectedDesignIndex].comments = comments;
		setDesignImages([...designImages]);
	};

	return (
		<StepsContainer>
			<ShadowDiv>
				<CustomDiv display="flex" flexDirection="column">
					<CustomDiv type="flex" justifyContent="space-evenly" flexWrap="wrap" width="100%" px="1rem" py="1rem">
						{designImages.map(image => {
							return (
								<CustomDiv
									px="1rem"
									py="1rem"
									type="flex"
									flexBasis="50ch"
									flexDirection="column"
									justifyContent="center"
								>
									<Image width="100%" src={`q_80,w_400/${image.cdn}`} />
									<CustomDiv>
										<Button block onClick={() => setImageId(image._id)}>
											{"Add Comments"}
										</Button>
									</CustomDiv>
								</CustomDiv>
							);
						})}
					</CustomDiv>
					<SilentDivider />

					<CustomDiv
						type="flex"
						justifyContent="space-evenly"
						flexWrap="wrap"
						flexDirection="column"
						width="100%"
						px="1rem"
						py="1rem"
					>
						<Title level={4}>Designer Note</Title>
						<Input.TextArea style={{ marginBottom: "1rem" }} autoSize={{ minRows: 2 }}></Input.TextArea>
						<Button>Add Note</Button>
					</CustomDiv>
				</CustomDiv>
			</ShadowDiv>
			<ImageCommentDrawer
				setImageId={setImageId}
				imageId={imageId}
				designId={designData._id}
				imageComments={selectedImageComments}
				setImageComments={setImageComments}
			/>
		</StepsContainer>
	);
};

export default function Stage(props: Stage): JSX.Element {
	switch (props.stage) {
		case "concept":
			return <UploadStep {...props} />;
		case "design3D":
			return <Design3D />;
		case "render":
			return <RenderDesign {...props} />;
		case "revision":
			return <RevisionStage {...props} />;
		default:
			return (
				<CustomDiv px="1rem" py="1rem">
					<ShadowDiv>
						<CustomDiv type="flex" justifyContent="center">
							<Text>Work in Progress</Text>
						</CustomDiv>
					</ShadowDiv>
				</CustomDiv>
			);
	}
}
