import { ArrowLeftOutlined } from "@ant-design/icons";
import { searchRetailerApi } from "@api/ecommerceApi";
import Image from "@components/Image";
import { Status } from "@customTypes/userType";
import { MaxHeightDiv } from "@sections/Dashboard/styled";
import PageLayout from "@sections/Layout";
import { ProtectRoute, redirectToLocation } from "@utils/authContext";
import { company } from "@utils/config";
import fetcher from "@utils/fetcher";
import IndexPageMeta from "@utils/meta";
import { Button, Card, Col, Form, Input, Pagination, Row, Select, Spin, Typography } from "antd";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { LoudPaddingDiv } from "pages/platformanager";
import React, { useEffect, useState } from "react";

const { Title } = Typography;

const Retailer: NextPage = () => {
	const [retailers, setRetailer] = useState([]);
	const [pageNo, setPageNo] = useState<number>(1);
	const [total, setTotal] = useState(0);
	const [pageSize, setPageSize] = useState<number>(24);
	const [loading, setLoading] = useState(false);
	const [searchValues, setSearchValues] = useState({
		name: "",
		status: Status.active,
	});

	const fetchAndPopulateRetailers = async () => {
		setLoading(true);
		const endPoint = `${searchRetailerApi()}?skip=${pageSize * (pageNo - 1)}&limit=${pageSize}`;
		const response = await fetcher({ endPoint, method: "POST", body: { filters: { ...searchValues } } });
		setRetailer(response.data.list);
		setTotal(response.data.count);
		setLoading(false);
	};

	useEffect(() => {
		fetchAndPopulateRetailers();
	}, [pageNo, pageSize]);

	const handleChange = (page, pageSize) => {
		setPageNo(page);
		setPageSize(pageSize);
	};

	const onFormChange = changedFields => {
		if (changedFields.length) {
			setSearchValues({ ...searchValues, [changedFields[0].name[0]]: changedFields[0].value });
		}
	};
	return (
		<PageLayout pageName='Retailer Management'>
			<Head>
				{IndexPageMeta}
				<title>Retailer | {company.product}</title>
			</Head>
			<Spin spinning={loading}>
				<MaxHeightDiv>
					<LoudPaddingDiv>
						<Row gutter={[4, 16]}>
							<Col span={24}>
								<Row justify='space-between' align='top'>
									<Col>
										<Title level={3}>
											<Row gutter={[8, 8]}>
												<Col>
													<ArrowLeftOutlined onClick={() => redirectToLocation({ pathname: "/ecommerce" })} />
												</Col>
												<Col>Retailer Management</Col>
											</Row>
										</Title>
									</Col>
									<Col>
										<Button
											type='primary'
											onClick={() =>
												redirectToLocation({
													pathname: "/ecommerce/retailers/modifyretailer",
													query: { mode: "new" },
													url: "/ecommerce/retailers/modifyretailer?mode=new",
												})
											}
										>
											Create new Retailer
										</Button>
									</Col>
								</Row>
							</Col>
							<Col span={24}>
								<Card size='small'>
									<Row>
										<Col span={24}>
											<Form
												initialValues={searchValues}
												labelCol={{ span: 24 }}
												onFieldsChange={onFormChange}
												onFinish={fetchAndPopulateRetailers}
											>
												<Row gutter={[8, 0]}>
													<Col sm={24} md={18}>
														<Form.Item label='Name' name='name'>
															<Input />
														</Form.Item>
													</Col>
													<Col sm={24} md={6}>
														<Form.Item label='Status' name='status'>
															<Select>
																<Select.Option value='active'>Active</Select.Option>
																<Select.Option value='inactive'>Inactive</Select.Option>
															</Select>
														</Form.Item>
													</Col>
													<Col span={24}>
														<Row justify='end'>
															<Button type='ghost' htmlType='submit'>
																Search
															</Button>
														</Row>
													</Col>
												</Row>
											</Form>
										</Col>
									</Row>
								</Card>
							</Col>
							<Col span={24}>
								<Row gutter={[8, 8]}>
									{retailers.map(retailer => {
										return (
											<Col sm={12} md={8} lg={6} key={retailer._id}>
												<Link href={`/ecommerce/retailers/modifyretailer?id=${retailer._id}&mode=edit`}>
													<Card
														hoverable
														cover={
															<Image height={164} src={`h_164,c_pad/${retailer.logoCdn || ""}`} alt={retailer.name} />
														}
													>
														<Card.Meta title={retailer.name} />
													</Card>
												</Link>
											</Col>
										);
									})}
								</Row>
							</Col>
							<Col span={24}>
								<Row justify='center'>
									<Pagination
										total={total}
										pageSize={pageSize}
										pageSizeOptions={["12", "24", "36", "48"]}
										current={pageNo}
										showSizeChanger
										onChange={handleChange}
									/>
								</Row>
							</Col>
						</Row>
					</LoudPaddingDiv>
				</MaxHeightDiv>
			</Spin>
		</PageLayout>
	);
};

export default ProtectRoute(Retailer);
