import { ArrowLeftOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import Image from "@components/Image";
import { MaxHeightDiv } from "@sections/Dashboard/styled";
import PageLayout from "@sections/Layout";
import fetcher from "@utils/fetcher";
import { Button, Card, Col, Input, Popconfirm, Row, Select, Spin, Typography } from "antd";
import { useRouter } from "next/router";
import { LoudPaddingDiv } from "pages/platformanager";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import EditModal from "./editModal";
import { modifyResource, styleFetcher } from "./helper";
import { textureAPI } from "./styleQuizApis";
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

export default function TextureList({ query }) {
	const { styleId } = query;
	const [textures, setTextures] = useState([]);
	const [styles, setStylesData] = useState([]);
	const [isLoading, setLoader] = useState(false);
	const [selectedResource, setSelectedResource] = useState({});
	const [isModalVisible, setIsModalVisible] = useState(false);
	const Router = useRouter();
	const fetchResources = async endPoint => {
		try {
			const resData = await fetcher({ endPoint: endPoint, method: "GET" });
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

	useEffect(() => {
		styleFetcher("/quiz/admin/v1/styles/active", "GET")
			.then(res => {
				setStylesData(res.data);
				Router.replace(
					{ pathname: "/stylequiz/textureList", query: { styleId: res.data[0]?.id } },
					`/stylequiz/textureList/${res.data[0]?.id}`
				);
			})
			.catch(err => console.log(err));
	}, []);

	useEffect(() => {
		setTextures([]);
		getTextures(Router?.query?.styleId);
	}, [Router]);

	const handleChange = value => {
		Router.replace(
			{ pathname: "/stylequiz/textureList", query: { styleId: value } },
			`/stylequiz/textureList/${value}`
		);
	};

	const getTextures = id => {
		if (id) {
			fetchResources(`/quiz/admin/v1/texture`)
				.then(res => {
					setTextures(res.data);
				})
				.catch(err => console.log(err))
				.finally(() => {});
		}
	};

	const deleteTexture = async id => {
		await modifyResource("/quiz/admin/v1/texture", "DELETE", { productId: id });
		getTextures(styleId);
	};

	const handleUpload = e => {
		uploadTexture(e.target.files[0]);
	};

	const uploadTexture = async image => {
		setLoader(true);
		const endPoint = `/quiz/admin/v1/texture`;
		const formData = new FormData();
		formData.append("image", image, image.fileName);
		await modifyResource(endPoint, "POST", formData);
		getTextures(styleId);
		setLoader(false);
	};

	const showModal = item => {
		setSelectedResource(item);
		setIsModalVisible(true);
	};

	const handlModaleOk = async (checked, desc) => {
		setIsModalVisible(false);
		const formData = new FormData();
		formData.append("id", selectedResource?.id);
		formData.append("desc", desc);
		formData.append("active", checked ? "yes" : "no");
		await modifyResource(textureAPI(), "UPDATE", formData);
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
									<Col sm={24} md={6} gutter={[4, 16]}>
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
													return <Select.Option value={style?.id}>{style?.name}</Select.Option>;
												})}
											</Select>
										)}
									</Col>
									<Col sm={24} md={18} align='right'>
										<Button style={{ position: "relative" }} type='primary'>
											Add Texture
											<StyledInput
												accept='image/jpeg,image/jpg,image/JPEG,image/JPG'
												onChange={handleUpload}
												type='file'
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
					handlModaleOk={(checked, id) => handlModaleOk(checked, id)}
					selectedResource={selectedResource}
					handleCancel={handleCancel}
				/>
			</MaxHeightDiv>
		</PageLayout>
	);
}

TextureList.getInitialProps = ({ query }) => {
	return { query };
};
