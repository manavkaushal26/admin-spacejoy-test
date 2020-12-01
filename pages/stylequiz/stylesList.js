import {
	ArrowLeftOutlined,
	DeleteOutlined,
	EditOutlined,
	FileImageOutlined,
	LoadingOutlined,
	PlusOutlined,
} from "@ant-design/icons";
import { MaxHeightDiv } from "@sections/Dashboard/styled";
import PageLayout from "@sections/Layout";
import { redirectToLocation } from "@utils/authContext";
import chatFetcher from "@utils/chatFetcher";
import fetcher from "@utils/fetcher";
import { Button, Col, Input, Modal, notification, Row, Switch, Table, Typography, Upload } from "antd";
import Link from "next/link";
import { LoudPaddingDiv } from "pages/platformanager";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { deleteResource, styleFetcher } from "./helper";
const { Title, Text } = Typography;
const { TextArea } = Input;
const EditIcon = styled(Button)`
	cursor: pointer;
`;
const ModalContent = styled.div`
	textarea {
		resize: none;
	}
`;

const StyledInput = styled(Input)`
	opacity: 0;
	position: absolute;
	left: 0;
	top: 0;
	cursor: pointer;
	z-index: 10;
`;

const StyleIcon = styled(Button)`
	cursor: pointer;
`;

const endPoints = {
	getStyles: "/quiz/admin/v1/styles?limit=100",
	getActiveStyles: "/quiz/admin/v1/styles/active",
	updateStyle: "/quiz/admin/v1/style/update",
	getIcons: "/quiz/v1/style/icons",
	modifyIcon: "/quiz/admin/v1/style/icon",
};

