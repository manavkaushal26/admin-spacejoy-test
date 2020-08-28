import { ArrowLeftOutlined, PlusOutlined } from "@ant-design/icons";
import { uploadRetailerImageApi } from "@api/ecommerceApi";
import { retailerApi } from "@api/retailerApi";
import ImageDisplayModal from "@components/ImageDisplayModal";
import { EcommRetailer } from "@customTypes/assetInfoTypes";
import { Status } from "@customTypes/userType";
import { MaxHeightDiv } from "@sections/Dashboard/styled";
import PageLayout from "@sections/Layout";
import { ProtectRoute } from "@utils/authContext";
import { getBase64 } from "@utils/commonUtils";
import { cloudinary, cookieNames, page } from "@utils/config";
import fetcher from "@utils/fetcher";
import getCookie from "@utils/getCookie";
import IndexPageMeta from "@utils/meta";
import {
	Button,
	Col,
	Form,
	Input,
	InputNumber,
	notification,
	Radio,
	Row,
	Select,
	Slider,
	Spin,
	Typography,
	Upload,
} from "antd";
import { FormInstance } from "antd/lib/form";
import { UploadChangeParam, UploadFile } from "antd/lib/upload/interface";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { LoudPaddingDiv } from "pages/platformanager";
import React, { useEffect, useMemo, useRef, useState } from "react";

const { Text, Title } = Typography;

interface ModifyRetailer {
	mode: "edit" | "new";
	retailerId?: string;
	retailer?: EcommRetailer;
}

const validateMessages = {
	required: "'${label}' is required!",
};

const ratingMarks = {
	0: "Bad",
	1: "Ok",
	2: "Average",
	3: "Good",
	4: "Very Good",
	5: "Excellent",
};

