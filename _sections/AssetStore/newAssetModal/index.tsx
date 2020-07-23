import {
	CheckCircleTwoTone,
	CloseCircleTwoTone,
	LinkOutlined,
	LoadingOutlined,
	PlusOutlined,
	UploadOutlined,
} from "@ant-design/icons";
import { assetCreateOrUpdationApi, uploadProductImagesApi } from "@api/assetApi";
import { uploadAssetModelApi } from "@api/designApi";
import ImageDisplayModal from "@components/ImageDisplayModal";
import { Currency, MountTypes, MountTypesLabels } from "@customTypes/assetInfoTypes";
import { Model3DFiles, ModelToExtensionMap } from "@customTypes/dashboardTypes";
import { AssetType, MetaDataType, ModeOfOperation } from "@customTypes/moodboardTypes";
import { AssetStatus, Status } from "@customTypes/userType";
import { SilentDivider } from "@sections/Dashboard/styled";
import { convertToFeet, convertToInches, getBase64, getValueSafely } from "@utils/commonUtils";
import { cloudinary, cookieNames } from "@utils/config";
import { MountAndClampValuesForVerticals } from "@utils/constants";
import fetcher from "@utils/fetcher";
import getCookie from "@utils/getCookie";
import { Button, Col, Input, notification, Radio, Row, Select, Switch, Tooltip, Typography, Upload } from "antd";
import { RcFile, UploadChangeParam, UploadFile } from "antd/lib/upload/interface";
import React, { useEffect, useMemo, useRef, useState } from "react";
import AddRetailerModal from "../addRetailerModal";
import { AssetAction } from "../reducer";
import { SizeAdjustedModal } from "../styled";
import { NewAssetUploadState } from "./reducer";

const { Text, Title } = Typography;
const { Option } = Select;

interface CategoryMap {
	key: string;
	title: {
		name: string;
		level: string;
	};
	children?: CategoryMap[];
}

interface NewAssetModal {
	isOpen: boolean;
	toggleNewAssetModal: () => void;
	categoryMap: CategoryMap[];
	metadata: MetaDataType;
	assetData?: Partial<AssetType>;
	dispatchAssetStore?: React.Dispatch<AssetAction>;
	setAssetData?: React.Dispatch<React.SetStateAction<AssetType>>;
	onOkComplete?: (data: Partial<AssetType>, missingAssetId?: string, status?: Status) => Promise<void>;
	location?: "MISSING_ASSETS";
}

const formatDimensionsForSending: (
	dimensions: { "dimension.width": number; "dimension.height": number; "dimension.depth": number },
	dimensionInInches: boolean
) => { "dimension.width"?: number; "dimension.height"?: number; "dimension.depth"?: number } = (
	dimensions,
	dimensionInInches
) => {
	if (dimensions) {
		if (dimensionInInches) {
			return {
				...(dimensions["dimension.height"]
					? { "dimension.height": convertToFeet(dimensions["dimension.height"]) }
					: {}),
				...(dimensions["dimension.width"] ? { "dimension.width": convertToFeet(dimensions["dimension.width"]) } : {}),
				...(dimensions["dimension.depth"] ? { "dimension.depth": convertToFeet(dimensions["dimension.depth"]) } : {}),
			};
		}

		return { ...dimensions };
	}
	return {};
};

const formatResponseOnRecieve: (
	dimensions: { width: number; height: number; depth: number },
	dimensionInInches: boolean
) => { width: number; height: number; depth: number } = (dimensions, dimensionInInches) => {
	if (dimensionInInches) {
		return {
			height: convertToInches(dimensions.height),
			width: convertToInches(dimensions.width),
			depth: convertToInches(dimensions.depth),
		};
	}
	return { ...dimensions };
};