export default function StylesList() {
	const [styles, setStylesData] = useState([]);
	const [icons, setIcons] = useState([]);
	const [isLoading, setLoader] = useState(false);
	const [isModalVisible, setModalVisibility] = useState(false);
	const [modalType, setModalType] = useState("");
	const [activeStyle, setActiveStyle] = useState({});
	const [styleImageUrl, setStyleImage] = useState("");
	const [styleImageObject, setStyleImageObject] = useState({});
	const textareaRef = useRef(null);
	useEffect(() => {
		setLoader(true);
		styleFetcher(endPoints.getStyles, "GET")
			.then(res => {
				setStylesData(res.data);
				setLoader(false);
			})
			.catch(err => console.log(err))
			.finally(() => {
				setLoader(false);
			});
	}, []);

	const getLatestStyles = () => {
		styleFetcher(endPoints.getStyles, "POST")
			.then(res => {
				setStylesData([...res.data, ...styles]);
			})
			.catch(err => console.log(err))
			.finally(() => {});
	};

	const updateStyleStatus = async (checked, id) => {
		try {
			await fetcher({
				endPoint: endPoints.getActiveStyles,
				method: "POST",
				body: { styleId: id, active: checked ? "yes" : "no" },
			});
		} catch {
			throw new Error();
		} finally {
		}
	};

	const handleToggle = async (checked, id) => {
		await updateStyleStatus(checked, id);
	};

	const showModal = (row, type) => {
		setModalVisibility(true);
		setActiveStyle(row);
		if (type === "edit") {
			setModalType("edit");
		} else {
			setModalType("icons");
			getIcons(row?.id);
		}
	};

	const handleModalOk = () => {
		if (modalType === "edit") {
			saveStyleInfo();
		}
		setModalVisibility(false);
	};

	const getBase64 = (img, callback) => {
		const reader = new FileReader();
		reader.addEventListener("load", () => callback(reader.result));
		reader.readAsDataURL(img);
	};

	const handleUpload = info => {
		if (info.file.status === "uploading") {
			setLoader(true);
			return;
		}
		if (info.file.status === "done") {
			setStyleImageObject(info?.fileList[0]);
			getBase64(info.file.originFileObj, imageUrl => {
				setStyleImage(imageUrl);
				setLoader(false);
			});
		}
	};

	const saveStyleInfo = async () => {
		setLoader(true);
		const formData = new FormData();
		formData.append("image", styleImageObject);
		formData.append("desc", textareaRef?.current?.state?.value ? textareaRef.current.state.value : "");
		formData.append("styleId", activeStyle?.id);
		try {
			await chatFetcher({ endPoint: endPoints.updateStyle, method: "POST", body: formData });
		} catch (err) {
			notification.error({ message: err });
		}
		setStyleImage("");
		textareaRef.current.state.value = "";
		setLoader(false);
	};

	const uploadButton = (
		<div>
			{isLoading ? <LoadingOutlined /> : <PlusOutlined />}
			<div style={{ marginTop: 8 }}>Upload</div>
		</div>
	);

	const getIcons = id => {
		styleFetcher(`${endPoints.getIcons}/${id}`, "GET")
			.then(res => {
				setIcons(res.data);
				setLoader(false);
			})
			.catch(err => console.log(err))
			.finally(() => {
				setLoader(false);
			});
	};

	const createIcon = async e => {
		setLoader(true);
		const formData = new FormData();
		formData.append("image", e.target.files[0]);
		formData.append("text", "test");
		formData.append("styleId", activeStyle?.id);
		try {
			await chatFetcher({ endPoint: endPoints.modifyIcon, method: "POST", body: formData });
		} catch (err) {
			notification.error({ message: err });
		}
		setLoader(false);
	};

	const deleteIcon = async id => {
		setLoader(true);
		await deleteResource(endPoints.modifyIcon, { styleIconId: id });
		setLoader(false);
	};

	return (
		<PageLayout pageName='Styles List'>
			<MaxHeightDiv>
				<LoudPaddingDiv>
					<Col span={24}>
						<Title level={3}>
							<Row gutter={[8, 8]}>
								<Col>
									<ArrowLeftOutlined onClick={() => redirectToLocation({ pathname: "/stylequiz" })} />
								</Col>
								<Col>Go Back</Col>
							</Row>
						</Title>
					</Col>
					<br></br>
					<Row gutter={[4, 16]}>
						<Col sm={24} align='right'>
							{/* <Button type='primary' onClick={getLatestStyles}>
								Resync
							</Button> */}
						</Col>
					</Row>
					<Row gutter={[0, 16]}>
						<Col span={24}>
							<Table loading={isLoading} rowKey='_id' scroll={{ x: 768 }} dataSource={styles}>
								<Table.Column
									key='_id'
									title='Style Name'
									render={styles => {
										return (
											<Row>
												<Col span={24}>{styles.name}</Col>
											</Row>
										);
									}}
								/>
								<Table.Column
									key='id'
									title='Is Active'
									dataIndex='id'
									render={(text, record) => {
										return <Switch defaultChecked={record.active} onChange={checked => handleToggle(checked, text)} />;
									}}
								/>
								<Table.Column
									key='id'
									title='Description'
									dataIndex='description'
									render={text => (
										<span>
											{text || "N/A"}
											&nbsp;&nbsp;&nbsp;
										</span>
									)}
								/>
								<Table.Column key='id' title='Image' dataIndex='cdn' render={(text, record) => <img src={text} />} />
								<Table.Column
									key='id'
									title='Go to'
									dataIndex='id'
									align='right'
									render={record => (
										<>
											<Link href={`/stylequiz/productList/${record.id}`} type='link'>
												Products
											</Link>
											&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
											<Link href={`/stylequiz/imageList/${record.id}`} type='link'>
												Room Designs
											</Link>
											&nbsp;&nbsp;
										</>
									)}
								/>
								<Table.Column
									key='id'
									title='Icons'
									dataIndex=''
									align='right'
									render={(text, record) => (
										<StyleIcon type='link' onClick={() => showModal(record, "icons")}>
											<FileImageOutlined />
										</StyleIcon>
									)}
								/>
								<Table.Column
									key='id'
									title=''
									dataIndex=''
									align='right'
									render={(text, record) => (
										<span>
											<EditIcon type='link' onClick={() => showModal(record, "edit")}>
												<EditOutlined />
											</EditIcon>
										</span>
									)}
								/>
							</Table>
						</Col>
					</Row>
				</LoudPaddingDiv>
				<Modal
					title='Edit Style'
					visible={isModalVisible}
					onOk={() => handleModalOk("style-modal")}
					onCancel={() => setModalVisibility(false)}
					width={1000}
					okText='Save'
				>
					{modalType === "edit" ? (
						<ModalContent>
							<div className='flex'>
								<span>Description</span>
								<br></br>
								<TextArea ref={textareaRef} />
							</div>
							<br></br>
							<div className='flex'>
								<span>Upload Image</span>
								<br></br>
								<Upload
									name='avatar'
									listType='picture-card'
									className='avatar-uploader'
									showUploadList={false}
									action='https://www.mocky.io/v2/5cc8019d300000980a055e76'
									onChange={handleUpload}
								>
									{styleImageUrl ? <img src={styleImageUrl} alt='avatar' style={{ width: "100%" }} /> : uploadButton}
								</Upload>
							</div>
						</ModalContent>
					) : (
						<ModalContent>
							<Row gutter={[4, 16]}>
								<Col sm={24} align='right'>
									<Button style={{ position: "relative" }} type='primary'>
										Add Icon
										<StyledInput onChange={createIcon} type='file' />
									</Button>
								</Col>
							</Row>
							<Table rowKey='_id' scroll={{ x: 768 }} dataSource={icons}>
								<Table.Column key='id' title='Icons' dataIndex='' render={(text, record) => <img src={text} />} />
								<Table.Column
									key='id'
									title='Actions'
									dataIndex=''
									render={(text, record) => <DeleteOutlined onClick={() => deleteIcon(record?.id)} />}
								/>
							</Table>
						</ModalContent>
					)}
				</Modal>
			</MaxHeightDiv>
		</PageLayout>
	);
}
