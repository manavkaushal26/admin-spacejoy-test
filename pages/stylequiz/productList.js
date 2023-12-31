import { ArrowLeftOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import * as StyleQuizAPI from "@api/styleQuizApis";
import Image from "@components/Image";
import { MaxHeightDiv } from "@sections/Dashboard/styled";
import PageLayout from "@sections/Layout";
import fetcher from "@utils/fetcher";
import { modifyFormDataResource, multiFileUploader, styleFetcher, updateResource } from "@utils/styleQuizHelper";
import { Button, Card, Col, Input, Modal, Popconfirm, Row, Select, Spin, Switch, Typography } from "antd";
import { useRouter } from "next/router";
import { LoudPaddingDiv } from "pages/platformanager";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
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

export default function ProductsList({ query }) {
	const { styleId } = query;
	const [products, setProducts] = useState([]);
	const [styles, setStylesData] = useState([]);
	const [isLoading, setLoader] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState({});
	const [isModalVisible, setIsModalVisible] = useState(false);
	const inputAreaRef = useRef(null);
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
		styleFetcher(StyleQuizAPI.getActiveStylesAPI(), "GET")
			.then(res => {
				setStylesData(res.data);
				const id = Router?.query?.styleId ? Router?.query?.styleId : res.data[0]?.id;
				Router.replace({ pathname: "/stylequiz/productList", query: { styleId: id } }, `/stylequiz/productList/${id}`);
			})
			.catch(() => {
				throw new Error();
			});
	}, []);

	useEffect(() => {
		setProducts([]);
		if (Router?.query?.styleId) {
			getLatestProducts(Router?.query?.styleId);
		}
	}, [Router]);

	const handleChange = value => {
		Router.replace(
			{ pathname: "/stylequiz/productList", query: { styleId: value } },
			`/stylequiz/productList/${value}`
		);
	};

	const getLatestProducts = id => {
		if (id && id !== "undefined") {
			fetchResources(`${StyleQuizAPI.getProductsAPI(id)}`)
				.then(res => {
					setProducts(res.products);
				})
				.catch(err => {
					throw new Error();
				});
		}
	};

	const deleteProduct = async id => {
		await updateResource(`${StyleQuizAPI.postProductsAPI()}`, "DELETE", { productId: id });
		setProducts([]);
		getLatestProducts(styleId);
	};

	const handleUpload = e => {
		uploadProduct(e.target.files);
	};

	const uploadProduct = async images => {
		setLoader(true);
		const endPoint = `${StyleQuizAPI.getProductsAPI(styleId)}`;
		const formData = multiFileUploader(images);
		await modifyFormDataResource(endPoint, "POST", formData);
		getLatestProducts(styleId);
		setLoader(false);
	};

	const handleToggle = async (checked, id) => {
		const newState = products.map(item => {
			if (item.id === id) {
				return { ...item, active: checked };
			}
			return { ...item };
		});
		setProducts(newState);
		await updateResource(StyleQuizAPI.postProductsAPI(), "PUT", {
			productId: id,
			active: checked ? "yes" : "no",
		});
	};

	const showModal = item => {
		setIsModalVisible(true);
		setSelectedProduct(item);
	};

	const onOk = () => {
		updateProductDetails();
		setIsModalVisible(false);
	};

	useEffect(() => {
		if (inputAreaRef?.current?.state) {
			inputAreaRef.current.state.value = "";
		}
	}, [isModalVisible]);

	const updateProductDetails = async () => {
		const mongoId = inputAreaRef?.current?.state?.value ? inputAreaRef.current.state.value : "";
		await updateResource(StyleQuizAPI.postProductsAPI(), "PUT", {
			productId: selectedProduct?.id,
			mongoId,
		});
	};

	const handleAssetIdChange = e => {
		const newState = products.map(item => {
			if (item.id === selectedProduct?.id) {
				return { ...item, mongoId: e.target.value };
			}
			return { ...item };
		});
		setProducts(newState);
	};

	const defaultStyleValue = Router?.query?.styleId
		? styles.filter(style => style?.id === parseInt(Router?.query?.styleId))[0]?.id
		: styles[0]?.id;
	const currValue = products?.filter(item => item?.id === selectedProduct?.id)[0]?.mongoId || "";
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
												{styles.map(style => {
													return (
														<Select.Option key={style?.id} value={style?.id}>
															{style?.name}
														</Select.Option>
													);
												})}
											</Select>
										) : null}
									</Col>
									<Col sm={24} md={18} align='right'>
										<Button style={{ position: "relative" }} type='primary'>
											Add Product
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
								{products.length ? (
									[...products]
										.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
										.map(item => {
											return (
												<Col sm={12} md={8} lg={6} key={item?.id}>
													{/* q_70,w_300,h_180 */}
													<Card
														actions={[
															<Switch
																key={item?.id}
																checked={item?.active}
																onChange={checked => handleToggle(checked, item?.id)}
															/>,
															<EditOutlined onClick={() => showModal(item)} key={item?.id} />,
															<Popconfirm
																placement='top'
																onConfirm={() => deleteProduct(item?.id)}
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
												<p>No Products to show.</p>
											</Col>
										</Row>
									</Card>
								)}
							</Row>
						</Wrapper>
					</Spin>
				</LoudPaddingDiv>
				<Modal
					title='Edit Description'
					visible={isModalVisible}
					onOk={onOk}
					onCancel={() => setIsModalVisible(false)}
					okText='Save'
				>
					<Input placeholder='Asset ID' value={currValue} ref={inputAreaRef} onChange={handleAssetIdChange} required />
					<br></br>
					<br></br>
				</Modal>
			</MaxHeightDiv>
		</PageLayout>
	);
}

ProductsList.getInitialProps = ({ query }) => {
	return { query };
};
