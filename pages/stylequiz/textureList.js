import { ArrowLeftOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import Image from "@components/Image";
import { MaxHeightDiv } from "@sections/Dashboard/styled";
import PageLayout from "@sections/Layout";
import { Button, Card, Col, Input, Popconfirm, Row, Spin, Typography } from "antd";
import { useRouter } from "next/router";
import { LoudPaddingDiv } from "pages/platformanager";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import EditModal from "./editModal";
import { modifyFormDataResource, multiFileUploader, styleFetcher, updateResource } from "./helper";
import * as StyleQuizAPI from "./styleQuizApis";
const { Title } = Typography;
const { TextArea } = Input;
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
const endPoint = StyleQuizAPI.textureAPI();
export default function TextureList() {
	const [textures, setTextures] = useState([]);
	const [isLoading, setLoader] = useState(false);
	const [selectedResource, setSelectedResource] = useState({});
	const [isModalVisible, setIsModalVisible] = useState(false);
	const Router = useRouter();

	useEffect(() => {
		setTextures([]);
		getTextures();
	}, []);

	const getTextures = id => {
		styleFetcher(endPoint)
			.then(res => {
				setTextures(res.data);
			})
			.catch(err => console.log(err))
			.finally(() => {});
	};

	const deleteTexture = async id => {
		await updateResource(endPoint, "DELETE", { id: id });
		getTextures();
	};

	const handleUpload = e => {
		uploadTexture(e.target.files);
	};

	const uploadTexture = async images => {
		setLoader(true);
		const formData = multiFileUploader(images);
		await modifyFormDataResource(endPoint, "POST", formData);
		getTextures();
		setLoader(false);
	};

	const showModal = item => {
		setSelectedResource(item);
		setIsModalVisible(true);
	};

	const handlModaleOk = async (checked, desc, data) => {
		setIsModalVisible(false);
		setTextures(data);
		await updateResource(endPoint, "PUT", {
			id: selectedResource?.id,
			description: desc,
			active: checked ? "yes" : "no",
		});
		getTextures();
	};

	const handleCancel = () => {
		setIsModalVisible(false);
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
									<Col sm={24} md={24} align='right'>
										<Button style={{ position: "relative" }} type='primary'>
											Add Texture
											<StyledInput
												accept='image/jpeg,image/jpg,image/JPEG,image/JPG'
												onChange={handleUpload}
												type='file'
												multiple
											/>
										</Button>
									</Col>
								</Row>
							</Card>
							<br></br>
							<Row gutter={[8, 16]}>
								{textures.length ? (
									textures.map(item => {
										return (
											<Col sm={12} md={8} lg={6}>
												<Card
													actions={[
														<EditOutlined onClick={() => showModal(item)} />,
														<Popconfirm
															placement='top'
															onConfirm={() => deleteTexture(item?.id)}
															title='Are you sure you want to delete?'
															okText='Yes'
															disabled={false}
															cancelText='Cancel'
														>
															<DeleteOutlined />
														</Popconfirm>,
													]}
													hoverable
													cover={<Image src={`q_50,w_300,h_180/${item?.cdn}`} />}
												>
													<p>{item?.description}</p>
												</Card>
											</Col>
										);
									})
								) : (
									<Card style={{ width: "100%" }} align='center'>
										<Row gutter={[4, 16]}>
											<Col sm={24} md={24} lg={24}>
												<p>No Products to show.</p>
											</Col>
										</Row>
									</Card>
								)}
							</Row>
						</Wrapper>
					</Spin>
				</LoudPaddingDiv>
				<EditModal
					isModalVisible={isModalVisible}
					handlModaleOk={(checked, desc, data) => handlModaleOk(checked, desc, data)}
					selectedResource={selectedResource}
					handleCancel={handleCancel}
					data={textures}
				/>
			</MaxHeightDiv>
		</PageLayout>
	);
}