const NewAssetModal: React.FC<NewAssetModal> = ({
	isOpen,
	toggleNewAssetModal,
	categoryMap,
	metadata,
	assetData,
	dispatchAssetStore,
	onOkComplete,
	setAssetData,
	location,
}) => {
	const [state, setState] = useState<Partial<NewAssetUploadState>>({});
	const [changedState, setChangedState] = useState<Record<string, any>>({});
	const [firstLoad, setFirstLoad] = useState<boolean>(true);
	const [model3dFiles, setModel3dFiles] = useState<Model3DFiles>(Model3DFiles.Glb);
	const [assetFile, setAssetFile] = useState<UploadFile<any>[]>([]);
	const [imageFile, setImageFile] = useState<UploadFile<any>[]>([]);
	const [imageFilesToUpload, setImageFilesToUpload] = useState([]);

	const [dimensionInInches, setDimensionInInches] = useState<boolean>(true);
	const [addRetailerModalVisible, setAddRetailerModalVisible] = useState(false);
	const [sourceFileList, setSourceFileList] = useState<UploadFile<any>[]>([]);
	const [sourceHighPolyFileList, setSourceHighPolyFileList] = useState<UploadFile<any>[]>([]);
	const [immediateUpdate, setImmediateUpdate] = useState<boolean>(false);

	const themes = useMemo(() => getValueSafely(() => metadata.themes.list, []), [metadata]);
	const retailers = useMemo(() => getValueSafely(() => metadata.retailers.list, []), [metadata]);

	const uploadModelEndpoint = useMemo(() => uploadAssetModelApi(state._id, model3dFiles), [state._id, model3dFiles]);
	const uploadModelSourceEndpoint = useMemo(() => uploadAssetModelApi(state._id, "source"), [state._id]);
	const uploadAssetImageEndpoint = useMemo(() => uploadProductImagesApi(state._id), [state._id]);
	const uploadModelHighPolySouceEndpoint = useMemo(() => uploadAssetModelApi(state._id, "sourceHighPoly"), [state._id]);

	const [preview, setPreview] = useState<{ previewImage: string; previewVisible: boolean }>({
		previewImage: "",
		previewVisible: false,
	});

	const assetName = useRef(null);
	const assetDescription = useRef(null);
	const assetPrice = useRef(null);
	const assetRetailer = useRef(null);
	const assetUrl = useRef(null);
	const assetCategory = useRef(null);
	const assetSubCategory = useRef(null);
	const assetVertical = useRef(null);
	const assetTheme = useRef(null);
	const assetWidth = useRef(null);
	const assetHeight = useRef(null);
	const assetDepth = useRef(null);
	const assetMountType = useRef(null);

	const [assetNameValid, setAssetNameValid] = useState<boolean>(false);
	const [assetPriceValid, setAssetPriceValid] = useState<boolean>(false);
	const [assetRetailerValid, setAssetRetailerValid] = useState<boolean>(false);
	const [assetUrlValid, setAssetUrlValid] = useState<boolean>(false);
	const [assetCategoryValid, setAssetCategoryValid] = useState<boolean>(false);
	const [assetSubCategoryValid, setAssetSubCategoryValid] = useState<boolean>(false);
	const [assetVerticalValid, setAssetVerticalValid] = useState<boolean>(false);
	const [assetWidthValid, setAssetWidthValid] = useState<boolean>(false);
	const [assetHeightValid, setAssetHeightValid] = useState<boolean>(false);
	const [assetDepthValid, setAssetDepthValid] = useState<boolean>(false);
	const [assetMountTypeValid, setAssetMountTypeValid] = useState<boolean>(false);
	const [modifiedForm, setModifiedForm] = useState<boolean>(false);

	const checkValidity = (): void => {
		setAssetNameValid(!!assetName.current?.props?.value);
		setAssetPriceValid(!!assetPrice.current?.input?.checkValidity());
		setAssetRetailerValid(!!assetRetailer.current?.props.value);
		setAssetUrlValid(assetUrl.current?.input.checkValidity());
		setAssetCategoryValid(!!assetCategory.current?.props.value);
		setAssetSubCategoryValid(!!assetSubCategory.current?.props.value);
		setAssetVerticalValid(!!assetVertical.current?.props.value);
		setAssetWidthValid(
			parseFloat(assetWidth.current?.props.value) !== 0 && !Number.isNaN(parseFloat(assetWidth.current?.props.value))
		);
		setAssetHeightValid(
			parseFloat(assetHeight.current?.props.value) !== 0 && !Number.isNaN(parseFloat(assetWidth.current?.props.value))
		);
		setAssetDepthValid(
			parseFloat(assetDepth.current?.props.value) !== 0 && !Number.isNaN(parseFloat(assetWidth.current?.props.value))
		);
		setAssetMountTypeValid(!!assetMountType.current?.props.value);
	};
	useEffect(() => {
		checkValidity();
	}, [changedState, modifiedForm]);
	const onSwitchChange = (checked: boolean): void => {
		setDimensionInInches(!dimensionInInches);
		if (checked) {
			setState({
				...state,
				dimension: {
					height: convertToInches(state.dimension.height),
					width: convertToInches(state.dimension.width),
					depth: convertToInches(state.dimension.depth),
				},
			});
		} else {
			setState({
				...state,
				dimension: {
					height: convertToFeet(state.dimension.height),
					width: convertToFeet(state.dimension.width),
					depth: convertToFeet(state.dimension.depth),
				},
			});
		}
	};

	const openInNewWindow = (): void => {
		if (state.retailLink && assetUrl.current.input.checkValidity()) {
			window.open(state.retailLink, "_blank", "noopener");
		}
	};

	useEffect(() => {
		if (assetData) {
			const newState = {
				...assetData,
				retailer: getValueSafely(() => assetData.retailer._id, ""),
				spatialData: {
					mountType: getValueSafely(() => assetData.spatialData.mountType, MountTypes.attached),
					clampValue: getValueSafely(() => {
						return assetData.spatialData.clampValue !== -1;
					}, false),
					fileUrls: {
						glb: getValueSafely(() => assetData.spatialData.fileUrls.glb, ""),
						source: getValueSafely(() => assetData.spatialData.fileUrls.source, ""),
						legacy_obj: getValueSafely(() => assetData.spatialData.fileUrls.legacy_obj, ""),
						sourceHighPoly: getValueSafely(() => assetData.spatialData.fileUrls.sourceHighPoly, ""),
					},
				},
				currency: assetData.currency || Currency.USD,
				dimension: {
					width: getValueSafely(() => convertToInches(assetData.dimension.width), 0),
					depth: getValueSafely(() => convertToInches(assetData.dimension.depth), 0),
					height: getValueSafely(() => convertToInches(assetData.dimension.height), 0),
				},
			};
			setState({ ...newState });
			setAssetData(null);
		}
	}, [assetData]);

	const handleChange = (e): void => {
		const {
			target: { name, value },
		} = e;

		if (name.split(".").length === 2) {
			const nameSplit = name.split(".");
			setState({
				...state,
				[nameSplit[0]]: {
					...state[nameSplit[0]],
					[nameSplit[1]]: value,
				},
			});
		} else {
			setState({
				...state,
				[name]: value,
			});
		}
		setChangedState({ ...changedState, [name]: value });
		setModifiedForm(true);
	};

	const handleSelect = (value, name): void => {
		if (name.split(".").length === 2) {
			const nameSplit = name.split(".");
			setState({
				...state,
				[nameSplit[0]]: {
					...state[nameSplit[0]],
					[nameSplit[1]]: value,
				},
			});
		} else {
			setState({
				...state,
				[name]: value,
			});
		}
		setModifiedForm(true);
	};

	const onSelect = (selectedValue): void => {
		setModel3dFiles(selectedValue as Model3DFiles);
	};

	const saveAsset = async (): Promise<number> => {
		const endPoint = assetCreateOrUpdationApi(state._id);

		const dimensionsToSend = formatDimensionsForSending(
			{
				"dimension.width": changedState["dimension.width"],
				"dimension.depth": changedState["dimension.depth"],
				"dimension.height": changedState["dimension.height"],
			},
			dimensionInInches
		);

		const requestBody = {
			...changedState,
			...dimensionsToSend,
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
				if (dimensionInInches) {
					responseAssetData.dimension = formatResponseOnRecieve(responseAssetData.dimension, dimensionInInches);
				}
				if (onOkComplete && !state._id) {
					onOkComplete({ _id: responseAssetData._id }, null, responseAssetData.status);
				}
				setState({ ...responseAssetData });
				setChangedState({});
				setModifiedForm(false);
			}
			return 1;
		} catch (e) {
			if (e.message === "Failed to fetch") {
				notification.error({ message: "Failed to save Product. Please check your internet connection and Retry" });
			} else {
				notification.error({ message: "Failed to save Product" });
			}
		}
		return 0;
	};

	useEffect(() => {
		if (state) {
			if (state.productImages) {
				setImageFile(
					state.productImages.map((image, index) => {
						return {
							uid: index.toString(),
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
	}, [assetData]);

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

	useEffect(() => {
		return (): void => {
			setState({});
			setModel3dFiles(Model3DFiles.Glb);
			setAssetFile(null);
			setImageFile(null);
			setSourceFileList(null);
			setAssetNameValid(false);
			setAssetPriceValid(false);
			setAssetRetailerValid(false);
			setAssetUrlValid(false);
			setDimensionInInches(true);
			setAssetCategoryValid(false);
			setAssetSubCategoryValid(false);
			setAssetVerticalValid(false);
			setAssetWidthValid(false);
			setAssetHeightValid(false);
			setAssetDepthValid(false);
			setAssetMountTypeValid(false);
			setChangedState({});
			setModifiedForm(false);
			setFirstLoad(true);
			setSourceHighPolyFileList(null);
		};
	}, [isOpen]);

	useEffect(() => {
		if (state.meta?.vertical && !firstLoad) {
			const mountAndClampValue = MountAndClampValuesForVerticals[state.meta.vertical];
			if (mountAndClampValue) {
				if (mountAndClampValue.clampValue >= 0) {
					setState({ ...state, spatialData: { ...state.spatialData, clampValue: true } });
				} else {
					setState({ ...state, spatialData: { ...state.spatialData, clampValue: false } });
				}
				setState({ ...state, spatialData: { ...state.spatialData, mountType: mountAndClampValue.mountValue } });
			} else {
				setState({ ...state, spatialData: { ...state.spatialData, clampValue: false } });
			}
			notification.info({ message: "Mount type has changed since the vertical was changed" });
		}
		setFirstLoad(false);
	}, [state.meta?.vertical]);

	useEffect(() => {
		if ((state.price === 0 || Number.isNaN(state.price)) && !assetData) {
			if (state.shoppable !== false) {
				setState({ ...state, shoppable: false });
				notification.info({ message: "Item has been marked as not shoppable" });
			}
		}
		setFirstLoad(false);
	}, [state.price]);

	const updateStatus = async (): Promise<void> => {
		notification.open({
			key: "saveStatus",
			message: "Updating Asset",
			icon: <LoadingOutlined />,
			description: "Trying to set asset as Active since 3D Model has been uploaded",
		});

		const saveStatus = await saveAsset();
		if (saveStatus === 1) {
			notification.open({
				key: "saveStatus",
				message: "Successful",
				icon: <CheckCircleTwoTone twoToneColor='#52c41a' />,
				description: "Status is successfully updated",
			});
		} else {
			notification.open({
				key: "saveStatus",
				message: "Error",
				icon: <CloseCircleTwoTone twoToneColor='#f5222d' />,
				description: "Please try saving asset manually",
			});
		}
	};

	useEffect(() => {
		if (state.status === Status.active && immediateUpdate) {
			updateStatus();
		}
	}, [state.status, immediateUpdate]);

	useEffect(() => {
		if (state.retailer) {
			const spacejoyRetailer = retailers.find(retailer => {
				return retailer.name.toLowerCase() === "spacejoy";
			});
			if (spacejoyRetailer) {
				if (spacejoyRetailer._id === state.retailer) {
					setState({ ...state, retailLink: "http://www.spacejoy.com" });
				}
			}
		}
	}, [state.retailer]);

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

	const handleCancel = (): void => setPreview({ previewImage: "", previewVisible: false });

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
					setImmediateUpdate(true);
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

	const submitButtonDisabled = !(
		assetNameValid &&
		assetUrlValid &&
		assetCategoryValid &&
		assetSubCategoryValid &&
		assetVerticalValid &&
		((assetPriceValid &&
			assetRetailerValid &&
			assetWidthValid &&
			assetHeightValid &&
			assetDepthValid &&
			assetMountTypeValid) ||
			location === "MISSING_ASSETS" ||
			!!assetData)
	);

	const dimensionText = useMemo(() => {
		if (dimensionInInches) {
			return "Inch";
		}
		return "Foot";
	}, [dimensionInInches]);

	const toggleAddRetailerModal = (): void => {
		setAddRetailerModalVisible(prevState => !prevState);
	};

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

	const handleBeforeProductImageUpload = (file): boolean => {
		setImageFile(prevFileList => [...prevFileList, file]);
		setImageFilesToUpload(prevFileList => [...prevFileList, file]);
		return false;
	};

	const handleProductImageUpload = async (): Promise<void> => {
		const endPoint = uploadAssetImageEndpoint;
		const key = "notify";
		const formData = new FormData();
		imageFilesToUpload.forEach(file => {
			formData.append("files", file, file.fileName);
		});
		notification.info({ message: "Uploading Product images", key });

		try {
			const response = await fetcher({
				isMultipartForm: true,
				endPoint,
				method: "POST",
				body: formData,
			});
			if (response.statusCode <= 300) {
				const productImageFileList = response.data.productImages.map((image, index) => {
					return {
						uid: index.toString(),
						name: image.cdn.split("/").pop(),
						status: "done",
						url: `${cloudinary.baseDeliveryURL}/image/upload/${image.cdn}`,
						size: 0,
						type: "application/octet-stream",
					};
				});
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

	return (
		<SizeAdjustedModal
			destroyOnClose
			style={{ top: "2rem" }}
			onCancel={toggleNewAssetModal}
			visible={isOpen}
			title={state._id ? "Update Product" : "Create New Product"}
			footer={null}
		>
			<Row gutter={[12, 12]}>
				<Col lg={12}>
					<Col span={24}>
						<Title level={4}>Product Info</Title>
					</Col>
					<Col span={24}>
						<SilentDivider />
					</Col>
					<Col span={24}>
						<Row gutter={[0, 4]}>
							<Col span={24}>
								<Text>Product Name</Text>
							</Col>
							<Col span={24}>
								<Input
									ref={assetName}
									required
									onChange={handleChange}
									name='name'
									value={state.name}
									placeholder='Product Name'
								/>
							</Col>
						</Row>
					</Col>
					<Col span={24}>
						<Row gutter={[0, 4]}>
							<Col span={24}>
								<Text>Description</Text>
							</Col>
							<Col span={24}>
								<Input.TextArea
									ref={assetDescription}
									required
									onChange={handleChange}
									name='description'
									value={state.description}
									placeholder='Description'
								/>
							</Col>
						</Row>
					</Col>
					<Col span={24}>
						<Row gutter={[8, 8]}>
							<Col span={12}>
								<Row gutter={[0, 4]}>
									<Col span={24}>
										<Text>Price (USD)</Text>
									</Col>
									<Col span={24}>
										<Input
											ref={assetPrice}
											required
											type='number'
											placeholder='Price'
											onChange={handleChange}
											name='price'
											value={state.price}
										/>
									</Col>
								</Row>
							</Col>
							<Col span={12}>
								<Row gutter={[0, 4]}>
									<Col span={24}>
										<Text>Retailer</Text>
									</Col>
									<Col span={24}>
										<Select
											placeholder='Select Retailer'
											ref={assetRetailer}
											onChange={(value): void => handleSelect(value, "retailer")}
											value={state.retailer}
											dropdownRender={(menu): JSX.Element => (
												<Row gutter={[0, 4]}>
													<Col span={24}>{menu}</Col>
													<Col span={24}>
														<SilentDivider />
													</Col>
													<Col span={24}>
														<Button
															onMouseDown={(e): void => e.preventDefault()}
															onClick={toggleAddRetailerModal}
															block
															type='link'
															size='large'
															icon={<PlusOutlined />}
														>
															Add Retailer
														</Button>
													</Col>
												</Row>
											)}
											showSearch
											optionFilterProp='children'
											style={{ width: "100%" }}
										>
											{retailers.map(retailer => (
												<Option key={retailer._id} value={retailer._id}>
													{retailer.name}
												</Option>
											))}
										</Select>
									</Col>
								</Row>
							</Col>
							<Col span={24}>
								<Input
									ref={assetUrl}
									required
									onChange={handleChange}
									value={state.retailLink}
									type='url'
									addonAfter={
										<Tooltip placement='top' title='Open URL'>
											<LinkOutlined onClick={openInNewWindow} />
										</Tooltip>
									}
									placeholder='Link to product'
									name='retailLink'
								/>
							</Col>
						</Row>
					</Col>
					<Col span={24}>
						<Row gutter={[4, 4]}>
							<Col span={8}>
								<Row gutter={[4, 4]}>
									<Col span={24}>Category</Col>
									<Col span={24}>
										<Select
											ref={assetCategory}
											onChange={(value): void => handleSelect(value, "meta.category")}
											value={state.meta?.category}
											showSearch
											optionFilterProp='children'
											placeholder='Select A Category'
											style={{ width: "100%" }}
										>
											{categoryMap.map(category => (
												<Option key={category.key} value={category.key}>
													{category.title.name}
												</Option>
											))}
										</Select>
									</Col>
								</Row>
							</Col>
							<Col span={8}>
								<Row gutter={[4, 4]}>
									<Col span={24}>Sub Category</Col>
									<Col span={24}>
										<Select
											ref={assetSubCategory}
											onChange={(value): void => handleSelect(value, "meta.subcategory")}
											disabled={!state.meta?.category}
											value={state.meta?.subcategory}
											showSearch
											optionFilterProp='children'
											placeholder='Select A Sub Category'
											style={{ width: "100%" }}
										>
											{!!state.meta?.category &&
												categoryMap
													.find(category => {
														return category.key === state.meta?.category;
													})
													?.children?.map(category => (
														<Option key={category.key} value={category.key}>
															{category.title.name}
														</Option>
													))}
										</Select>
									</Col>
								</Row>
							</Col>
							<Col span={8}>
								<Row gutter={[4, 4]}>
									<Col span={24}>Vertical</Col>
									<Col span={24}>
										<Select
											ref={assetVertical}
											onChange={(value): void => handleSelect(value, "meta.vertical")}
											disabled={!state.meta?.subcategory}
											value={state.meta?.vertical}
											showSearch
											optionFilterProp='children'
											placeholder='Select A Vertical'
											style={{ width: "100%" }}
										>
											{!!state.meta?.subcategory &&
												categoryMap
													.find(category => category.key === state.meta?.category)
													.children.find(subCategory => subCategory.key === state.meta?.subcategory)
													.children.map(category => (
														<Option key={category.key} value={category.key}>
															{category.title.name}
														</Option>
													))}
										</Select>
									</Col>
								</Row>
							</Col>
						</Row>
					</Col>
					<Col span={24}>
						<Row gutter={[8, 0]}>
							<Col span={12}>
								<Row gutter={[4, 4]}>
									<Col span={24}>
										<Text>Theme</Text>
									</Col>
									<Col span={24}>
										<Select
											ref={assetTheme}
											onChange={(value): void => handleSelect(value, "meta.theme")}
											value={state.meta?.theme}
											showSearch
											optionFilterProp='children'
											placeholder='Select a Theme'
											style={{ width: "100%" }}
										>
											{themes.map(theme => (
												<Option value={theme._id} key={theme._id}>
													{theme.name}
												</Option>
											))}
										</Select>
									</Col>
								</Row>
							</Col>
							<Col span={12}>
								<Row gutter={[4, 4]}>
									<Col span={24}>
										<Text>Status</Text>
									</Col>
									<Col span={24}>
										<Select
											onChange={(value): void => handleSelect(value, "status")}
											value={state.status}
											showSearch
											optionFilterProp='children'
											placeholder='Select a Status'
											style={{ width: "100%" }}
										>
											{Object.keys(AssetStatus).map(key => (
												<Option value={AssetStatus[key]} key={key}>
													{key}
												</Option>
											))}
										</Select>
									</Col>
								</Row>
							</Col>
						</Row>
					</Col>
					<Col span={24}>
						<Row gutter={[4, 8]}>
							<Col span={12}>
								<Row>
									<Col span={24}>
										<Row>
											<Col span={24}>Is the Item Shoppable?</Col>
										</Row>
									</Col>
									<Col span={24}>
										<Radio.Group onChange={handleChange} value={state.shoppable} name='shoppable'>
											<Radio value>Yes</Radio>
											<Radio value={false}>No</Radio>
										</Radio.Group>
									</Col>
								</Row>
							</Col>
							<Col span={12}>
								<Row gutter={[4, 4]}>
									<Col span={24}>
										<Text>Tags</Text>
									</Col>
									<Col span={24}>
										<Select
											mode='tags'
											tokenSeparators={[",", " "]}
											open={false}
											onChange={(value): void => handleSelect(value, "tags")}
											value={state.tags}
											placeholder='Tag products'
											style={{ width: "100%" }}
										/>
									</Col>
								</Row>
							</Col>
						</Row>
					</Col>
				</Col>
				<Col lg={12}>
					<Col span={24}>
						<Title level={4}>3D Properties</Title>
					</Col>
					<Col span={24}>
						<SilentDivider />
					</Col>
					<Col span={24}>
						<Row gutter={[4, 4]}>
							<Col span={24}>Dimensions in Inches?</Col>
							<Col span={24}>
								<Switch
									onChange={onSwitchChange}
									checked={dimensionInInches}
									checkedChildren='Yes'
									unCheckedChildren='No'
								/>
							</Col>
						</Row>
					</Col>
					<Col span={24}>
						<Row gutter={[4, 4]}>
							<Col span={8}>
								<Row gutter={[4, 4]}>
									<Col span={24}>Width({dimensionText})</Col>
									<Col span={24}>
										<Input
											ref={assetWidth}
											required
											onChange={handleChange}
											value={state.dimension?.width}
											name='dimension.width'
											placeholder={`Width(${dimensionText})`}
											type='number'
										/>
									</Col>
								</Row>
							</Col>
							<Col span={8}>
								<Row gutter={[4, 4]}>
									<Col span={24}>Height({dimensionText})</Col>
									<Col span={24}>
										<Input
											ref={assetHeight}
											required
											onChange={handleChange}
											value={state.dimension?.height}
											name='dimension.height'
											placeholder={`Height(${dimensionText})`}
											type='number'
										/>
									</Col>
								</Row>
							</Col>
							<Col span={8}>
								<Row gutter={[4, 4]}>
									<Col span={24}>Depth({dimensionText})</Col>
									<Col span={24}>
										<Input
											ref={assetDepth}
											required
											onChange={handleChange}
											value={state.dimension?.depth}
											name='dimension.depth'
											placeholder={`Depth(${dimensionText})`}
											type='number'
										/>
									</Col>
								</Row>
							</Col>
						</Row>
					</Col>
					<Col span={24}>
						<Row gutter={[8, 0]}>
							<Col span={12}>
								<Row gutter={[4, 4]}>
									<Col span={24}>
										<Text>Mount Type</Text>
									</Col>
									<Col span={24}>
										<Select
											ref={assetMountType}
											showSearch
											optionFilterProp='children'
											onChange={(value): void => handleSelect(value, "spatialData.mountType")}
											value={state.spatialData?.mountType}
											placeholder='Select a Mount Type'
											style={{ width: "100%" }}
										>
											{Object.keys(MountTypes).map(key => (
												<Option key={key} value={key}>
													{MountTypesLabels[key]}
												</Option>
											))}
										</Select>
									</Col>
								</Row>
							</Col>
						</Row>
					</Col>

					<Col span={24}>
						<Row gutter={[4, 4]}>
							<Col span={12}>
								<Row>
									<Col span={24}>Interacts with other Objects?</Col>
									<Col span={24}>
										<small>e.g. Rugs do not interact with other objects</small>
									</Col>
								</Row>
							</Col>
							<Col span={12}>
								<Radio.Group
									onChange={handleChange}
									value={state.spatialData?.clampValue}
									name='spatialData.clampValue'
								>
									<Radio value>Yes</Radio>
									<Radio value={false}>No</Radio>
								</Radio.Group>
							</Col>
						</Row>
					</Col>
					{!!state._id && (
						<Col lg={24}>
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
									<Col lg={8}>
										<Row gutter={[8, 8]}>
											<Col span={8}>Type</Col>
											<Col span={16}>
												<Select style={{ width: "100%" }} value={model3dFiles} onSelect={onSelect}>
													{Object.keys(Model3DFiles).map(key => {
														return (
															<Option key={key} value={Model3DFiles[key]}>
																{key}
															</Option>
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
						</Col>
					)}
				</Col>
				<Col span={24}>
					<Row gutter={[8, 8]}>
						<Col span={24}>
							<Title level={4}>Additional Details (For E-commerce)</Title>
						</Col>
						<Col span={8}>
							<Row gutter={[0, 4]}>
								<Col span={24}>
									<Text>Estimated Arrival</Text>
								</Col>
								<Col span={24}>
									<Input
										required
										onChange={handleChange}
										name='estimatedArrival'
										value={state.estimatedArrival}
										placeholder='Estimated Arrival'
									/>
								</Col>
							</Row>
						</Col>
						<Col span={8}>
							<Row gutter={[0, 4]}>
								<Col span={24}>
									<Text>Estimated Dispatch</Text>
								</Col>
								<Col span={24}>
									<Input
										required
										onChange={handleChange}
										name='estimatedDispatch'
										value={state.estimatedDispatch}
										placeholder='Estimated Dispatch'
									/>
								</Col>
							</Row>
						</Col>
						<Col span={8}>
							<Row gutter={[0, 4]}>
								<Col span={24}>
									<Text>Country of Origin</Text>
								</Col>
								<Col span={24}>
									<Input
										required
										onChange={handleChange}
										name='countryOfOrigin'
										value={state.countryOfOrigin}
										placeholder='Country of Origin'
									/>
								</Col>
							</Row>
						</Col>
						<Col span={8}>
							<Row gutter={[0, 4]}>
								<Col span={24}>
									<Text>Stock Quantity</Text>
								</Col>
								<Col span={24}>
									<Input
										required
										onChange={handleChange}
										name='stockQty'
										value={state.stockQty}
										placeholder='Stock Quantity'
									/>
								</Col>
							</Row>
						</Col>
						<Col span={8}>
							<Row gutter={[0, 4]}>
								<Col span={24}>
									<Text>Mode of Operation</Text>
								</Col>
								<Col span={24}>
									<Select style={{ width: "100%" }}>
										{Object.entries(ModeOfOperation).map(([label, value]) => {
											return (
												<Select.Option key={value} value={value}>
													{label}
												</Select.Option>
											);
										})}
									</Select>
								</Col>
							</Row>
						</Col>
						<Col span={8}>
							<Row>
								<Col span={24}>
									<Row>
										<Col span={24}>Flat Shopping</Col>
									</Row>
								</Col>
								<Col span={24}>
									<Input
										required
										onChange={handleChange}
										name='flatShipping'
										value={state.flatShipping}
										placeholder='Stock Quantity'
									/>
								</Col>
							</Row>
						</Col>
						<Col span={24}>
							<Row>
								<Col span={24}>
									<Title level={4}>Policies</Title>
								</Col>

								<Col>
									<small>Retailer links are preferred for all the fields below</small>
								</Col>
							</Row>
						</Col>

						<Col span={24}>
							<Row gutter={[0, 4]}>
								<Col span={24}>
									<Text>Shipping Policy</Text>
								</Col>
								<Col span={24}>
									<Input.TextArea
										required
										onChange={handleChange}
										name='shippingPolicy'
										value={state.shippingPolicy}
										placeholder='Shipping Policy'
									/>
								</Col>
							</Row>
						</Col>
						<Col span={24}>
							<Row gutter={[0, 4]}>
								<Col span={24}>
									<Text>Cancellation Policy</Text>
								</Col>
								<Col span={24}>
									<Input.TextArea
										required
										onChange={handleChange}
										name='cancellationPolicy'
										value={state.cancellationPolicy}
										placeholder='Cancellation Policy'
									/>
								</Col>
							</Row>
						</Col>
						<Col span={24}>
							<Row gutter={[0, 4]}>
								<Col span={24}>
									<Text>Warranty Info</Text>
								</Col>
								<Col span={24}>
									<Input.TextArea
										required
										onChange={handleChange}
										name='warrantyInfo'
										value={state.warrantyInfo}
										placeholder='Warranty Info'
									/>
								</Col>
							</Row>
						</Col>
						<Col span={24}>
							<Row gutter={[0, 4]}>
								<Col span={24}>
									<Text>Assembly Info</Text>
								</Col>
								<Col span={24}>
									<Input.TextArea
										required
										onChange={handleChange}
										name='assemblyInfo'
										value={state.assemblyInfo}
										placeholder='Assembly Info'
									/>
								</Col>
							</Row>
						</Col>
						<Col span={24}>
							<Row gutter={[0, 4]}>
								<Col span={24}>
									<Text>Return Policy</Text>
								</Col>
								<Col span={24}>
									<Input.TextArea
										required
										onChange={handleChange}
										name='returnPolicy'
										value={state.returnPolicy}
										placeholder='Return Policy'
									/>
								</Col>
							</Row>
						</Col>
						<Col span={24}>
							<Row gutter={[0, 4]}>
								<Col span={24}>
									<Text>Refund Policy</Text>
								</Col>
								<Col span={24}>
									<Input.TextArea
										required
										onChange={handleChange}
										name='refundPolicy'
										value={state.refundPolicy}
										placeholder='Refund Policy'
									/>
								</Col>
							</Row>
						</Col>
					</Row>
				</Col>

				<Col span={24}>
					<Row gutter={[8, 0]} justify='end'>
						<Col>
							<Button onClick={toggleNewAssetModal}>Cancel</Button>
						</Col>
						<Col>
							<Button
								disabled={submitButtonDisabled || !modifiedForm}
								type='primary'
								onClick={(): void => {
									saveAsset();
								}}
							>
								Save Product
							</Button>
						</Col>
					</Row>
				</Col>
			</Row>
			<ImageDisplayModal
				handleCancel={handleCancel}
				previewImage={preview.previewImage}
				previewVisible={preview.previewVisible}
				altText='previewImages'
			/>
			<AddRetailerModal
				metadata={metadata}
				toggleAddRetailerModal={toggleAddRetailerModal}
				dispatch={dispatchAssetStore}
				addRetailerModalVisible={addRetailerModalVisible}
			/>
		</SizeAdjustedModal>
	);
};

export default NewAssetModal;
