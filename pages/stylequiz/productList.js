import { DeleteOutlined } from "@ant-design/icons";
import Image from "@components/Image";
import { MaxHeightDiv } from "@sections/Dashboard/styled";
import PageLayout from "@sections/Layout";
import fetcher from "@utils/fetcher";
import { Button, Card, Col, Input, Popconfirm, Row, Select, Spin } from "antd";
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
		styleFetcher("/quiz/admin/v1/styles/active", "GET")
			.then(res => {
				setStylesData(res.data);
				getLatestProducts(styleId);
			})
			.catch(err => console.log(err))
			.finally(() => {});
	}, [Router]);

	const handleChange = value => {
		Router.push({ pathname: "/stylequiz/productList", query: { styleId: value } }, `/stylequiz/productList/${value}`);
	};

	const getLatestProducts = id => {
		fetchResources(`/quiz/admin/v1/products/${id}`)
			.then(res => {
				setProducts(res.products);
			})
			.catch(err => console.log(err))
			.finally(() => {});
	};

	const deleteProduct = async id => {
		await deleteResource("/quiz/admin/v1/product", { productId: id });
		getLatestProducts(styleId);
	};

	const handleUpload = e => {
		uploadProduct(e.target.files[0]);
	};

	const uploadProduct = async image => {
		setLoader(true);
		const endPoint = `/quiz/admin/v1/product/${styleId}`;
		const formData = new FormData();
		formData.append("image", image, image.fileName);
		await createResource(endPoint, formData);
		getLatestProducts(styleId);
		setLoader(false);
	};
	// console.log(scores, styles);
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
										>
											{styles.map((style, index) => {
												return <Select.Option value={style?.id}>{style?.name}</Select.Option>;
											})}
										</Select>
									</Col>
									<Col sm={24} md={18} align='right'>
										<Button style={{ position: "relative" }} type='primary'>
											Add Product
											<StyledInput onChange={handleUpload} type='file' />
										</Button>
									</Col>
								</Row>
							</Card>
							<br></br>
							<Row gutter={[0, 16]}>
								{products.length ? (
									products.map(item => {
										return (
											<Col sm={12} md={8} lg={6}>
												<Card
													actions={[
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
													cover={
														<Image
															height={164}
															height={164}
															src='/_next/static/images/fallback-background-8bbb1ffdd871f26e713e31927f48a6ff.svg'
														/>
													}
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
