import { ArrowLeftOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import * as StyleQuizAPI from "@api/styleQuizApis";
import Image from "@components/Image";
import { MaxHeightDiv } from "@sections/Dashboard/styled";
import PageLayout from "@sections/Layout";
import { modifyFormDataResource, multiFileUploader, styleFetcher, updateResource } from "@utils/styleQuizHelper";
import { Button, Card, Col, Input, Popconfirm, Row, Spin, Switch, Typography } from "antd";
import { useRouter } from "next/router";
import { LoudPaddingDiv } from "pages/platformanager";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import EditModal from "./editModal";
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
const DescriptionText = styled.p`
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
	text-overflow: ellipsis;
	min-height: 45px;
`;

const endPoint = StyleQuizAPI.paletteAPI();
export default function TextureList() {
	const [palettes, setPalettes] = useState([]);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [selectedResource, setSelectedResource] = useState({});
	const [isLoading, setLoader] = useState(false);
	const Router = useRouter();

	useEffect(() => {
		setPalettes([]);
		getPalettes();
	}, []);

	const getPalettes = id => {
		styleFetcher(endPoint)
			.then(res => {
				setPalettes(res.data);
			})
			.catch(err => {
				throw new Error();
			});
	};

	const deletePalette = async id => {
		await updateResource(endPoint, "DELETE", { id: id });
		setPalettes([]);
		getPalettes();
	};

	const handleUpload = e => {
		uploadPalette(e.target.files);
	};

	const uploadPalette = async images => {
		setLoader(true);
		const formData = multiFileUploader(images);
		await modifyFormDataResource(endPoint, "POST", formData);
		getPalettes();
		setLoader(false);
	};

	const showModal = item => {
		setSelectedResource(item);
		setIsModalVisible(true);
	};

	const handleToggle = async (checked, id) => {
		updateStates("isActive", checked, id);
		await updateResource(endPoint, "PUT", {
			id: id,
			active: checked ? "yes" : "no",
		});
	};

	const handlModaleOk = async desc => {
		setIsModalVisible(false);
		await updateResource(endPoint, "PUT", {
			id: selectedResource?.id,
			description: desc,
		});
		getPalettes();
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	const handleDescChange = desc => {
		updateStates("description", desc, selectedResource?.id);
	};

	const updateStates = (key, value, id) => {
		const newState = palettes.map(item => {
			if (item.id === id) {
				return { ...item, [key]: value };
			}
			return { ...item };
		});
		setPalettes(newState);
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
										<Button style={{ position: "relative" }} type='primary' align='right'>
											Add Palette
											<StyledInput
												accept='image/jpeg,image/jpg,image/JPEG,image/JPG, image/png, image/PNG, .svg'
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
								{palettes.length ? (
									[...palettes]
										.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
										.map(item => {
											return (
												<Col sm={12} md={8} lg={6} key={item?.id}>
													{/* q_50,w_300,h_180 */}
													<Card
														key={item?.id}
														actions={[
															<Switch
																checked={item?.isActive}
																onChange={checked => handleToggle(checked, item?.id)}
																key={item?.id}
															/>,
															<EditOutlined onClick={() => showModal(item)} key={item?.id} />,
															<Popconfirm
																placement='top'
																onConfirm={() => deletePalette(item?.id)}
																title='Are you sure you want to delete?'
																okText='Yes'
																disabled={false}
																cancelText='Cancel'
																key={item?.id}
															>
																<DeleteOutlined key={item?.id} />
															</Popconfirm>,
														]}
														hoverable
														cover={<Image src={`/${item?.cdn}.jpg`} staticUrl />}
													></Card>
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
					handlModaleOk={desc => handlModaleOk(desc)}
					selectedResource={selectedResource}
					handleCancel={handleCancel}
					data={palettes}
					handleDescChange={desc => handleDescChange(desc)}
				/>
			</MaxHeightDiv>
		</PageLayout>
	);
}
