import { ArrowLeftOutlined, DeleteOutlined } from "@ant-design/icons";
import * as StyleQuizAPI from "@api/styleQuizApis";
import Image from "@components/Image";
import { MaxHeightDiv } from "@sections/Dashboard/styled";
import PageLayout from "@sections/Layout";
import { modifyFormDataResource, multiFileUploader, styleFetcher, updateResource } from "@utils/styleQuizHelper";
import { Button, Card, Checkbox, Col, Input, Popconfirm, Row, Select, Spin, Switch, Typography } from "antd";
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
	const Router = useRouter();

	const getLatestImages = endPoint => {
		styleFetcher(endPoint)
			.then(res => {
				console.log(res);
				setImages(res.images);
			})
			.catch(err => console.log(err))
			.finally(() => {});
	};

	const handleChange = value => {
		if (value === "all") {
			Router.replace({ pathname: "/stylequiz/imageList", query: { styleId: 0 } }, `/stylequiz/imageList/all`);
		} else {
			Router.replace({ pathname: "/stylequiz/imageList", query: { styleId: value } }, `/stylequiz/imageList/${value}`);
		}
	};

	useEffect(() => {
		styleFetcher(StyleQuizAPI.getActiveStylesAPI(), "GET")
			.then(res => {
				setStylesData(res.data);
				Router.replace({ pathname: "/stylequiz/imageList", query: { styleId: 0 } }, `/stylequiz/imageList/all`);
			})
			.catch(err => console.log(err));
	}, []);

	useEffect(() => {
		setImages([]);
		if (styleId) {
			if (styleId !== "0") {
				getLatestImages(`${StyleQuizAPI.adminGetImagesAPI()}/${styleId}`);
			} else {
				getLatestImages(StyleQuizAPI.getAllImagesAPI());
			}
		}
	}, [Router]);

	const deleteImage = async id => {
		await updateResource(StyleQuizAPI.adminImageAPI(), "DELETE", { imageId: id });
		setImages([]);
		updateImageView();
	};

	const handleUpload = e => {
		uploadImage(e.target.files);
	};

	const uploadImage = async images => {
		setLoader(true);
		const formData = multiFileUploader(images);
		const resData = await modifyFormDataResource(StyleQuizAPI.adminImageAPI(), "POST", formData);
		const { imageId } = resData;
		updateImageView();
		setLoader(false);
		if (images.length === 1) {
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
		await updateResource(StyleQuizAPI.adminImageAPI(), "PUT", { imageId: id, active: checked ? "yes" : "no" });
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
		if (styleId === "0") {
			if (isTaggedStatus) {
				getLatestImages(StyleQuizAPI.getAllUntaggedImagesAPI());
			} else {
				getLatestImages(StyleQuizAPI.getAllImagesAPI());
			}
		} else {
			getLatestImages(`${StyleQuizAPI.adminGetImagesAPI()}/${styleId}`);
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
				// console.log("res", res);
				setImages(res.images);
			})
			.catch(err => console.log(err));
	};

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
										{styles.length && (
											<Select
												showSearch
												filterOption={(input, option) =>
													option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
												}
												style={{ width: "100%" }}
												onChange={handleChange}
												defaultValue='all'
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
										)}
									</Col>
									<Col sm={24} md={6} style={{ padding: 15 }}>
										<Checkbox checked={isTaggedStatus} onChange={changeTaggedStatus}>
											Show Untagged Images
										</Checkbox>
										,
									</Col>
									<Col sm={24} md={12} align='right'>
										<Button style={{ position: "relative" }} type='primary'>
											Add Image
											<StyledInput
												onChange={handleUpload}
												type='file'
												accept='image/jpeg,image/jpg,image/JPEG,image/JPG'
												multiple
											/>
										</Button>
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
												<Col sm={12} md={8} lg={8}>
													<Card
														actions={[
															<Switch
																checked={item?.active}
																checkedChildren='Active'
																unCheckedChildren='Inactive'
																onChange={checked => updateStatus(checked, item?.id)}
															/>,
															<Button type='link' onClick={() => showModal(item?.id)}>
																Add Scores
															</Button>,
															<Popconfirm
																placement='top'
																onConfirm={() => deleteImage(item?.id)}
																title='Are you sure you want to delete?'
																okText='Yes'
																disabled={false}
																cancelText='Cancel'
															>
																<DeleteOutlined />
															</Popconfirm>,
														]}
														hoverable
														cover={<Image src={`q_70,w_300,h_180/${item?.cdn}`} width='100%' />}
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
					<ScoreModal
						isModalVisible={isModalVisible}
						selectedProductId={selectedProductId}
						handleModalOk={handleModalOk}
						handleModalCancel={handleModalCancel}
						styles={styles}
					/>
				</LoudPaddingDiv>
			</MaxHeightDiv>
		</PageLayout>
	);
}

ImageList.getInitialProps = ({ query }) => {
	return { query };
};