const ModifyRetailer: NextPage<ModifyRetailer> = ({ mode = "new", retailerId, retailer: serverRetailer }) => {
	const [retailer, setRetailer] = useState<Partial<EcommRetailer>>(
		serverRetailer || {
			status: Status.inactive,
			modeOfOperation: "offline",
			sellType: "buy",
			exclusive: false,
			partner: false,
		}
	);
	const [changedFields, setChangedFields] = useState<Partial<EcommRetailer>>();
	const [loading, setLoading] = useState(false);
	const [logoThumbnail, setLogoThumbnail] = useState<UploadFile[]>([]);
	const [preview, setPreview] = useState({ previewImage: "", previewVisible: false });

	const formRef = useRef<FormInstance>();
	const Router = useRouter();

	const uploadImageEndpoint = useMemo(
		() => retailer._id && `${page.apiBaseUrl}${uploadRetailerImageApi(retailer._id)}`,
		[retailer]
	);

	useEffect(() => {
		if (retailer.logoCdn) {
			setLogoThumbnail([
				{
					uid: "-1",
					name: retailer.logoCdn.split("/").pop(),
					status: "done",
					url: `${cloudinary.baseDeliveryURL}/image/upload/${retailer.logoCdn}`,
					size: 0,
					type: "application/octet-stream",
				},
			]);
		}
	}, [retailer]);

	const fetchAndPopulateRetailerdata = async () => {
		setLoading(true);

		const endPoint = retailerApi(retailerId);
		try {
			const response = await fetcher({ endPoint, method: "GET" });
			if (response.statusCode <= 300) {
				setRetailer(response.data);
			}
		} catch (_e) {
			notification.error({ message: "Failed to fetch Retailer info" });
		}

		setLoading(false);
	};

	useEffect(() => {
		if (formRef.current && retailer) {
			const { setFieldsValue } = formRef.current;
			setFieldsValue(retailer);
		}
	}, [retailer]);

	useEffect(() => {
		if (retailerId && !serverRetailer) {
			fetchAndPopulateRetailerdata();
		}
	}, [retailerId]);

	const onChange = changedFieldsInForm => {
		if (changedFieldsInForm.length) {
			setChangedFields({ ...changedFields, [changedFieldsInForm[0].name[0]]: changedFieldsInForm[0].value });
		}
	};

	const onFinish = async () => {
		setLoading(true);
		const endPoint = retailerApi(mode === "edit" ? retailerId : undefined);
		const newAssetData = {
			...{ ...(retailer ? retailer : {}) },
			...changedFields,
		};

		try {
			const response = await fetcher({
				endPoint,
				method: mode === "edit" ? "PUT" : "POST",
				body: mode === "edit" ? { ...changedFields } : { ...newAssetData },
			});
			if (response.statusCode <= 300) {
				setRetailer(response.data);
				notification.success({ message: "Successfully updated retailer" });
				if (mode === "new") {
					Router.push(
						`/ecommerce/retailers/modifyretailer?id=${response.data._id}&mode=edit`,
						`/ecommerce/retailers/modifyretailer?id=${response.data._id}&mode=edit`
					);
				}
			} else {
				throw new Error();
			}
		} catch (_e) {
			notification.error({ message: "Failed to save" });
		}
		setLoading(false);
	};

	const handleOnFileUploadChange = (info: UploadChangeParam<UploadFile>): void => {
		let fileList = [...info.fileList];

		fileList = fileList.slice(-1);
		// 1. Limit the number of uploaded files
		// Only to show one recent uploaded files, and old ones will be replaced by the new
		if (info.file.status === "done") {
			notification.open({ key: "thumbnail", message: "Uploaded thumbnail" });
			setRetailer({ ...retailer, ...info.file.response.data });
		} else if (info.file.status === "error") {
			notification.error({ message: "Error uploading file" });
		} else {
			notification.open({ key: "thumbnail", message: "Uploading thumbnail" });
		}
		setLogoThumbnail(fileList);
	};

	const handleCancel = (): void => setPreview({ previewImage: "", previewVisible: false });

	const handlePreview = async (file): Promise<void> => {
		const fileCopy = { ...file };
		if (!fileCopy.url && !fileCopy.preview) {
			fileCopy.preview = await getBase64(fileCopy.originFileObj);
		}

		setPreview({
			previewImage: fileCopy.url || fileCopy.preview,
			previewVisible: true,
		});
	};

	return (
		<PageLayout pageName='Modify Retailer'>
			<Head>
				<title>Retailer</title>
				{IndexPageMeta}
			</Head>
			<Spin spinning={loading}>
				<MaxHeightDiv>
					<LoudPaddingDiv>
						<Row>
							<Col>
								<Col>
									<Title level={3}>
										<Row gutter={[8, 8]}>
											<Col>
												<ArrowLeftOutlined onClick={() => Router.back()} />
											</Col>
											<Col>
												{retailer?.name ? "Edit" : "Create"} {retailer?.name || "retailer"}
											</Col>
										</Row>
									</Title>
								</Col>
							</Col>
						</Row>
						<Row>
							<Form
								ref={formRef}
								initialValues={retailer}
								labelCol={{ span: 24 }}
								scrollToFirstError={true}
								validateMessages={validateMessages}
								onFinish={onFinish}
								onFieldsChange={onChange}
							>
								<Row gutter={[16, 0]}>
									<Col span={24}>
										<Form.Item label='Name' name='name' rules={[{ required: true }]}>
											<Input />
										</Form.Item>
									</Col>
									<Col span={24}>
										<Form.Item label='Description' name='description'>
											<Input.TextArea />
										</Form.Item>
									</Col>
									<Col sm={24} md={12}>
										<Form.Item label='URL' name='url' rules={[{ required: true }]}>
											<Input type='url' />
										</Form.Item>
									</Col>
									<Col sm={24} md={12} lg={6}>
										<Form.Item label='Brand Color' name='brandColor'>
											<Input type='color' />
										</Form.Item>
									</Col>
									<Col sm={24} md={12} lg={6}>
										<Form.Item label='Status' name='status' rules={[{ required: true }]}>
											<Select defaultValue='inactive'>
												<Select.Option key='active' value='active'>
													Active
												</Select.Option>
												<Select.Option key='inactive' value='inactive'>
													Inactive
												</Select.Option>
											</Select>
										</Form.Item>
									</Col>
									<Col sm={24} md={12} lg={6}>
										<Form.Item label='Mode of Operation' name='modeOfOperation'>
											<Select defaultValue='offline'>
												<Select.Option key='online' value='online'>
													Online
												</Select.Option>
												<Select.Option key='offline' value='offline'>
													Offline
												</Select.Option>
												<Select.Option key='both' value='both'>
													Both Modes
												</Select.Option>
											</Select>
										</Form.Item>
									</Col>
									<Col sm={24} md={12} lg={6}>
										<Form.Item label='Purchase options' name='sellType'>
											<Select defaultValue='buy'>
												<Select.Option key='buy' value='buy'>
													Buy
												</Select.Option>
												<Select.Option key='rent' value='rent'>
													Rent
												</Select.Option>
												<Select.Option key='both' value='both'>
													Both Modes
												</Select.Option>
											</Select>
										</Form.Item>
									</Col>
									<Col sm={24} md={12}>
										<Form.Item label='Rating' name='rating'>
											<Slider min={0} marks={ratingMarks} max={5} step={1} />
										</Form.Item>
									</Col>
									<Col sm={24} md={12} lg={6}>
										<Form.Item label='Partner Brand?' name='partner'>
											<Radio.Group defaultValue={false}>
												<Radio value={true}>Yes</Radio>
												<Radio value={false}>No</Radio>
											</Radio.Group>
										</Form.Item>
									</Col>

									<Col sm={24} md={12} lg={6}>
										<Form.Item label='Exclusive Partner?' name='exclusive'>
											<Radio.Group defaultValue={false}>
												<Radio value={true}>Yes</Radio>
												<Radio value={false}>No</Radio>
											</Radio.Group>
										</Form.Item>
									</Col>
									<Col sm={24} md={12} lg={6}>
										<Form.Item
											label='Return Period (in Hours)'
											name='returnTimeLimit'
											rules={[{ type: "number", min: 0 }]}
										>
											<InputNumber style={{ width: "100%" }} />
										</Form.Item>
									</Col>
									<Col span={24}>
										<Form.Item label='Shipping Policy' name='shippingPolicy' rules={[{ required: true }]}>
											<Input.TextArea />
										</Form.Item>
									</Col>
									<Col span={24}>
										<Form.Item label='Cancellation Policy' name='cancellationPolicy' rules={[{ required: true }]}>
											<Input.TextArea />
										</Form.Item>
									</Col>
									<Col span={24}>
										<Form.Item label='Refund Policy' name='refundPolicy'>
											<Input.TextArea />
										</Form.Item>
									</Col>
									<Col span={24}>
										<Form.Item label='Return Policy' name='returnPolicy'>
											<Input.TextArea />
										</Form.Item>
									</Col>
									<Col span={24}>
										<Form.Item label='Estimated Arrival' name='estimatedArrival'>
											<Input />
										</Form.Item>
									</Col>
									<Col span={24}>
										<Form.Item label='Estimated Dispatch' name='estimatedDispatch'>
											<Input />
										</Form.Item>
									</Col>
									<Col span={24}>
										<Form.Item name='shippingOfferQuote' label='Shipping Offers'>
											<Input />
										</Form.Item>
									</Col>
									<Col span={24}>
										<Form.Item name='tags' label='Tags'>
											<Select mode='tags' tokenSeparators={[","]} open={false} />
										</Form.Item>
									</Col>
									{retailer._id && (
										<Col span={24}>
											<Form.Item label='Retailer Logo'>
												<Upload
													supportServerRender
													name='file'
													fileList={logoThumbnail}
													listType='picture-card'
													onPreview={handlePreview}
													action={uploadImageEndpoint}
													onRemove={(): false => false}
													onChange={handleOnFileUploadChange}
													headers={{ Authorization: getCookie(null, cookieNames.authToken) }}
													accept='image/*'
												>
													<Row>
														<Col span={24}>
															<PlusOutlined />
														</Col>
														<Col span={24}>
															<Text>Add Image</Text>
														</Col>
													</Row>
												</Upload>
											</Form.Item>
										</Col>
									)}
									<Col span={24}>
										<Form.Item>
											<Button loading={loading} htmlType='submit' type='primary'>
												Submit
											</Button>
										</Form.Item>
									</Col>
								</Row>
							</Form>
						</Row>
					</LoudPaddingDiv>
				</MaxHeightDiv>
			</Spin>
			<ImageDisplayModal
				handleCancel={handleCancel}
				previewImage={preview.previewImage}
				previewVisible={preview.previewVisible}
				altText='previewImages'
			/>
		</PageLayout>
	);
};

export const getServerSideProps: GetServerSideProps<ModifyRetailer> = async ctx => {
	const { query } = ctx;
	const mode = query.mode as "edit" | "new";
	const retailerId = (query.id || "") as string;

	if (retailerId) {
		try {
			const endPoint = retailerApi(retailerId);

			const response = await fetcher({ ctx, endPoint, method: "GET" });
			if (response.statusCode <= 300) {
				return { props: { mode, retailerId, retailer: response.data } };
			}
		} catch (_e) {
			return {
				props: { mode, retailerId },
			};
		}
	}

	return {
		props: { mode, retailerId },
	};
};

export default ProtectRoute(ModifyRetailer);
