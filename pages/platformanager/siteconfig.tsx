import { ArrowLeftOutlined } from "@ant-design/icons";
import BroadcastingStrip from "@components/BroadcastingStrip";
import { FirestoreDocument, FirestoreMutation } from "@react-firebase/firestore";
import { MaxHeightDiv } from "@sections/Dashboard/styled";
import PageLayout from "@sections/Layout";
import { ProtectRoute } from "@utils/authContext";
import { company } from "@utils/config";
import IndexPageMeta from "@utils/meta";
import { Button, Col, DatePicker, Divider, Form, Input, message, Row, Spin, Switch, Typography } from "antd";
import moment from "moment";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { LoudPaddingDiv } from ".";
const { Title } = Typography;

const stripDomainInLink = str => {
	return str.replace("https://res.cloudinary.com/spacejoy/image/upload/", "").replace("https://www.spacejoy.com");
};

const initialValues = {
	homepage: {
		hp1: "",
		hp1Link: "",
		hp1Alt: "",
		hp2: "",
		hp2Link: "",
		hp2Alt: "",
		hp3: "",
		hp3Link: "",
		hp3Alt: "",

		visible: false,
	},
	injectBanner: {
		cdn: "",
		visible: false,
		alt: "",
	},
	cartBanner: {
		cdn: "",
		visible: false,
		alt: "",
	},
	countdown: {
		time: "",
		visible: false,
		endMessage: "",
	},
	broadcast: {
		beforePulseDot: "",
		afterPulseDot: "",
		highlightText: "",
		isHighlightCoupon: false,
		broadcaststripVisible: false,
		afterCoupon: "",
		pulseDot: false,
	},
};

