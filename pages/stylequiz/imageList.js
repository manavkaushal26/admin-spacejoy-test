import { ArrowLeftOutlined, DeleteOutlined } from "@ant-design/icons";
import Image from "@components/Image";
import { MaxHeightDiv } from "@sections/Dashboard/styled";
import PageLayout from "@sections/Layout";
import fetcher from "@utils/fetcher";
import { Button, Card, Col, Input, Popconfirm, Row, Select, Spin, Typography } from "antd";
import { useRouter } from "next/router";
import { LoudPaddingDiv } from "pages/platformanager";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { createResource, deleteResource, styleFetcher } from "./helper";
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

const adminImageEndpoint = "/quiz/admin/v1/image";
const getImagesEndpoint = "/quiz/admin/v1/images";

export default function ImageList({ query }) {
	const { styleId } = query;
	const [selectedProductId, setSelectedProductId] = useState("");
	const [images, setImages] = useState([]);
	const [isModalVisible, setModalVisibility] = useState(false);
	const [styles, setStylesData] = useState([]);
	const [isLoading, setLoader] = useState(false);
	const Router = useRouter();

	const fetchResources = async endPoint => {
		try {
			const resData = await fetcher({ endPoint, method: "GET" });
			const { data, statusCode } = resData;
			if (statusCode && statusCode <= 201) {
				return data;
			} else {
				throw new Error();
			}
		} catch {
			throw new Error();
		}
	};

	const getLatestImages = endPoint => {
		fetchResources(endPoint)
			.then(res => {
				setImages(res.images);
			})
			.catch(err => console.log(err))
			.finally(() => {});
	};

	const handleChange = value => {
		Router.push({ pathname: "/stylequiz/imageList", query: { styleId: value } }, `/stylequiz/imageList/${value}`);
	};

	useEffect(() => {
		styleFetcher("/quiz/admin/v1/styles/active", "GET")
			.then(res => {
				setStylesData(res.data);
				Router.push(
					{ pathname: "/stylequiz/imageList", query: { styleId: res.data[0]?.id } },
					`/stylequiz/imageList/${res.data[0]?.id}`
				);
			})
			.catch(err => console.log(err));
	}, []);

	useEffect(() => {
		setImages([]);
		getLatestImages(`${getImagesEndpoint}/${styleId}`);
	}, [Router]);

	const deleteImage = async id => {
		await deleteResource(adminImageEndpoint, { imageId: id });
		getLatestImages(`${getImagesEndpoint}/${styleId}`);
	};

	const handleUpload = e => {
		uploadImage(e.target.files[0]);
	};

	const uploadImage = async image => {
		setLoader(true);
		const formData = new FormData();
		formData.append("image", image, image.fileName);
		const resData = await createResource(adminImageEndpoint, formData);
		const { imageId } = resData;
		showModal(imageId);
		getLatestImages("/quiz/v1/images");
		setLoader(false);
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
												defaultValue={styles[0]?.id}
											>
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
									<Col sm={24} md={18} align='right'>
										<Button style={{ position: "relative" }} type='primary'>
											Add Image
											<StyledInput
												onChange={handleUpload}
												type='file'
												accept='image/jpeg,image/jpg,image/JPEG,image/JPG'
											/>
										</Button>
									</Col>
								</Row>
							</Card>
							<br></br>
							<Row gutter={[12, 16]}>
								{images.length ? (
									images.map(item => {
										return (
											<Col sm={12} md={8} lg={6}>
												<Card
													actions={[
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
														<Button type='link' onClick={() => showModal(item?.id)}>
															Add Scores
														</Button>,
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
