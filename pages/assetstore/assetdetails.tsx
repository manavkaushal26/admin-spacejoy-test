import {
	ArrowLeftOutlined,
	CheckCircleTwoTone,
	CloseCircleTwoTone,
	LinkOutlined,
	LoadingOutlined,
	PlusOutlined,
	UploadOutlined,
} from "@ant-design/icons";
import { assetCreateOrUpdationApi, markMissingAssetAsComplete, uploadProductImagesApi } from "@api/assetApi";
import { getMetaDataApi, getSingleAssetApi, uploadAssetModelApi } from "@api/designApi";
import ImageDisplayModal from "@components/ImageDisplayModal";
import { MountTypes, MountTypesLabels } from "@customTypes/assetInfoTypes";
import { Model3DFiles, ModelToExtensionMap } from "@customTypes/dashboardTypes";
import { AssetType, MetaDataType } from "@customTypes/moodboardTypes";
import User, { AssetStatus, Status } from "@customTypes/userType";
import { MaxHeightDiv, SilentDivider } from "@sections/Dashboard/styled";
import PageLayout from "@sections/Layout";
import { redirectToLocation, withAuthVerification } from "@utils/auth";
import { convertToFeet, convertToInches, getBase64, getValueSafely } from "@utils/commonUtils";
import { cloudinary, company, cookieNames } from "@utils/config";
import fetcher from "@utils/fetcher";
import getCookie from "@utils/getCookie";
import IndexPageMeta from "@utils/meta";
import {
	Button,
	Col,
	Collapse,
	Divider,
	Form,
	Input,
	InputNumber,
	Modal,
	notification,
	Row,
	Select,
	Space,
	Spin,
	Switch,
	Tooltip,
	Typography,
	Upload,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import { RcFile, UploadChangeParam, UploadFile } from "antd/lib/upload/interface";
import { NextPage, NextPageContext } from "next";
import Head from "next/head";
import { LoudPaddingDiv } from "pages/platformanager";
import React, { useEffect, useMemo, useState } from "react";

const { Title, Text } = Typography;

const validateMessages = {
	required: "'${label}' is required!",
};

interface AssetStoreProps {
	isServer: boolean;
	authVerification: Partial<User>;
	assetId: string;
	mai: string;
	designId: string;
	retailLink: string;
	entry: string;
}

interface CategoryMap {
	key: string;
	title: {
		name: string;
		level: string;
	};
	children?: Array<CategoryMap>;
}

const AssetDetailPage: NextPage<AssetStoreProps> = ({
	isServer,
	authVerification,
	assetId,
	mai,
	designId,
	retailLink,
	entry,
}) => {
	const [loading, setLoading] = useState(false);
	const [state, setState] = useState<Partial<AssetType>>({});
	const [metadata, setMetadata] = useState<MetaDataType>();
	const [model3dFiles, setModel3dFiles] = useState<Model3DFiles>(Model3DFiles.Glb);
	const [changedState, setChangedState] = useState<Record<string, any>>({});
	const [assetFile, setAssetFile] = useState<UploadFile<any>[]>([]);
	const [imageFile, setImageFile] = useState<UploadFile<any>[]>([]);
	const [imageFilesToUpload, setImageFilesToUpload] = useState([]);

	const [preview, setPreview] = useState<{ previewImage: string; previewVisible: boolean }>({
		previewImage: "",
		previewVisible: false,
	});

	const [sourceFileList, setSourceFileList] = useState<UploadFile<any>[]>([]);
	const [sourceHighPolyFileList, setSourceHighPolyFileList] = useState<UploadFile<any>[]>([]);

	const [form] = useForm();

	const uploadModelEndpoint = useMemo(() => uploadAssetModelApi(state._id, model3dFiles), [state._id, model3dFiles]);
	const uploadModelSourceEndpoint = useMemo(() => uploadAssetModelApi(state._id, "source"), [state._id]);
	const uploadAssetImageEndpoint = useMemo(() => uploadProductImagesApi(state._id), [state._id]);
	const uploadModelHighPolySouceEndpoint = useMemo(() => uploadAssetModelApi(state._id, "sourceHighPoly"), [state._id]);

	const fetchMetaData = async (): Promise<void> => {
		const endpoint = getMetaDataApi();
		const response = await fetcher({ endPoint: endpoint, method: "GET" });

		if (response.statusCode === 200) {
			setMetadata(response.data);
		}
	};

	useEffect(() => {
		if (!assetId && !!state._id) {
			redirectToLocation({
				pathname: "/assetstore/assetdetails",
				query: { assetId: state._id, mai: mai, designId: designId, entry },
				url: `/assetstore/assetdetails?assetId=${state._id}${mai ? `&mai=${mai}` : ""}${
					designId ? `&did=${designId}` : ""
				}${entry ? `&entry=${entry}` : ""}`,
				options: { shallow: true },
			});
		}
	}, [state._id]);

	const fetchAssetData = async (): Promise<void> => {
		setLoading(true);
		const endPoint = getSingleAssetApi(assetId);
		const response = await fetcher({ endPoint, method: "GET" });

		if (response.statusCode <= 300) {
			const { category, subcategory, vertical, theme } = getValueSafely(() => response.data.meta, {
				category: { _id: "", name: "Undefined" },
				subcategory: { _id: "", name: "Undefined" },
				vertical: { _id: "", name: "Undefined" },
				theme: { _id: "", name: "Undefined" },
			});
			setState({
				...response.data,
				"meta": {
					category: getValueSafely(() => category._id, "Undefined"),
					subcategory: getValueSafely(() => subcategory._id, "Undefined"),
					vertical: getValueSafely(() => vertical._id, "Undefined"),
					theme: getValueSafely(() => theme._id, "Undefined"),
				},
				"dimension": {
					width: getValueSafely(() => convertToInches(response.data.dimension.width), 0),
					depth: getValueSafely(() => convertToInches(response.data.dimension.depth), 0),
					height: getValueSafely(() => convertToInches(response.data.dimension.height), 0),
				},
				"retailer": getValueSafely(() => response.data.retailer._id, ""),
				"spatialData.mountType": response.data.spatialData.mountType,
				"spatialData.clampValue": response.data.spatialData.clampValue,
				"weight": parseFloat(response.data.weight),
				"price": parseFloat(response.data.weight),
			});
		} else {
			notification.error({ message: "Failed to load asset data" });
		}
		setLoading(false);
	};

	const handleCancel = (): void => setPreview({ previewImage: "", previewVisible: false });

	const onFieldsChange = changedFieldsData => {
		if (changedFieldsData.length) {
			if (changedFieldsData[0].name.length > 1) {
				setChangedState({
					...changedState,
					[changedFieldsData[0]?.name[0]]: {
						...{ ...(changedState[changedFieldsData[0]?.name[0]] ? changedState[changedFieldsData[0]?.name[0]] : {}) },
						[changedFieldsData[0]?.name[1]]: changedFieldsData[0]?.value,
					},
				});
			} else {
				setChangedState({
					...changedState,
					[changedFieldsData[0]?.name[0]]: changedFieldsData[0]?.value,
				});
			}
		}
	};

	useEffect(() => {
		form.setFieldsValue(state);
	}, [state]);

	useEffect(() => {
		fetchMetaData();
		if (assetId) {
			fetchAssetData();
		}
		if (retailLink) {
			setState(prevState => ({ ...prevState, retailLink: retailLink }));
			setChangedState(prevState => ({ ...prevState, retailLink: retailLink }));
		}
	}, [assetId, retailLink]);

	useEffect(() => {
		if (state) {
			if (state.productImages) {
				setImageFile(
					state.productImages.map(image => {
						return {
							uid: image._id,
							name: image.cdn.split("/").pop(),
							status: "done",
							url: `${cloudinary.baseDeliveryURL}/image/upload/${image.cdn}`,
							size: 0,
							type: "application/octet-stream",
						};
					})
				);
			} else if (state.cdn) {
				setImageFile([
					{
						uid: "-1",
						name: state.cdn.split("/").pop(),
						status: "done",
						url: `${cloudinary.baseDeliveryURL}/image/upload/${state.cdn}`,
						size: 0,
						type: "application/octet-stream",
					},
				]);
			}
			if (state.spatialData) {
				const {
					spatialData: {
						fileUrls: { glb, legacy_obj: legacyObj, source, sourceHighPoly },
					},
				} = state;

				if (model3dFiles === Model3DFiles.Glb) {
					if (glb) {
						const uploadedAssetFiles = glb.split("/").pop();
						setAssetFile([
							{
								uid: "-1",
								name: uploadedAssetFiles,
								status: "done",
								url: glb,
								size: 0,
								type: "application/octet-stream",
							},
						]);
					} else {
						setAssetFile(null);
					}
				} else if (model3dFiles === Model3DFiles.Obj) {
					if (legacyObj) {
						const uploadedAssetFiles = legacyObj.split("/").pop();
						setAssetFile([
							{
								uid: "-1",
								name: uploadedAssetFiles,
								status: "done",
								url: legacyObj,
								size: 0,
								type: "application/octet-stream",
							},
						]);
					} else {
						setAssetFile(null);
					}
				}
				if (source) {
					const fileName = source.split("/").pop();
					setSourceFileList([
						{
							uid: "-1",
							name: fileName,
							status: "done",
							url: source,
							size: 0,
							type: "application/octet-stream",
						},
					]);
				}
				if (sourceHighPoly) {
					const fileName = source.split("/").pop();
					setSourceHighPolyFileList([
						{
							uid: "-1",
							name: fileName,
							status: "done",
							url: sourceHighPoly,
							size: 0,
							type: "application/octet-stream",
						},
					]);
				}
			}
		}
	}, [state]);

	useEffect(() => {
		if (state) {
			if (state.spatialData) {
				const {
					spatialData: {
						fileUrls: { glb, legacy_obj: legacyObj },
					},
				} = state;
				if (model3dFiles === Model3DFiles.Glb) {
					if (glb) {
						const uploadedAssetFiles = glb.split("/").pop();
						setAssetFile([
							{
								uid: "-1",
								name: uploadedAssetFiles,
								status: "done",
								url: glb,
								size: 0,
								type: "application/octet-stream",
							},
						]);
					} else {
						setAssetFile(null);
					}
				} else if (model3dFiles === Model3DFiles.Obj) {
					if (legacyObj) {
						const uploadedAssetFiles = legacyObj.split("/").pop();
						setAssetFile([
							{
								uid: "-1",
								name: uploadedAssetFiles,
								status: "done",
								url: legacyObj,
								size: 0,
								type: "application/octet-stream",
							},
						]);
					} else {
						setAssetFile(null);
					}
				}
			}
		}
	}, [model3dFiles]);

	const checkFileExtension = (uploadFileType: "model" | "source", info: RcFile): boolean => {
		const fileList = [];

		if (uploadFileType === "model") {
			if (!info.name.endsWith(ModelToExtensionMap[model3dFiles])) {
				notification.error({ message: "Please Upload the correct file type" });
				setAssetFile(fileList);
				return false;
			}
		}
		if (uploadFileType === "source") {
			if (!info.name.endsWith(".blend")) {
				notification.error({ message: "Please Upload '.blend' file" });
				setAssetFile(fileList);
				return false;
			}
		}
		return true;
	};

	const onSelect = (selectedValue): void => {
		setModel3dFiles(selectedValue as Model3DFiles);
	};

	const categoryMap: CategoryMap[] = useMemo(() => {
		if (metadata) {
			return metadata.categories.list.map(elem => {
				return {
					title: { name: elem.name, level: "category" },
					key: elem._id,
					children: metadata.subcategories.list
						.filter(subElem => {
							return subElem.category === elem._id;
						})
						.map(subElem => {
							return {
								title: { name: subElem.name, level: "subCategory" },
								key: subElem._id,
								children: metadata.verticals.list
									.filter(vert => {
										return vert.subcategory === subElem._id;
									})
									.map(filtVert => {
										return {
											title: { name: filtVert.name, level: "verticals" },
											key: filtVert._id,
										};
									}),
							};
						}),
				};
			});
		}
		return [];
	}, [metadata]);

	const openInNewWindow = (): void => {
		if (form.getFieldValue("retailLink")) {
			window.open(form.getFieldValue("retailLink"), "_blank", "noopener");
		}
	};

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

	const handleOnFileUploadChange = async (
		uploadFileType: "model" | "source" | "image" | "sourceHighPoly",
		info: UploadChangeParam<UploadFile>
	): Promise<void> => {
		let fileList = [...info.fileList];
		if (uploadFileType !== "image") {
			fileList = fileList.slice(-1);
		}
		// 1. Limit the number of uploaded files
		// Only to show one recent uploaded files, and old ones will be replaced by the new
		if (info.file.status === "done") {
			notification.success({ message: "Product Saved", description: "File has been uploaded" });
			if (uploadFileType === "model") {
				setState({ ...state, ...info.file.response.data });
				if (state.status !== Status.active) {
					setState({ ...state, status: Status.active });
				}
			} else {
				setState({ ...state, ...info.file.response.data });
			}
		}
		if (uploadFileType === "model") {
			setAssetFile(fileList);
		} else if (uploadFileType === "source") {
			setSourceFileList(fileList);
		} else if (uploadFileType === "sourceHighPoly") {
			setSourceHighPolyFileList(fileList);
		} else if (uploadFileType === "image") {
			setImageFile(fileList);
		}
	};

	const handleBeforeProductImageUpload = (file): boolean => {
		setImageFile(prevFileList => [...prevFileList, file]);
		setImageFilesToUpload(prevFileList => [...prevFileList, file]);
		return false;
	};

	const formatResponseOnRecieve: (dimension: {
		width: number;
		height: number;
		depth: number;
	}) => { width: number; height: number; depth: number } = dimension => {
		return {
			height: convertToInches(dimension.height),
			width: convertToInches(dimension.width),
			depth: convertToInches(dimension.depth),
		};
	};

	const handleProductImageDeleteAfterConfirm = async (file: RcFile) => {
		const endPoint = uploadAssetImageEndpoint;
		const key = "notify";

		notification.open({ icon: <LoadingOutlined />, message: "Deleting Product image", key, duration: 0 });

		try {
			const response = await fetcher({
				endPoint,
				method: "DELETE",
				body: { imageIds: [file.uid] },
			});
			if (response.statusCode <= 300) {
				const productImageFileList = response.data.productImages.map(image => {
					return {
						uid: image._id,
						name: image.cdn.split("/").pop(),
						status: "done",
						url: `${cloudinary.baseDeliveryURL}/image/upload/${image.cdn}`,
						size: 0,
						type: "application/octet-stream",
					};
				});
				setImageFile(productImageFileList);
				notification.success({ message: "Deleted Image successfully", key });
			} else {
				throw new Error();
			}
		} catch (e) {
			notification.error({ message: "Failed to Delete", key });
		}
	};
	const handleProductImageDelete = async (file: RcFile) => {
		Modal.confirm({
			title: "This will delete the image. Are you sure?",
			onOk: () => handleProductImageDeleteAfterConfirm(file),
		});
	};

	const handleProductImageUpload = async (): Promise<void> => {
		const endPoint = uploadAssetImageEndpoint;
		const key = "notify";
		const formData = new FormData();
		imageFilesToUpload.forEach(file => {
			formData.append("files", file, file.fileName);
		});
		notification.open({ icon: <LoadingOutlined />, message: "Uploading Product images", key, duration: 0 });

		try {
			const response = await fetcher({
				isMultipartForm: true,
				endPoint,
				method: "POST",
				body: formData,
			});
			if (response.statusCode <= 300) {
				const productImageFileList = response.data.productImages.map(image => {
					return {
						uid: image._id,
						name: image.cdn.split("/").pop(),
						status: "done",
						url: `${cloudinary.baseDeliveryURL}/image/upload/${image.cdn}`,
						size: 0,
						type: "application/octet-stream",
					};
				});
				console.log("productImageFileList", productImageFileList);
				setImageFile(productImageFileList);
				setImageFilesToUpload([]);
				notification.success({ message: "Uploaded Images successfully", key });
			} else {
				throw new Error();
			}
		} catch (e) {
			notification.error({ message: "Failed to upload", key });
		}
	};

	const formatdimensionForSending: (dimension: {
		"dimension.width": number;
		"dimension.height": number;
		"dimension.depth": number;
	}) => { width?: number; height?: number; depth?: number } = dimension => {
		const height = dimension["dimension.height"];
		const width = dimension["dimension.width"];
		const depth = dimension["dimension.depth"];

		if (!height && !width && !depth) {
			return {};
		}
		if (dimension) {
			return {
				...(dimension["dimension.height"] ? { height: convertToFeet(dimension["dimension.height"]) } : {}),
				...(dimension["dimension.width"] ? { width: convertToFeet(dimension["dimension.width"]) } : {}),
				...(dimension["dimension.depth"] ? { depth: convertToFeet(dimension["dimension.depth"]) } : {}),
			};
		}
		return {};
	};

	const markAssetAsComplete = async (id: Partial<AssetType>, status?: Status): Promise<void> => {
		const MARK_AS_COMPLETE_NOTIFICATION_KEY = "AssetUpdation";

		notification.open({
			key: MARK_AS_COMPLETE_NOTIFICATION_KEY,
			message: "Please Wait",
			icon: <LoadingOutlined />,
			description: "Asset status is being updated",
		});

		const endPoint = markMissingAssetAsComplete(designId, mai);
		if (id !== "") {
			const response = await fetcher({
				endPoint,
				method: "PUT",
				body: {
					data: {
						status: status || Status.completed,
						assetId: id,
					},
				},
			});
			if (response.status === "success" && response.statusCode <= 300) {
				notification.open({
					key: MARK_AS_COMPLETE_NOTIFICATION_KEY,
					message: "Successful",
					icon: <CheckCircleTwoTone twoToneColor='#52c41a' />,
					description: "Asset Status has been updated",
				});
			} else {
				notification.open({
					key: MARK_AS_COMPLETE_NOTIFICATION_KEY,
					message: "Error",
					icon: <CloseCircleTwoTone twoToneColor='#f5222d' />,
					description: "There was a problem marking this asset.",
				});
			}
		} else {
			notification.open({
				key: MARK_AS_COMPLETE_NOTIFICATION_KEY,
				message: "Error",
				icon: <CloseCircleTwoTone twoToneColor='#f5222d' />,
				description: "No asset has been uploaded for this link",
			});
		}
	};

	const onFinish = async (): Promise<void> => {
		const endPoint = assetCreateOrUpdationApi(state._id);

		const currentDimensions = formatdimensionForSending({
			"dimension.width": state.dimension?.width,
			"dimension.depth": state.dimension?.depth,
			"dimension.height": state.dimension?.height,
		});

		const dimensionToSend = formatdimensionForSending({
			"dimension.width": changedState.dimension?.width,
			"dimension.depth": changedState.dimension?.depth,
			"dimension.height": changedState.dimension?.height,
		});

		const requestBody = {
			...changedState,
			dimension: {
				...currentDimensions,
				...dimensionToSend,
			},
		};
		try {
			const response = await fetcher({
				endPoint,
				method: state._id ? "PUT" : "POST",
				body: {
					...requestBody,
				},
			});
			if (response.statusCode <= 300) {
				notification.success({ message: "Product Saved" });
				const responseAssetData = response.data;
				responseAssetData.spatialData.clampValue = responseAssetData.spatialData.clampValue !== -1;
				responseAssetData.dimension = formatResponseOnRecieve(responseAssetData.dimension);
				setState({ ...responseAssetData, weight: parseFloat(responseAssetData.weight) });
				setChangedState({});
				console.log("mai, designId", mai, designId);
				if (mai && designId) {
					markAssetAsComplete(responseAssetData._id, responseAssetData.status);
				}
			} else {
				notification.error({ message: "Failed to save Product", description: response.message });
			}
		} catch (e) {
			if (e.message === "Failed to fetch") {
				notification.error({ message: "Failed to save Product. Please check your internet connection and Retry" });
			} else {
				notification.error({ message: "Failed to save Product" });
			}
		}
	};

	return (
		<PageLayout isServer={isServer} authVerification={authVerification} pageName='Asset Editing'>
			<Head>
				<title>Asset Editing | {company.product}</title>
				{IndexPageMeta}
			</Head>
			<Spin spinning={loading}>
				<MaxHeightDiv>
					<LoudPaddingDiv>
						<Space direction='vertical' size='middle'>
							<Row gutter={[4, 4]} align='top'>
								<Col>
									<a href={entry}>
										<ArrowLeftOutlined style={{ fontSize: "2.3rem" }} />
									</a>
								</Col>
								<Col>
									<Title level={3}>{assetId ? "Asset Updation" : "Asset Creation"}</Title>
								</Col>
							</Row>
							<Form
								onFieldsChange={onFieldsChange}
								form={form}
								labelCol={{ span: 24 }}
								validateMessages={validateMessages}
								onFinish={onFinish}
							>
								<Collapse defaultActiveKey='coreDetails'>
									<Collapse.Panel header='Product Details' key='coreDetails'>
										<Row gutter={[16, 8]}>
											<Col sm={24} md={12}>
												<Row gutter={[4, 0]}>
													<Col span={24}>
														<Title level={4}>Product Details</Title>
													</Col>
													<Col span={24}>
														<Form.Item name='name' label='Name' rules={[{ required: true }]}>
															<Input />
														</Form.Item>
													</Col>
													<Col span={24}>
														<Form.Item name='description' label='Description' rules={[{ required: true }]}>
															<Input.TextArea />
														</Form.Item>
													</Col>
													<Col span={8}>
														<Form.Item
															name='price'
															label='Price (USD)'
															rules={[{ required: true, type: "number", min: 0 }]}
														>
															<InputNumber style={{ width: "100%" }} />
														</Form.Item>
													</Col>
													<Col span={8}>
														<Form.Item
															name='weight'
															label='Weight'
															rules={[{ required: true, type: "number", min: 0 }]}
														>
															<InputNumber style={{ width: "100%" }} />
														</Form.Item>
													</Col>
													<Col span={8}>
														<Form.Item name='weightUnit' label='Weight Unit' rules={[{ required: true }]}>
															<Select>
																<Select.Option value='kg'>Kg</Select.Option>
																<Select.Option value='lb'>lb</Select.Option>
															</Select>
														</Form.Item>
													</Col>
													<Col span={12}>
														<Form.Item name='material' label='Material' rules={[{ required: true }]}>
															<Input />
														</Form.Item>
													</Col>
													<Col span={12}>
														<Form.Item name='retailer' label='Retailer' rules={[{ required: true }]}>
															<Select
																placeholder='Select Retailer'
																showSearch
																optionFilterProp='children'
																style={{ width: "100%" }}
															>
																{metadata?.retailers?.list?.map(retailer => (
																	<Select.Option key={retailer._id} value={retailer._id}>
																		{retailer.name}
																	</Select.Option>
																))}
															</Select>
														</Form.Item>
													</Col>
													<Col span={24}>
														<Form.Item label='URL' name='retailLink' rules={[{ required: true, type: "url" }]}>
															<Input
																addonAfter={
																	<Tooltip placement='top' title='Open URL'>
																		<LinkOutlined onClick={openInNewWindow} />
																	</Tooltip>
																}
															/>
														</Form.Item>
													</Col>
													<Col span={8}>
														<Form.Item shouldUpdate>
															{() => {
																return (
																	<Form.Item
																		name={["meta", "category"]}
																		label='Category'
																		labelCol={{ span: 24 }}
																		rules={[{ required: true }]}
																	>
																		<Select showSearch optionFilterProp='children' placeholder='Select A Category'>
																			{categoryMap.map(category => (
																				<Select.Option key={category.key} value={category.key}>
																					{category.title.name}
																				</Select.Option>
																			))}
																		</Select>
																	</Form.Item>
																);
															}}
														</Form.Item>
													</Col>
													<Col span={8}>
														<Form.Item shouldUpdate>
															{({ getFieldValue }) => {
																return (
																	<Form.Item
																		name={["meta", "subcategory"]}
																		labelCol={{ span: 24 }}
																		label='Sub Category'
																		rules={[{ required: true }]}
																	>
																		<Select
																			disabled={!getFieldValue(["meta", "category"])}
																			showSearch
																			optionFilterProp='children'
																			placeholder='Select A Sub Category'
																		>
																			{categoryMap
																				.find(category => {
																					return category.key === form.getFieldValue(["meta", "category"]);
																				})
																				?.children?.map(category => (
																					<Select.Option key={category.key} value={category.key}>
																						{category.title.name}
																					</Select.Option>
																				))}
																		</Select>
																	</Form.Item>
																);
															}}
														</Form.Item>
													</Col>
													<Col span={8}>
														<Form.Item shouldUpdate>
															{({ getFieldValue }) => (
																<Form.Item
																	labelCol={{ span: 24 }}
																	name={["meta", "vertical"]}
																	label='Vertical'
																	rules={[{ required: true }]}
																>
																	<Select
																		disabled={!getFieldValue(["meta", "subcategory"])}
																		showSearch
																		optionFilterProp='children'
																		placeholder='Select A Vertical'
																	>
																		{categoryMap
																			.find(category => category.key === form.getFieldValue(["meta", "category"]))
																			?.children.find(
																				subCategory => subCategory.key === form.getFieldValue(["meta", "subcategory"])
																			)
																			?.children.map(category => (
																				<Select.Option key={category.key} value={category.key}>
																					{category.title.name}
																				</Select.Option>
																			))}
																	</Select>
																</Form.Item>
															)}
														</Form.Item>
													</Col>
													<Col span={12}>
														<Form.Item name={["meta", "theme"]} label='Theme'>
															<Select showSearch optionFilterProp='children' placeholder='Select a Theme'>
																{metadata?.themes?.list?.map(theme => (
																	<Select.Option value={theme._id} key={theme._id}>
																		{theme.name}
																	</Select.Option>
																))}
															</Select>
														</Form.Item>
													</Col>

													<Col span={12}>
														<Form.Item name='tags' label='Tags'>
															<Select mode='tags' open={false} tokenSeparators={[","]} />
														</Form.Item>
													</Col>
													<Col span={12}>
														<Form.Item name='shoppable' label='Shoppable' valuePropName='checked'>
															<Switch size='default' checkedChildren='Yes' unCheckedChildren='No' />
														</Form.Item>
													</Col>
													<Col span={12}>
														<Form.Item name='status' label='Status'>
															<Select>
																{Object.keys(AssetStatus).map(key => (
																	<Select.Option value={AssetStatus[key]} key={key}>
																		{key}
																	</Select.Option>
																))}
															</Select>
														</Form.Item>
													</Col>
												</Row>
											</Col>
											<Col sm={24} md={12}>
												<Row gutter={[8, 8]}>
													<Col span={24}>
														<Title level={4}>3D Properties</Title>
													</Col>
													<Col span={8}>
														<Form.Item
															name={["dimension", "width"]}
															label='Width (Inches)'
															rules={[{ required: true, type: "number", min: 0 }]}
														>
															<InputNumber style={{ width: "100%" }} />
														</Form.Item>
													</Col>
													<Col span={8}>
														<Form.Item
															name={["dimension", "depth"]}
															label='Depth (Inches)'
															rules={[{ required: true, type: "number", min: 0 }]}
														>
															<InputNumber style={{ width: "100%" }} />
														</Form.Item>
													</Col>
													<Col span={8}>
														<Form.Item
															name={["dimension", "height"]}
															label='Height (Inches)'
															rules={[{ required: true, type: "number", min: 0 }]}
														>
															<InputNumber style={{ width: "100%" }} />
														</Form.Item>
													</Col>
													<Col span={12}>
														<Form.Item name='spatialData.mountType' label='Mount Type'>
															<Select showSearch optionFilterProp='children' placeholder='Select a Mount Type'>
																{Object.keys(MountTypes).map(key => (
																	<Select.Option key={key} value={key}>
																		{MountTypesLabels[key]}
																	</Select.Option>
																))}
															</Select>
														</Form.Item>
													</Col>
													<Col span={12}>
														<Form.Item
															label='Interacts with other objects?'
															labelAlign='left'
															name='spatialData.clampValue'
															help='e.g. Rugs do not interact with other objects'
														>
															<Select>
																<Select.Option value={1}>Yes</Select.Option>
																<Select.Option value={0}>No</Select.Option>
															</Select>
														</Form.Item>
													</Col>
												</Row>
											</Col>
										</Row>
									</Collapse.Panel>
									<Collapse.Panel header='Additional Details (For E-commerce)' key='policies'>
										<Row gutter={[8, 0]}>
											<Col sm={24} md={8}>
												<Form.Item name='estimatedArrival' label='Estimated Arrival'>
													<Input />
												</Form.Item>
											</Col>
											<Col sm={24} md={8}>
												<Form.Item name='estimatedDispatch' label='Estimated Dispatch'>
													<Input />
												</Form.Item>
											</Col>
											<Col sm={24} md={8}>
												<Form.Item name='countryOfOrigin' label='Country of Origin'>
													<Input />
												</Form.Item>
											</Col>
											<Col sm={24} md={8}>
												<Form.Item name='stockQty' label='Stock Quantity' rules={[{ type: "number", min: 0 }]}>
													<InputNumber style={{ width: "100%" }} />
												</Form.Item>
											</Col>
											<Col sm={24} md={8}>
												<Form.Item name='flatShipping' label='Flat Shipping' rules={[{ type: "number", min: 0 }]}>
													<InputNumber style={{ width: "100%" }} />
												</Form.Item>
											</Col>
											<Col sm={24} md={8}>
												<Form.Item name='modeOfOperation' label='Stock Quantity'>
													<Select>
														<Select.Option value='online'>Online</Select.Option>
														<Select.Option value='offline'>Offline</Select.Option>

														<Select.Option value='both'>Both</Select.Option>
													</Select>
												</Form.Item>
											</Col>
											<Col span={24}>
												<Form.Item name='shippingPolicy' label='Shipping Policy'>
													<Input.TextArea />
												</Form.Item>
											</Col>
											<Col span={24}>
												<Form.Item name='cancellationPolicy' label='Cancellation Policy'>
													<Input.TextArea />
												</Form.Item>
											</Col>
											<Col span={24}>
												<Form.Item name='refundPolicy' label='Refund Policy'>
													<Input.TextArea />
												</Form.Item>
											</Col>
											<Col span={24}>
												<Form.Item name='returnPolicy' label='Return Policy'>
													<Input.TextArea />
												</Form.Item>
											</Col>
											<Col span={24}>
												<Form.Item name='warrantyInfo' label='Warranty Policy'>
													<Input.TextArea />
												</Form.Item>
											</Col>
											<Col span={24}>
												<Form.Item name='assemblyInfo' label='Assembly Policy'>
													<Input.TextArea />
												</Form.Item>
											</Col>
										</Row>
									</Collapse.Panel>
									<Collapse.Panel key='upload' header='Upload' disabled={!state._id}>
										<Row>
											<Col span={24}>
												<Title level={4}>File Upload</Title>
											</Col>
											<Col span={24}>
												<SilentDivider />
											</Col>
											<Col span={24}>
												<Row gutter={[8, 12]}>
													<Col span={24}>
														<Text strong>Upload Product File</Text>
													</Col>
													<Col lg={24}>
														<Row gutter={[8, 8]}>
															<Col span={24}>Type</Col>
															<Col span={24}>
																<Select style={{ width: "100%" }} value={model3dFiles} onSelect={onSelect}>
																	{Object.keys(Model3DFiles).map(key => {
																		return (
																			<Select.Option key={key} value={Model3DFiles[key]}>
																				{key}
																			</Select.Option>
																		);
																	})}
																</Select>
															</Col>
														</Row>
													</Col>
													<Col lg={16}>
														<Upload
															beforeUpload={(info): boolean => checkFileExtension("model", info)}
															supportServerRender
															name='file'
															fileList={assetFile}
															action={uploadModelEndpoint}
															onRemove={(): false => false}
															onChange={(info): Promise<void> => handleOnFileUploadChange("model", info)}
															headers={{ Authorization: getCookie(null, cookieNames.authToken) }}
															accept={ModelToExtensionMap[model3dFiles]}
														>
															<Button>
																<UploadOutlined />
																Click to Upload
															</Button>
														</Upload>
													</Col>
												</Row>
												<Row gutter={[0, 12]}>
													<Col span={24}>
														<Text strong>Upload Low/Medium Poly File</Text>
													</Col>
													<Col lg={12}>
														<Upload
															beforeUpload={(info): boolean => checkFileExtension("source", info)}
															supportServerRender
															name='file'
															fileList={sourceFileList}
															action={uploadModelSourceEndpoint}
															onRemove={(): false => false}
															onChange={(info): Promise<void> => handleOnFileUploadChange("source", info)}
															headers={{ Authorization: getCookie(null, cookieNames.authToken) }}
															accept='.blend'
														>
															<Button>
																<UploadOutlined />
																Click to Upload
															</Button>
														</Upload>
													</Col>
												</Row>
												<Row gutter={[0, 12]}>
													<Col span={24}>
														<Text strong>Upload High Poly File(Optional)</Text>
													</Col>
													<Col lg={12}>
														<Upload
															beforeUpload={(info): boolean => checkFileExtension("source", info)}
															supportServerRender
															name='file'
															fileList={sourceHighPolyFileList}
															action={uploadModelHighPolySouceEndpoint}
															onRemove={(): false => false}
															onChange={(info): Promise<void> => handleOnFileUploadChange("sourceHighPoly", info)}
															headers={{ Authorization: getCookie(null, cookieNames.authToken) }}
															accept='.blend'
														>
															<Button>
																<UploadOutlined />
																Click to Upload
															</Button>
														</Upload>
													</Col>
												</Row>
												<Row gutter={[0, 12]}>
													<Col span={24}>
														<Text strong>Upload Product Image</Text>
													</Col>
													<Col span={24}>
														<Upload
															supportServerRender
															name='files'
															fileList={imageFile}
															listType='picture-card'
															onPreview={handlePreview}
															multiple
															onRemove={handleProductImageDelete}
															beforeUpload={handleBeforeProductImageUpload}
															accept='image/*'
														>
															<Row>
																<Col span={24}>
																	<PlusOutlined />
																</Col>
																<Col span={24}>Click to Select Images</Col>
															</Row>
														</Upload>
													</Col>
													<Col>
														<Button onClick={handleProductImageUpload} disabled={!imageFilesToUpload.length}>
															Upload Images
														</Button>
													</Col>
												</Row>
											</Col>
										</Row>
									</Collapse.Panel>
								</Collapse>
								<Divider />
								<Row justify='end'>
									<Col>
										<Button htmlType='submit' type='primary'>
											Save
										</Button>
									</Col>
								</Row>
							</Form>
						</Space>
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

AssetDetailPage.getInitialProps = async (ctx: NextPageContext) => {
	const { req, query } = ctx;

	const assetId = query.assetId as string;
	const mai = query.mai as string;
	const designId = query.did as string;
	const retailLink = query.rlink as string;
	const entry = query.entry as string;

	return {
		isServer: !!req,
		authVerification: { name: "", email: "" },
		assetId,
		mai,
		designId,
		retailLink,
		entry,
	};
};

export default withAuthVerification(AssetDetailPage);