const SitemapManager: NextPage = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const router = useRouter();
	const [form] = Form.useForm();

	return (
		<PageLayout pageName='Site Config'>
			<Head>
				<title>Site Config | {company.product}</title>
				{IndexPageMeta}
			</Head>
			<MaxHeightDiv>
				<LoudPaddingDiv>
					<Row gutter={[24, 8]}>
						<Col>
							<Title level={3}>
								<Row gutter={[8, 8]}>
									<Col>
										<ArrowLeftOutlined onClick={() => router.back()} />
									</Col>
									<Col>Site Config</Col>
								</Row>
							</Title>
						</Col>
						<Col span={24}>
							<Divider style={{ marginTop: "0rem" }} />
						</Col>
						<Col span={24}>
							<FirestoreDocument path='/siteConfig/IRw24GvvWBkVMqNoE1fZ'>
								{d => {
									const time = d.value?.countdown?.time ? moment(d.value?.countdown?.time) : null;
									form.setFieldsValue({ ...d.value, countdown: { ...d.value?.countdown, time: time } });
									return (
										<Spin spinning={loading || d.isLoading}>
											<FirestoreMutation type='update' path='/siteConfig/IRw24GvvWBkVMqNoE1fZ'>
												{({ runMutation }) => {
													return (
														<Form
															form={form}
															initialValues={initialValues}
															labelCol={{ span: 24 }}
															onFinish={data => {
																setLoading(false);

																runMutation({
																	...data,
																	countdown: { ...data.countdown, time: data.countdown.time.valueOf() },
																})
																	.then(resp => {
																		message.success("Saved config successfully");
																		setLoading(false);
																	})
																	.catch(e => {
																		message.error("Failed to save. Please try again");
																	});
															}}
														>
															<Row>
																<Col>
																	<Row gutter={[16, 8]}>
																		<Col span={24}>
																			<Title level={4} underline>
																				Home Page Banners
																			</Title>
																		</Col>
																		<Col sm={24} md={12}>
																			<Form.Item
																				name={["homepage", "hp1"]}
																				label='Home page Portrait'
																				normalize={stripDomainInLink}
																				rules={[{ required: true }]}
																			>
																				<Input />
																			</Form.Item>
																		</Col>
																		<Col sm={24} md={12}>
																			<Form.Item
																				name={["homepage", "hp1Alt"]}
																				label='Alt Tag for Image'
																				normalize={stripDomainInLink}
																			>
																				<Input />
																			</Form.Item>
																		</Col>
																		<Col sm={24} md={12}>
																			<Form.Item
																				name={["homepage", "hp1Link"]}
																				label='Home page Portrait link to'
																				normalize={stripDomainInLink}
																			>
																				<Input />
																			</Form.Item>
																		</Col>

																		<Col sm={0} md={12} />

																		<Col sm={24} md={12}>
																			<Form.Item
																				name={["homepage", "hp2"]}
																				label='Home page Landscape 1'
																				normalize={stripDomainInLink}
																				rules={[{ required: true }]}
																			>
																				<Input />
																			</Form.Item>
																		</Col>
																		<Col sm={24} md={12}>
																			<Form.Item
																				name={["homepage", "hp2Alt"]}
																				label='Alt Tag for Image'
																				normalize={stripDomainInLink}
																			>
																				<Input />
																			</Form.Item>
																		</Col>

																		<Col sm={24} md={12}>
																			<Form.Item
																				name={["homepage", "hp2Link"]}
																				label='Home page Landscape 1 link to'
																				normalize={stripDomainInLink}
																			>
																				<Input />
																			</Form.Item>
																		</Col>
																		<Col sm={0} md={12} />

																		<Col sm={24} md={12}>
																			<Form.Item
																				name={["homepage", "hp3"]}
																				label='Home page Landscape 2'
																				normalize={stripDomainInLink}
																				rules={[{ required: true }]}
																			>
																				<Input />
																			</Form.Item>
																		</Col>
																		<Col sm={24} md={12}>
																			<Form.Item
																				name={["homepage", "hp3Alt"]}
																				label='Alt Tag for Image'
																				normalize={stripDomainInLink}
																			>
																				<Input />
																			</Form.Item>
																		</Col>
																		<Col sm={24} md={12}>
																			<Form.Item
																				name={["homepage", "hp3Link"]}
																				label='Home page Landscape 2 link to'
																				normalize={stripDomainInLink}
																			>
																				<Input />
																			</Form.Item>
																		</Col>
																	</Row>
																</Col>
																<Col span={24}>
																	<Row gutter={[16, 8]}>
																		<Col span={24}>
																			<Title level={4} underline>
																				Inject Banner
																			</Title>
																		</Col>
																		<Col sm={24} md={12}>
																			<Form.Item
																				name={["injectBanner", "cdn"]}
																				label='Inject banner'
																				normalize={stripDomainInLink}
																				rules={[{ required: true }]}
																			>
																				<Input />
																			</Form.Item>
																		</Col>
																		<Col sm={24} md={12}>
																			<Form.Item
																				name={["injectBanner", "link"]}
																				label='Inject banner Link'
																				normalize={stripDomainInLink}
																			>
																				<Input />
																			</Form.Item>
																		</Col>
																		<Col sm={24} md={12}>
																			<Form.Item
																				name={["injectBanner", "alt"]}
																				label='Alt Tag for Image'
																				normalize={stripDomainInLink}
																			>
																				<Input />
																			</Form.Item>
																		</Col>
																		<Col sm={24} md={12}>
																			<Form.Item
																				name={["injectBanner", "visible"]}
																				label='Inject banner Visible?'
																				valuePropName='checked'
																			>
																				<Switch checkedChildren={"Yes"} unCheckedChildren={"No"} />
																			</Form.Item>
																		</Col>
																	</Row>
																</Col>
																<Col span={24}>
																	<Row gutter={[16, 8]}>
																		<Col span={24}>
																			<Title level={4} underline>
																				Cart Banner
																			</Title>
																		</Col>
																		<Col sm={24} md={12}>
																			<Form.Item
																				name={["cartBanner", "cdn"]}
																				label='Cart banner'
																				rules={[{ required: true }]}
																				normalize={stripDomainInLink}
																			>
																				<Input />
																			</Form.Item>
																		</Col>
																		<Col sm={24} md={12}>
																			<Form.Item
																				name={["cartBanner", "link"]}
																				label='Cart banner Link to'
																				normalize={stripDomainInLink}
																			>
																				<Input />
																			</Form.Item>
																		</Col>
																		<Col sm={24} md={12}>
																			<Form.Item
																				name={["cartBanner", "alt"]}
																				label='Alt Tag for Image'
																				normalize={stripDomainInLink}
																			>
																				<Input />
																			</Form.Item>
																		</Col>
																		<Col sm={24} md={12}>
																			<Form.Item
																				name={["cartBanner", "visible"]}
																				label='Cart Banner visible?'
																				valuePropName='checked'
																			>
																				<Switch checkedChildren={"Yes"} unCheckedChildren={"No"} />
																			</Form.Item>
																		</Col>
																	</Row>
																</Col>
																<Col span={24}>
																	<Row gutter={[16, 8]}>
																		<Col span={24}>
																			<Title level={4} underline>
																				Countdown Timer
																			</Title>
																		</Col>
																		<Col sm={24} md={12}>
																			<Form.Item
																				name={["countdown", "time"]}
																				label='Countdown timer end time'
																				rules={[{ required: true }]}
																			>
																				<DatePicker
																					showTime
																					// disabledDate={date => {
																					// 	return date < moment();
																					// }}
																				/>
																			</Form.Item>
																		</Col>
																		<Col sm={24} md={12}>
																			<Form.Item
																				name={["countdown", "visible"]}
																				label='Count Down Timer Visible?'
																				valuePropName='checked'
																			>
																				<Switch checkedChildren={"Yes"} unCheckedChildren={"No"} />
																			</Form.Item>
																		</Col>
																		<Col span={24}>
																			<Form.Item name={["countdown", "endMessage"]} label='Countdown expiry message'>
																				<Input />
																			</Form.Item>
																		</Col>
																	</Row>
																</Col>

																<Col span={24}>
																	<Row gutter={[16, 8]}>
																		<Col span={24}>
																			<Title level={4} underline>
																				Broadcast strip
																			</Title>
																		</Col>
																		<Col span={24}>
																			<Form.Item shouldUpdate>
																				{({ getFieldsValue }) => {
																					return (
																						<BroadcastingStrip broadcastingStripData={getFieldsValue(true).broadcast} />
																					);
																				}}
																			</Form.Item>
																		</Col>
																		<Col sm={24} md={12}>
																			<Form.Item
																				name={["broadcast", "beforePulseDot"]}
																				label='Before Pulse dot'
																				rules={[{ required: true }]}
																			>
																				<Input />
																			</Form.Item>
																		</Col>
																		<Col sm={24} md={12}>
																			<Form.Item name={["broadcast", "afterPulseDot"]} label='After Pulse Dot'>
																				<Input />
																			</Form.Item>
																		</Col>
																		<Col sm={24} md={12}>
																			<Form.Item name={["broadcast", "highlightText"]} label='Highlighted Text'>
																				<Input />
																			</Form.Item>
																		</Col>
																		<Col sm={24} md={12}>
																			<Form.Item name={["broadcast", "afterCoupon"]} label='After Highlighted text'>
																				<Input />
																			</Form.Item>
																		</Col>
																		<Col sm={24} md={8}>
																			<Form.Item
																				name={["broadcast", "isHighlightCoupon"]}
																				label='Is Highlighted text a Coupon?'
																				valuePropName='checked'
																			>
																				<Switch checkedChildren={"Yes"} unCheckedChildren={"No"} />
																			</Form.Item>
																		</Col>

																		<Col sm={24} md={8}>
																			<Form.Item
																				name={["broadcast", "broadcaststripVisible"]}
																				label='Strip Visible to customer?'
																				valuePropName='checked'
																			>
																				<Switch checkedChildren={"Yes"} unCheckedChildren={"No"} />
																			</Form.Item>
																		</Col>
																		<Col sm={24} md={8}>
																			<Form.Item
																				name={["broadcast", "pulseDot"]}
																				label='Pulse dot visible?'
																				valuePropName='checked'
																			>
																				<Switch checkedChildren={"Yes"} unCheckedChildren={"No"} />
																			</Form.Item>
																		</Col>
																	</Row>
																</Col>

																<Col span={24}>
																	<Row justify='end'>
																		<Form.Item>
																			<Button htmlType='submit' type='primary'>
																				Submit
																			</Button>
																		</Form.Item>
																	</Row>
																</Col>
															</Row>
														</Form>
													);
												}}
											</FirestoreMutation>
										</Spin>
									);
								}}
							</FirestoreDocument>
						</Col>
					</Row>
				</LoudPaddingDiv>
			</MaxHeightDiv>
		</PageLayout>
	);
};

export default ProtectRoute(SitemapManager);
