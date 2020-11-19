import { DeleteOutlined } from "@ant-design/icons";
import Image from "@components/Image";
import { MaxHeightDiv } from "@sections/Dashboard/styled";
import PageLayout from "@sections/Layout";
import fetcher from "@utils/fetcher";
import { Button, Card, Col, Input, Popconfirm, Row, Select, Spin } from "antd";
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

const adminImageEndpoint = "/quiz/admin/v1/image";

export default function ProductsList() {
	const [images, setImages] = useState([]);
	const [styles, setStylesData] = useState([]);
	const [isLoading, setLoader] = useState(false);
	const [styleId, setStyleId] = useState("");
	const fetchImages = async id => {
		try {
			const resData = await fetcher({ endPoint: `/quiz/admin/v1/images/${id}`, method: "GET" });
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
		fetchImages(id)
			.then(res => {
				setImages(res.images);
			})
			.catch(err => console.log(err))
			.finally(() => {});
	};

	const handleChange = value => {
		setStyleId(value);
		getLatestImages(value);
	};

	useEffect(() => {
		styleFetcher("/quiz/admin/v1/styles", "GET")
			.then(res => {
				setStylesData(res.data);
			})
			.catch(err => console.log(err))
			.finally(() => {});
		getLatestImages(styleId);
	}, []);

	const deleteImage = async id => {
		deleteResource(adminImageEndpoint, { imageId: id });
	};

	const handleUpload = e => {
		uploadImage(e.target.files[0]);
	};

	const uploadImage = async image => {
		setLoader(true);
		const formData = new FormData();
		formData.append("image", image, image.fileName);
		createResource(adminImageEndpoint, formData);
		getLatestImages(styleId);
		setLoader(false);
	};

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
													<Button type='link'>Score</Button>,
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
												cover={<Image height={164} height={164} src={item?.url} />}
											></Card>
										</Col>
									);
								})}
							</Row>
						</Wrapper>
					</Spin>
				</LoudPaddingDiv>
			</MaxHeightDiv>
		</PageLayout>
	);
}
