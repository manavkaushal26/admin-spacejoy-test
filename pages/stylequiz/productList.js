import { ArrowLeftOutlined, DeleteOutlined } from "@ant-design/icons";
import Image from "@components/Image";
import { MaxHeightDiv } from "@sections/Dashboard/styled";
import PageLayout from "@sections/Layout";
import fetcher from "@utils/fetcher";
import { Button, Card, Col, Input, Popconfirm, Row, Select, Spin, Switch, Typography } from "antd";
import { useRouter } from "next/router";
import { LoudPaddingDiv } from "pages/platformanager";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { modifyFormDataResource, multiFileUploader, styleFetcher, updateResource } from "./helper";
import * as StyleQuizAPI from "./styleQuizApis";
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
				Router.replace(
					{ pathname: "/stylequiz/productList", query: { styleId: res.data[0]?.id } },
					`/stylequiz/productList/${res.data[0]?.id}`
				);
			})
			.catch(err => console.log(err));
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
		if (id) {
			fetchResources(`${StyleQuizAPI.getProductsAPI()}/${id}`)
				.then(res => {
					setProducts(res.products);
				})
				.catch(err => console.log(err))
				.finally(() => {});
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

	const updateStatus = async (checked, id, mongoId) => {
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
			mongoId,
		});
	};

	const uploadProduct = async images => {
		setLoader(true);
		const endPoint = `${StyleQuizAPI.postProductsAPI()}/${styleId}`;
		const formData = multiFileUploader(images);
		await modifyFormDataResource(endPoint, "POST", formData);
		getLatestProducts(styleId);
		setLoader(false);
	};
	console.log(products);
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
											Add Product
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
								{products.length ? (
									products.map(item => {
										return (
											<Col sm={12} md={8} lg={6}>
												<Card
													actions={[
														<Switch
															checked={item?.active}
															checkedChildren='Active'
															unCheckedChildren='Inactive'
															onChange={checked => updateStatus(checked, item?.id, item?.mongoId)}
														/>,
														<Popconfirm
															placement='top'
															onConfirm={() => deleteProduct(item?.id)}
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
												<p>No Products to show.</p>
											</Col>
										</Row>
									</Card>
								)}
							</Row>
						</Wrapper>
					</Spin>
				</LoudPaddingDiv>
			</MaxHeightDiv>
		</PageLayout>
	);
}

ProductsList.getInitialProps = ({ query }) => {
	return { query };
};
