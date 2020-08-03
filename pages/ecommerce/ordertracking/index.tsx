import { searchOrdersApi } from "@api/ecommerceApi";
import { EcommerceOrderStatus, EcommOrder } from "@customTypes/ecommerceTypes";
import User from "@customTypes/userType";
import { MaxHeightDiv } from "@sections/Dashboard/styled";
import AllOrderTable from "@sections/Ecommerce/OrdertTracking/AllOrderTable";
import PageLayout from "@sections/Layout";
import { withAuthVerification } from "@utils/auth";
import { company } from "@utils/config";
import fetcher from "@utils/fetcher";
import IndexPageMeta from "@utils/meta";
import { Button, Card, Col, Form, Input, Row, Select, Typography } from "antd";
import { NextPage } from "next";
import Head from "next/head";
import { LoudPaddingDiv } from "pages/platformanager";
import React, { useEffect, useState } from "react";

const { Title } = Typography;

interface OrderTracking {
	authVerification: Partial<User>;
	isServer: boolean;
}

const OrderTracking: NextPage<OrderTracking> = ({ authVerification, isServer }) => {
	const [orders, setOrders] = useState<EcommOrder[]>([]);
	const [loading, setLoading] = useState(false);
	const [searchValues, setSearchValues] = useState({
		email: "",
		status: "",
	});
	const [total, setTotal] = useState(Number.NEGATIVE_INFINITY);
	const [pageSize, setPageSize] = useState(24);
	const [pageNo, setPageNo] = useState(1);

	const fetchAndPopulateOrders = async () => {
		setLoading(true);
		const endPoint = `${searchOrdersApi()}?skip=${(pageNo - 1) * pageSize}&limit=${pageSize}`;
		const response = await fetcher({
			endPoint,
			method: "POST",
			body: {
				filters: { ...searchValues },
			},
		});
		setOrders(response.data.orders);
		setTotal(response.data.count);
		setLoading(false);
	};

	useEffect(() => {
		fetchAndPopulateOrders();
	}, [pageSize, pageNo]);

	const onFormChange = changedFields => {
		if (changedFields.length) {
			setSearchValues({ ...searchValues, [changedFields[0].name[0]]: changedFields[0].value });
		}
	};

	return (
		<PageLayout isServer={isServer} authVerification={authVerification} pageName='Orders'>
			<Head>
				{IndexPageMeta}
				<title>Orders | {company.product}</title>
			</Head>
			<MaxHeightDiv>
				<LoudPaddingDiv>
					<Row gutter={[0, 16]}>
						<Col span={24}>
							<Title>Order Tracking</Title>
						</Col>
						<Col span={24}>
							<Card size='small'>
								<Row>
									<Col span={24}>
										<Form
											initialValues={searchValues}
											labelCol={{ span: 24 }}
											onFieldsChange={onFormChange}
											onFinish={fetchAndPopulateOrders}
										>
											<Row gutter={[8, 0]}>
												<Col sm={24} md={12}>
													<Form.Item label='Email' name='email' normalize={(value: string) => value.trim()}>
														<Input placeholder='Email' />
													</Form.Item>
												</Col>
												<Col sm={24} md={6}>
													<Form.Item label='Order Id' name='orderId' normalize={(value: string) => value.trim()}>
														<Input placeholder='Order Id' />
													</Form.Item>
												</Col>
												<Col sm={24} md={6}>
													<Form.Item label='Status' name='status'>
														<Select>
															{Object.entries(EcommerceOrderStatus).map(([key, value]) => {
																return (
																	<Select.Option value={value} key={key}>
																		{key}
																	</Select.Option>
																);
															})}
															<Select.Option value=''>All</Select.Option>
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
							<AllOrderTable
								loading={loading}
								orderData={orders}
								total={total}
								pageSize={pageSize}
								setPageSize={setPageSize}
								pageNo={pageNo}
								setPageNo={setPageNo}
							/>
						</Col>
					</Row>
				</LoudPaddingDiv>
			</MaxHeightDiv>
		</PageLayout>
	);
};

OrderTracking.getInitialProps = async ({ req }) => {
	return {
		isServer: !!req,
		authVerification: { name: "", email: "" },
	};
};

export default withAuthVerification(OrderTracking);
