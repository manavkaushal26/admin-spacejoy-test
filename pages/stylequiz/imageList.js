import { ArrowLeftOutlined, DeleteOutlined, InfoCircleOutlined } from "@ant-design/icons";
import * as StyleQuizAPI from "@api/styleQuizApis";
import Image from "@components/Image";
import { MaxHeightDiv } from "@sections/Dashboard/styled";
import PageLayout from "@sections/Layout";
import { modifyFormDataResource, multiFileUploader, styleFetcher, updateResource } from "@utils/styleQuizHelper";
import { Button, Card, Checkbox, Col, Input, Popconfirm, Row, Select, Spin, Switch, Tooltip, Typography } from "antd";
import { useRouter } from "next/router";
import { LoudPaddingDiv } from "pages/platformanager";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ScoreModal from "./scoreModal";

const { Title } = Typography;
const StyledInput = styled(Input)`
	opacity: 0;
	position: absolute;
	left: 0;
	top: 0;
	cursor: pointer;
	z-index: 10;
`;

const Wrapper = styled.div`
	input[type="file"],
	input[type="file"]::-webkit-file-upload-button {
		cursor: pointer;
		z-index: 12;
	}
`;

export default function ImageList({ query }) {
	const { styleId } = query;
	const [selectedProductId, setSelectedProductId] = useState("");
	const [images, setImages] = useState([]);
	const [isModalVisible, setModalVisibility] = useState(false);
	const [styles, setStylesData] = useState([]);
	const [isTaggedStatus, setIsTaggedStatus] = useState(false);
	const [isLoading, setLoader] = useState(false);
	const [isCheckboxVisible, setCheckboxVisibility] = useState(false);
	const Router = useRouter();

	const getLatestImages = endPoint => {
		styleFetcher(endPoint)
			.then(res => {
				setImages(res.images);
			})
			.catch(err => {
				throw new Error();
			});
	};

	const getImagesById = endPoint => {
		styleFetcher(endPoint)
			.then(res => {
				setImages(res.images);
			})
			.catch(err => {
				throw new Error();
			});
	};

	const handleChange = value => {
		if (value === "all") {
			Router.replace({ pathname: "/stylequiz/imageList", query: { styleId: "all" } }, "/stylequiz/imageList/all");
			setCheckboxVisibility(true);
			setIsTaggedStatus(false);
		} else {
			Router.replace({ pathname: "/stylequiz/imageList", query: { styleId: value } }, `/stylequiz/imageList/${value}`);
			setCheckboxVisibility(false);
		}
	};

	useEffect(() => {
		setCheckboxVisibility(true);
		styleFetcher(StyleQuizAPI.getActiveStylesAPI(), "GET")
			.then(res => {
				const id = Router?.query?.styleId ? Router?.query?.styleId : "all";
				setStylesData(res.data);
				Router.replace({ pathname: "/stylequiz/imageList", query: { styleId: id } }, `/stylequiz/imageList/${id}`);
			})
			.catch(err => {
				throw new Error();
			});
	}, []);

	useEffect(() => {
		setImages([]);
		if (styleId && styleId !== "undefined") {
			if (styleId !== "all") {
				setCheckboxVisibility(false);
				getImagesById(`${StyleQuizAPI.adminGetImagesAPI(styleId)}`);
			} else {
				getLatestImages(StyleQuizAPI.getAllImagesAPI());
			}
		}
	}, [Router]);

	const deleteImage = async id => {
		await updateResource(StyleQuizAPI.getAllImagesAPI(), "DELETE", { imageId: id });
		setImages([]);
		updateImageView();
	};

	const handleUpload = e => {
		uploadImage(e.target.files);
	};

	const uploadImage = async images => {
		setLoader(true);
		const formData = multiFileUploader(images);
		const resData = await modifyFormDataResource(StyleQuizAPI.getAllImagesAPI(), "POST", formData);

		updateImageView();
		setLoader(false);
		if (images.length === 1) {
			const { imageId } = resData?.data[0];
			showModal(imageId);
		}
	};

	const updateStatus = async (checked, id) => {
		const newState = images.map(item => {
			if (item.id === id) {
				return { ...item, active: checked };
			}
			return { ...item };
		});
		setImages(newState);
		await updateResource(StyleQuizAPI.getAllImagesAPI(), "PUT", { imageId: id, active: checked ? "yes" : "no" });
	};

	const showModal = id => {
		setSelectedProductId(id);
		setModalVisibility(true);
	};

	const handleModalOk = e => {
		setModalVisibility(false);
	};

	const handleModalCancel = e => {
		setModalVisibility(false);
	};

	const updateImageView = () => {
		if (styleId === "all") {
			if (isTaggedStatus) {
				getLatestImages(StyleQuizAPI.getAllUntaggedImagesAPI());
			} else {
				getLatestImages(StyleQuizAPI.getAllImagesAPI());
			}
		} else {
			getImagesById(`${StyleQuizAPI.adminGetImagesAPI(styleId)}`);
		}
	};

	const changeTaggedStatus = e => {
		let endPoint = null;
		const checked = e.target.checked;
		setIsTaggedStatus(checked);
		setImages([]);
		if (checked) {
			endPoint = StyleQuizAPI.getAllUntaggedImagesAPI();
		} else {
			endPoint = StyleQuizAPI.getAllImagesAPI();
		}
		styleFetcher(endPoint, "GET")
			.then(res => {
				setImages(res.images);
			})
			.catch(err => {
				throw new Error();
			});
	};

	const defaultStyleValue =
		Router?.query?.styleId !== "all"
			? styles.filter(style => style?.id === parseInt(Router?.query?.styleId))[0]?.id
			: "all";
	return (
		<PageLayout pageName='Styles List'>
			<MaxHeightDiv>
				<LoudPaddingDiv>
					<Col span={24}>
						<Title level={3}>
							<Row gutter={[8, 8]}>
								<Col>
									<ArrowLeftOutlined onClick={() => Router.back()} />
								</Col>
								<Col>Go Back</Col>
							</Row>
						</Title>
					</Col>
					<br></br>
					<Spin spinning={isLoading}>
						<Wrapper>
							<Card>
								<Row gutter={[4, 16]}>
									<Col sm={24} md={6}>
										{styles.length ? (
											<Select
												showSearch
												filterOption={(input, option) =>
													option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
												}
												style={{ width: "100%" }}
												onChange={handleChange}
												defaultValue={defaultStyleValue}
											>
												<Select.Option key='all' value='all'>
													All
												</Select.Option>
												{styles.map((style, index) => {
													return (
														<Select.Option key={style?.id} value={style?.id}>
															{style?.name}
														</Select.Option>
													);
												})}
											</Select>
										) : null}
									</Col>
									<Col sm={24} md={6} style={{ padding: 15 }}>
										{isCheckboxVisible ? (
											<>
												<Checkbox checked={isTaggedStatus} onChange={changeTaggedStatus}>
													Show Untagged Images
												</Checkbox>
												<Tooltip title='See all the room images without scores.'>
													<InfoCircleOutlined></InfoCircleOutlined>
												</Tooltip>
											</>
										) : null}
									</Col>
									<Col sm={24} md={12} align='right'>
										{Router?.query?.styleId === "all" ? (
											<Button style={{ position: "relative" }} type='primary'>
												Add Image
												<StyledInput
													onChange={handleUpload}
													type='file'
													accept='image/jpeg,image/jpg,image/JPEG,image/JPG,image/png,image/PNG,.svg'
													multiple
												/>
											</Button>
										) : null}
									</Col>
								</Row>
							</Card>
							<br></br>
							<Row gutter={[12, 16]}>
								{images.length ? (
									[...images]
										.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
										.map(item => {
											return (
												<Col sm={12} md={8} lg={8} key={item?.id}>
													{/* q_70,w_300,h_180 */}
													<Card
														actions={[
															<Switch
																checked={item?.active}
																onChange={checked => updateStatus(checked, item?.id)}
																key={item?.id}
															/>,
															<Button type='link' onClick={() => showModal(item?.id)} key={item?.id}>
																Add Scores
															</Button>,
															<Popconfirm
																placement='top'
																onConfirm={() => deleteImage(item?.id)}
																title='Are you sure you want to delete?'
																okText='Yes'
																disabled={false}
																cancelText='Cancel'
																key={item?.id}
															>
																<DeleteOutlined />
															</Popconfirm>,
														]}
														hoverable
														cover={<Image src={`/${item?.cdn}.jpg`} width='100%' staticUrl />}
													></Card>
												</Col>
											);
										})
								) : (
									<Card style={{ width: "100%" }} align='center'>
										<Row gutter={[4, 16]}>
											<Col sm={24} md={24} lg={24}>
												<p>No Images to show.</p>
											</Col>
										</Row>
									</Card>
								)}
							</Row>
						</Wrapper>
					</Spin>
					{isModalVisible ? (
						<ScoreModal
							isModalVisible={isModalVisible}
							selectedProductId={selectedProductId}
							handleModalOk={handleModalOk}
							handleModalCancel={handleModalCancel}
							styles={styles}
						/>
					) : null}
				</LoudPaddingDiv>
			</MaxHeightDiv>
		</PageLayout>
	);
}

ImageList.getInitialProps = ({ query }) => {
	return { query };
};
