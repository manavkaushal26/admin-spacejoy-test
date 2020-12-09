import {
	ArrowLeftOutlined,
	DeleteOutlined,
	EditOutlined,
	FileImageOutlined,
	LoadingOutlined,
	PlusOutlined,
	UploadOutlined,
} from "@ant-design/icons";
import * as StyleQuizAPI from "@api/styleQuizApis";
import Image from "@components/Image";
import { MaxHeightDiv } from "@sections/Dashboard/styled";
import PageLayout from "@sections/Layout";
import { redirectToLocation } from "@utils/authContext";
import chatFetcher from "@utils/chatFetcher";
import { styleFetcher, updateResource } from "@utils/styleQuizHelper";
import {
	Button,
	Col,
	Input,
	Modal,
	notification,
	Popconfirm,
	Row,
	Spin,
	Switch,
	Table,
	Typography,
	Upload,
} from "antd";
import Link from "next/link";
import { LoudPaddingDiv } from "pages/platformanager";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
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

export default function StylesList() {
	const [styles, setStylesData] = useState([]);
	const [icons, setIcons] = useState([]);
	const [isLoading, setLoader] = useState(false);
	const [isModalVisible, setModalVisibility] = useState(false);
	const [modalType, setModalType] = useState("");
	const [activeStyle, setActiveStyle] = useState({});
	const [styleImageObject, setStyleImageObject] = useState({});
	const textareaRef = useRef(null);
	const [filteredData, setFilteredData] = useState(null);

	// image filelist
	const [imageList, setImages] = useState({});

	useEffect(() => {
		setLoader(true);
		styleFetcher(StyleQuizAPI.getStylesAPI(), "GET")
			.then(res => {
				setStylesData(res.data);
				setLoader(false);
			})
			.catch(() => notification.error({ message: "Failed to fetch styles" }))
			.finally(() => {
				setLoader(false);
			});
	}, []);

	const handleToggle = async (checked, id) => {
		const newState = styles.map(item => {
			if (item.id === id) {
				return { ...item, active: checked };
			}
			return { ...item };
		});
		setStylesData(newState);
		await updateResource(StyleQuizAPI.getActiveStylesAPI(), "POST", { styleId: id, active: checked ? "yes" : "no" });
	};

	const showModal = (row, type) => {
		setLoader(true);
		setModalVisibility(true);
		setActiveStyle(row);
		if (type === "edit") {
			setModalType("edit");
		} else {
			setModalType("icons");
			getIcons(row?.id);
		}
		setLoader(false);
	};

	const handleModalOk = () => {
		if (modalType === "edit") {
			saveStyleInfo();
		}
		setModalVisibility(false);
	};

	const saveStyleInfo = async () => {
		setLoader(true);
		const formData = new FormData();
		formData.append("image", imageList);
		formData.append("desc", textareaRef?.current?.state?.value ? textareaRef.current.state.value : "");
		formData.append("styleId", activeStyle?.id);
		try {
			await chatFetcher({ endPoint: StyleQuizAPI.updateStyleAPI(), method: "POST", body: formData });
		} catch (err) {
			notification.error({ message: err });
		}
		setStyleImageObject("");
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
		styleFetcher(`${StyleQuizAPI.getStyleIconsAPI()}/${id}`, "GET")
			.then(res => {
				setIcons(res.data);
				setLoader(false);
			})
			.catch(() => notification.error({ message: "Failed to fetch style quiz icons" }))
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
			await chatFetcher({ endPoint: StyleQuizAPI.modifyStyleIconsAPI(), method: "POST", body: formData });
		} catch (err) {
			notification.error({ message: err });
		}
		getIcons(activeStyle?.id);
		setLoader(false);
	};

	const deleteIcon = async id => {
		setLoader(true);
		await updateResource(StyleQuizAPI.modifyStyleIconsAPI(), "DELETE", { styleIconId: id });
		setLoader(false);
		getIcons(activeStyle?.id);
	};

	const search = value => {
		const filteredList = value
			? [...styles].filter(style => style.name.toLowerCase().includes(value.toLowerCase()))
			: null;
		setFilteredData(filteredList);
	};

	const props = {
		name: "file",
		action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
		headers: {
			authorization: "authorization-text",
		},
		onChange({ file }) {
			setImages(file);
		},
		beforeUpload() {
			return false;
		},
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
					<Row gutter={[0, 16]}>
						<Col span={24}>
							<Input.Search
								style={{ border: "2p", margin: "0 0 10px 0" }}
								placeholder='Search by style name ...'
								enterButton
								onSearch={search}
							/>
							<Table
								loading={isLoading}
								rowKey='_id'
								scroll={{ x: 768 }}
								dataSource={filteredData ? filteredData : styles}
							>
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
										return <Switch checked={record.active} onChange={checked => handleToggle(checked, text)} />;
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
								<Table.Column
									key='id'
									title='Image'
									dataIndex='cdn'
									render={(text, record) => <Image style={{ maxWidth: 120 }} src={`q_70,w_120/${text}`} />}
								/>
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
					<Spin spinning={isLoading}>
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
									<Upload {...props}>
										<Button icon={<UploadOutlined />}>Click to Upload</Button>
									</Upload>
									,
								</div>
							</ModalContent>
						) : (
							<ModalContent>
								<Row gutter={[4, 16]}>
									<Col sm={24} align='right'>
										<Button style={{ position: "relative" }} type='primary'>
											Add Icon
											<StyledInput onChange={createIcon} type='file' accept='image/png,image/PNG' />
										</Button>
									</Col>
								</Row>
								<Table rowKey='_id' scroll={{ x: 768 }} dataSource={icons} isLoading={isLoading}>
									<Table.Column
										key='id'
										title='Icons'
										dataIndex='cdn'
										render={(text, record) => <Image src={`q_70,w_75/${text}`} width='75' />}
									/>
									<Table.Column
										key='id'
										title='Actions'
										dataIndex=''
										render={(text, record) => (
											<Popconfirm
												placement='top'
												onConfirm={() => deleteIcon(record?.id)}
												title='Are you sure you want to delete?'
												okText='Yes'
												disabled={false}
												cancelText='Cancel'
											>
												<DeleteOutlined />
											</Popconfirm>
										)}
									/>
								</Table>
							</ModalContent>
						)}
					</Spin>
				</Modal>
			</MaxHeightDiv>
		</PageLayout>
	);
}
