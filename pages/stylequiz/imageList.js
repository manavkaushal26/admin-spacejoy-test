import { DeleteOutlined } from "@ant-design/icons";
import { MaxHeightDiv } from "@sections/Dashboard/styled";
import PageLayout from "@sections/Layout";
import fetcher from "@utils/fetcher";
import { Button, Card, Col, Input, Modal, Popconfirm, Row, Select, Spin, Table } from "antd";
import { useRouter } from "next/router";
import { LoudPaddingDiv } from "pages/platformanager";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { createResource, deleteResource, styleFetcher } from "./helper";
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

const ScoreBox = styled.p`
	padding: 5px;
	border: 1px solid #efefef;
	/* width: 40px; */
	max-width: 40px;
	margin: 0 auto;
`;

const adminImageEndpoint = "/quiz/admin/v1/image";

export default function ImageList({ query }) {
	const { styleId } = query;
	const [selectedProductId, setSelectedProductId] = useState([]);
	const [scores, setScores] = useState([]);
	const [images, setImages] = useState([]);
	const [isModalVisible, setModalVisibility] = useState(false);
	const [styles, setStylesData] = useState([]);
	const [isLoading, setLoader] = useState(false);
	const [defaultStyleName, setDefaultStyleName] = useState("");
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

	const getLatestImages = id => {
		fetchResources(`/quiz/admin/v1/images/${id}`)
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
		styleFetcher("/quiz/admin/v1/styles", "GET")
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
		getLatestImages(Router?.query?.styleId);
	}, [Router]);

	useEffect(() => {
		getLatestScores();
	}, [selectedProductId]);

	const deleteImage = async id => {
		await deleteResource(adminImageEndpoint, { imageId: id });
		getLatestImages(styleId);
	};

	const handleUpload = e => {
		uploadImage(e.target.files[0]);
	};

	const uploadImage = async image => {
		setLoader(true);
		const formData = new FormData();
		formData.append("image", image, image.fileName);
		await createResource(adminImageEndpoint, formData);
		getLatestImages(styleId);
		setLoader(false);
	};

	const getLatestScores = () => {
		// const endPoint = `/quiz/admin/v1/image/scores/${selectedProductId}`;
		const endPoint = `/quiz/admin/v1/image/scores/1`;
		fetchResources(endPoint)
			.then(res => {
				filterScoresData(res.scores);
			})
			.catch(err => console.log(err))
			.finally(() => {});
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

	const getStyleName = id => {
		const style = styles.filter(item => item.id === id)[0];
		if (style) {
			return style.name;
		}
		return "";
	};

	const filterScoresData = scores => {
		const data = scores.map(item => {
			return {
				name: getStyleName(item.style_id),
				score: item.score,
				id: item.id,
				styleId: item.style_id,
			};
		});
		setScores(data);
	};
	console.log(defaultStyleName);
	return (
		<PageLayout pageName='Styles List'>
			<MaxHeightDiv>
				<LoudPaddingDiv>
					<Spin spinning={isLoading}>
						<Wrapper>
							<Card>
								<Row gutter={[4, 16]}>
									<Col sm={24} md={6}>
										<Select
											showSearch
											filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
											style={{ width: "100%" }}
											onChange={handleChange}
											defaultValue={defaultStyleName}
										>
											<Select.Option value='all'>All</Select.Option>
											{styles.map((style, index) => {
												return <Select.Option value={style?.id}>{style?.name}</Select.Option>;
											})}
										</Select>
									</Col>
									<Col sm={24} md={18} align='right'>
										<Button style={{ position: "relative" }} type='primary'>
											Add Image
											<StyledInput onChange={handleUpload} type='file' />
										</Button>
									</Col>
								</Row>
							</Card>
							<br></br>
							<Row gutter={[0, 16]}>
								{images.map(item => {
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
														Set Score
													</Button>,
												]}
												hoverable
												cover={
													<img
														height={164}
														height={164}
														src='https://static-staging.spacejoy.com/style-quiz/images/6a5a2cd6-be64-47cf-9f13-a9ec0b794858.jpg'
													/>
												}
											></Card>
										</Col>
									);
								})}
							</Row>
						</Wrapper>
					</Spin>
					<Modal
						title='Basic Modal'
						visible={isModalVisible}
						onOk={handleModalOk}
						onCancel={handleModalCancel}
						width={1000}
					>
						<Table loading={isLoading} rowKey='_id' scroll={{ x: 768 }} dataSource={scores}>
							<Table.Column
								key='_id'
								title='Style Name'
								render={scores => {
									return (
										<Row>
											<Col span={24}>{scores.name}</Col>
										</Row>
									);
								}}
							/>
							<Table.Column
								key='id'
								title='Score'
								dataIndex='id'
								render={(text, record) => <ScoreBox contentEditable={true}>{record.score}</ScoreBox>}
							/>
							<Table.Column
								key='id'
								title=''
								dataIndex='id'
								render={(text, record) => <Button onClick={() => handleEdit(record.id)}>Edit</Button>}
							/>
							<Table.Column key='id' title='' dataIndex='id' render={(text, record) => <Button>Delete</Button>} />
						</Table>
					</Modal>
				</LoudPaddingDiv>
			</MaxHeightDiv>
		</PageLayout>
	);
}

ImageList.getInitialProps = ({ query }) => {
	return { query };
};
