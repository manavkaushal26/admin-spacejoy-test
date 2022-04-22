import { ArrowLeftOutlined } from "@ant-design/icons";
import { saveSiteConfigApi } from "@api/metaApi";
import BroadcastingStrip from "@components/BroadcastingStrip";
import { FirestoreDocument } from "@react-firebase/firestore";
import { ModifiedDivider } from "@sections/AssetStore/styled";
import { MaxHeightDiv } from "@sections/Dashboard/styled";
import PageLayout from "@sections/Layout";
import { ProtectRoute } from "@utils/authContext";
import { company, firebaseConfig } from "@utils/config";
import fetcher from "@utils/fetcher";
import IndexPageMeta from "@utils/meta";
import {
	Button,
	Col,
	DatePicker,
	Divider,
	Form,
	Input,
	message,
	Modal,
	Row,
	Spin,
	Switch,
	Tabs,
	Typography,
} from "antd";
import moment from "moment";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { LoudPaddingDiv } from ".";
const { Title, Text } = Typography;
const TabPane = Tabs.TabPane;

const stripDomainInLink = (str: string) => {
	const trimmedString = str
		.replace("https://res.cloudinary.com/spacejoy/image/upload/", "")
		.replace("https://www.spacejoy.com", "")
		.replace("http://www.spacejoy.com", "")
		.replace("www.spacejoy.com", "")
		.replace("spacejoy.com", "");

	if (!trimmedString.startsWith("/") && trimmedString.length > 0) {
		return `/${trimmedString}`;
	}
	return trimmedString;
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
		timerVisible: false,
		visible: false,
	},
	injectBanner: {
		cdn: "",
		visible: false,
		alt: "",
		timerVisible: false,
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
		color: "#000000",
	},
	broadcast: {
		beforePulseDot: "",
		afterPulseDot: "",
		highlightText: "",
		isHighlightCoupon: false,
		broadcaststripVisible: false,
		afterCoupon: "",
		pulseDot: false,
		timerVisible: false,
		link: "",
	},
	homepageV2: {
		hp1: "",
		hp1Link: "",
		hp1Alt: "",
		hp2: "",
		hp2Link: "",
		hp2Alt: "",
		hp3: "",
		hp3Link: "",
		hp3Alt: "",
		timerVisible: false,
		visible: false,
	},
	injectBannerV2: {
		cdn: "",
		visible: false,
		alt: "",
		timerVisible: false,
	},
	designListingV2: {
		cdn: "",
		visible: false,
		alt: "",
		timerVisible: false,
	},
	designViewV2: {
		cdn: "",
		visible: false,
		alt: "",
		timerVisible: false,
	},
	cartBannerV2: {
		cdn: "",
		visible: false,
		alt: "",
	},
	countdownV2: {
		time: "",
		visible: false,
		endMessage: "",
		color: "#000000",
	},
	broadcastV2: {
		beforePulseDot: "",
		afterPulseDot: "",
		highlightText: "",
		isHighlightCoupon: false,
		broadcaststripVisible: false,
		afterCoupon: "",
		pulseDot: false,
		timerVisible: false,
		link: "",
	},
};

const SyncDocumenDatatWithFormData = (firebaseData, data) => {
	return { ...firebaseData, ...data };
};

const SitemapManager: NextPage = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const router = useRouter();
	const [form] = Form.useForm();

	const saveForm = async data => {
		const endPoint = saveSiteConfigApi();

		const response = await fetcher({
			endPoint,
			method: "POST",
			body: {
				...data,
			},
		});
		if (response.statusCode === 200) {
			return true;
		} else {
			throw new Error();
		}
	};

	const onFinish = (data, firebaseData) => {
		const firebaseDataUpdated = SyncDocumenDatatWithFormData(firebaseData, data);
		setLoading(false);
		Modal.confirm({
			title: "Are you sure?",
			content: "Changes made will be immediately visible to customer",
			onOk: () => {
				saveForm({
					...firebaseDataUpdated,
					countdownV2: { ...firebaseDataUpdated.countdownV2, time: firebaseDataUpdated.countdownV2.time.valueOf() },
				})
					.then(() => {
						message.success("Saved config successfully");
						setLoading(false);
					})
					.catch(() => {
						message.error("Failed to save. Please try again");
					});
			},
		});
	};

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
									<Col>New Site Config</Col>
								</Row>
							</Title>
						</Col>
						<Col span={24}>
							<Divider style={{ marginTop: "0rem" }} />
						</Col>
						<Col span={24}>
							<FirestoreDocument path={`/${firebaseConfig.databaseId}/${firebaseConfig.documentId}`}>
								{d => {
									const timeV2 = d.value?.countdownV2?.time ? moment(d.value?.countdownV2?.time) : null;
									form.setFieldsValue({
										...d.value,
										countdownV2: { ...d.value?.countdownV2, time: timeV2 },
									});
									return (
										<Spin spinning={loading || d.isLoading}>
											<Form
												form={form}
												initialValues={initialValues}
												labelCol={{ span: 24 }}
												onFinish={data => onFinish(data, d.value)}
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
																	name={["homepageV2", "hp1"]}
																	label='Home page Portrait'
																	normalize={stripDomainInLink}
																	rules={[{ required: true }]}
																>
																	<Input />
																</Form.Item>
															</Col>
															<Col sm={24} md={12}>
																<Form.Item name={["homepageV2", "hp1Alt"]} label='Alt tag'>
																	<Input />
																</Form.Item>
															</Col>
															<Col sm={24} md={12}>
																<Form.Item
																	name={["homepageV2", "hp1Link"]}
																	label='Home page Portrait link to'
																	normalize={stripDomainInLink}
																>
																	<Input />
																</Form.Item>
															</Col>

															<Col span={12}>
																<Form.Item
																	name={["homepageV2", "timerVisible"]}
																	label='Timer Visible?'
																	valuePropName='checked'
																>
																	<Switch checkedChildren={"Yes"} unCheckedChildren={"No"} />
																</Form.Item>
															</Col>

															<Col span={24}>
																<ModifiedDivider />
															</Col>
															<Col sm={24} md={12}>
																<Form.Item
																	name={["homepageV2", "hp2"]}
																	label='Home page Landscape 1'
																	normalize={stripDomainInLink}
																>
																	<Input />
																</Form.Item>
															</Col>
															<Col sm={24} md={12}>
																<Form.Item name={["homepageV2", "hp2Alt"]} label='Alt tag'>
																	<Input />
																</Form.Item>
															</Col>

															<Col sm={24} md={12}>
																<Form.Item
																	name={["homepageV2", "hp2Link"]}
																	label='Home page Landscape 1 link to'
																	normalize={stripDomainInLink}
																>
																	<Input />
																</Form.Item>
															</Col>
															<Col span={24}>
																<ModifiedDivider />
															</Col>

															<Col sm={24} md={12}>
																<Form.Item
																	name={["homepageV2", "hp3"]}
																	label='Home page Landscape 2'
																	normalize={stripDomainInLink}
																>
																	<Input />
																</Form.Item>
															</Col>
															<Col sm={24} md={12}>
																<Form.Item name={["homepageV2", "hp3Alt"]} label='Alt tag'>
																	<Input />
																</Form.Item>
															</Col>
															<Col sm={24} md={12}>
																<Form.Item
																	name={["homepageV2", "hp3Link"]}
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
																	Shop Page Banners
																</Title>
															</Col>
															<Col sm={24} md={12}>
																<Form.Item
																	name={["injectBannerV2", "cdn"]}
																	label='Inject banner'
																	normalize={stripDomainInLink}
																	rules={[{ required: true }]}
																>
																	<Input />
																</Form.Item>
															</Col>
															<Col sm={24} md={12}>
																<Form.Item
																	name={["injectBannerV2", "link"]}
																	label='Inject banner Link'
																	normalize={stripDomainInLink}
																>
																	<Input />
																</Form.Item>
															</Col>
															<Col sm={24} md={12}>
																<Form.Item name={["injectBannerV2", "alt"]} label='Alt tag'>
																	<Input />
																</Form.Item>
															</Col>
															<Col span={12}>
																<Form.Item
																	name={["injectBannerV2", "visible"]}
																	label='Inject banner Visible?'
																	valuePropName='checked'
																>
																	<Switch checkedChildren={"Yes"} unCheckedChildren={"No"} />
																</Form.Item>
															</Col>
															<Col span={12}>
																<Form.Item
																	name={["injectBannerV2", "timerVisible"]}
																	label='Timer Visible?'
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
																	Design Listing Page Banners
																</Title>
															</Col>
															<Col sm={24} md={12}>
																<Form.Item
																	name={["designListingV2", "cdn"]}
																	label='Design Listing banner'
																	normalize={stripDomainInLink}
																	rules={[{ required: true }]}
																>
																	<Input />
																</Form.Item>
															</Col>
															<Col sm={24} md={12}>
																<Form.Item
																	name={["designListingV2", "link"]}
																	label='Design listing banner Link'
																	normalize={stripDomainInLink}
																>
																	<Input />
																</Form.Item>
															</Col>
															<Col sm={24} md={12}>
																<Form.Item name={["designListingV2", "alt"]} label='Alt tag'>
																	<Input />
																</Form.Item>
															</Col>
															<Col span={12}>
																<Form.Item
																	name={["designListingV2", "visible"]}
																	label='Design listing banner Visible?'
																	valuePropName='checked'
																>
																	<Switch checkedChildren={"Yes"} unCheckedChildren={"No"} />
																</Form.Item>
															</Col>
															<Col span={12}>
																<Form.Item
																	name={["designListingV2", "timerVisible"]}
																	label='Timer Visible?'
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
																	Design View Page Banners
																</Title>
															</Col>
															<Col sm={24} md={12}>
																<Form.Item
																	name={["designViewV2", "cdn"]}
																	label='Design View banner'
																	normalize={stripDomainInLink}
																	rules={[{ required: true }]}
																>
																	<Input />
																</Form.Item>
															</Col>
															<Col sm={24} md={12}>
																<Form.Item
																	name={["designViewV2", "link"]}
																	label='Design View banner Link'
																	normalize={stripDomainInLink}
																>
																	<Input />
																</Form.Item>
															</Col>
															<Col sm={24} md={12}>
																<Form.Item name={["designViewV2", "alt"]} label='Alt tag'>
																	<Input />
																</Form.Item>
															</Col>
															<Col span={12}>
																<Form.Item
																	name={["designViewV2", "visible"]}
																	label='Design View banner Visible?'
																	valuePropName='checked'
																>
																	<Switch checkedChildren={"Yes"} unCheckedChildren={"No"} />
																</Form.Item>
															</Col>
															<Col span={12}>
																<Form.Item
																	name={["designViewV2", "timerVisible"]}
																	label='Timer Visible?'
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
																	name={["cartBannerV2", "cdn"]}
																	label='Cart banner'
																	rules={[{ required: true }]}
																	normalize={stripDomainInLink}
																>
																	<Input />
																</Form.Item>
															</Col>
															<Col sm={24} md={12}>
																<Form.Item
																	name={["cartBannerV2", "link"]}
																	label='Cart banner Link to'
																	normalize={stripDomainInLink}
																>
																	<Input />
																</Form.Item>
															</Col>
															<Col sm={24} md={12}>
																<Form.Item name={["cartBannerV2", "alt"]} label='Alt tag'>
																	<Input />
																</Form.Item>
															</Col>
															<Col sm={24} md={12}>
																<Form.Item
																	name={["cartBannerV2", "visible"]}
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
																	name={["countdownV2", "time"]}
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
																<Form.Item name={["countdownV2", "endMessage"]} label='Countdown expiry message'>
																	<Input />
																</Form.Item>
															</Col>
															<Col sm={24} md={12}>
																<Form.Item name={["countdownV2", "color"]} label='Text Color'>
																	<Input type='color' />
																</Form.Item>
															</Col>
															<Col>
																<Form.Item shouldUpdate>
																	{({ getFieldValue }) => {
																		const color = getFieldValue(["countdown", "color"]);
																		return (
																			<Text strong style={{ color: color }}>
																				Sample text to view color
																			</Text>
																		);
																	}}
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
																<Form.Item
																	shouldUpdate={(prevValues, newValues) => {
																		if (
																			prevValues.countdown !== newValues.countdown ||
																			prevValues.broadcast !== newValues.broadcast
																		) {
																			return true;
																		}
																	}}
																>
																	{({ getFieldsValue }) => {
																		const fieldValues = getFieldsValue(true);
																		return (
																			<BroadcastingStrip
																				broadcastingStripData={{
																					...fieldValues.broadcast,
																					...fieldValues.countdown,
																				}}
																			/>
																		);
																	}}
																</Form.Item>
															</Col>
															<Col sm={24} md={12}>
																<Form.Item
																	name={["broadcastV2", "beforePulseDot"]}
																	label='Before Pulse dot'
																	rules={[{ required: true }]}
																>
																	<Input />
																</Form.Item>
															</Col>
															<Col sm={24} md={12}>
																<Form.Item name={["broadcastV2", "afterPulseDot"]} label='After Pulse Dot'>
																	<Input />
																</Form.Item>
															</Col>
															<Col sm={24} md={12}>
																<Form.Item name={["broadcastV2", "highlightText"]} label='Highlighted Text'>
																	<Input />
																</Form.Item>
															</Col>
															<Col sm={24} md={12}>
																<Form.Item name={["broadcastV2", "afterCoupon"]} label='After Highlighted text'>
																	<Input />
																</Form.Item>
															</Col>
															<Col span={24}>
																<Form.Item
																	name={["broadcastV2", "link"]}
																	label='Broadcast Link to'
																	normalize={stripDomainInLink}
																>
																	<Input />
																</Form.Item>
															</Col>
															<Col sm={12} md={6}>
																<Form.Item
																	name={["broadcastV2", "isHighlightCoupon"]}
																	label='Is Highlighted text a Coupon?'
																	valuePropName='checked'
																>
																	<Switch checkedChildren={"Yes"} unCheckedChildren={"No"} />
																</Form.Item>
															</Col>

															<Col sm={12} md={6}>
																<Form.Item
																	name={["broadcastV2", "broadcaststripVisible"]}
																	label='Strip Visible to customer?'
																	valuePropName='checked'
																>
																	<Switch checkedChildren={"Yes"} unCheckedChildren={"No"} />
																</Form.Item>
															</Col>
															<Col sm={12} md={6}>
																<Form.Item
																	name={["broadcastV2", "pulseDot"]}
																	label='Pulse dot visible?'
																	valuePropName='checked'
																>
																	<Switch checkedChildren={"Yes"} unCheckedChildren={"No"} />
																</Form.Item>
															</Col>
															<Col sm={12} md={6}>
																<Form.Item
																	name={["broadcastV2", "timerVisible"]}
																	label='Timer Visible?'
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
