import { assetCreateOrUpdationApi } from "@api/assetApi";
import { uploadAssetImageApi, uploadAssetModelApi } from "@api/designApi";
import ImageDisplayModal from "@components/ImageDisplayModal";
import { Currency, MountTypes, MountTypesLabels } from "@customTypes/assetInfoTypes";
import { Model3DFiles, ModelToExtensionMap } from "@customTypes/dashboardTypes";
import { AssetType, MetaDataType } from "@customTypes/moodboardTypes";
import { AssetStatus, Status } from "@customTypes/userType";
import { SilentDivider } from "@sections/Dashboard/styled";
import { convertToFeet, convertToInches, debounce, getBase64, getValueSafely } from "@utils/commonUtils";
import { cloudinary, cookieNames } from "@utils/config";
import fetcher from "@utils/fetcher";
import getCookie from "@utils/getCookie";
import { Button, Col, Icon, Input, notification, Radio, Row, Select, Switch, Tooltip, Typography, Upload } from "antd";
import { UploadChangeParam, UploadFile, RcFile } from "antd/lib/upload/interface";
import React, { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { MountAndClampValuesForVerticals } from "@utils/constants";
import AddRetailerModal from "../addRetailerModal";
import { AssetAction } from "../reducer";
import { SizeAdjustedModal } from "../styled";
import { initialState, NewAssetUploadReducer, NewAssetUploadState, NEW_ASSET_ACTION_TYPES, reducer } from "./reducer";

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

interface RoomTypeMeta {
	_id: string;
	name: string;
	label: string;
}

const formatDimensionsForSending: (
	dimensions: { width: number; height: number; depth: number },
	dimensionInInches: boolean
) => { width: number; height: number; depth: number } = (dimensions, dimensionInInches) => {
	if (dimensionInInches) {
		return {
			height: convertToFeet(dimensions.height),
			width: convertToFeet(dimensions.width),
			depth: convertToFeet(dimensions.depth),
		};
	}
	return { ...dimensions };
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
	const [state, dispatch] = useReducer<NewAssetUploadReducer>(reducer, initialState);
	const [firstLoad, setFirstLoad] = useState<boolean>(true);
	const [model3dFiles, setModel3dFiles] = useState<Model3DFiles>(Model3DFiles.Glb);
	const [assetFile, setAssetFile] = useState<UploadFile<any>[]>([]);
	const [imageFile, setImageFile] = useState<UploadFile<any>[]>([]);
	const [dimensionInInches, setDimensionInInches] = useState<boolean>(true);
	const [addRetailerModalVisible, setAddRetailerModalVisible] = useState(false);
	const [sourceFileList, setSourceFileList] = useState<UploadFile<any>[]>([]);
	const [sourceHighPolyFileList, setSourceHighPolyFileList] = useState<UploadFile<any>[]>([]);

	const themes = useMemo(() => getValueSafely(() => metadata.themes.list, []), [metadata]);
	const retailers = useMemo(() => getValueSafely(() => metadata.retailers.list, []), [metadata]);

	const uploadModelEndpoint = useMemo(() => uploadAssetModelApi(state._id, model3dFiles), [state._id, model3dFiles]);
	const uploadModelSourceEndpoint = useMemo(() => uploadAssetModelApi(state._id, "source"), [state._id]);
	const uploadAssetImageEndpoint = useMemo(() => uploadAssetImageApi(state._id), [state._id]);
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
		setAssetNameValid(!!assetName.current.props.value);
		setAssetPriceValid(!!assetPrice.current.input.checkValidity());
		setAssetRetailerValid(!!assetRetailer.current.props.value);
		setAssetUrlValid(assetUrl.current.input.checkValidity());
		setAssetCategoryValid(!!assetCategory.current.props.value);
		setAssetSubCategoryValid(!!assetSubCategory.current.props.value);
		setAssetVerticalValid(!!assetVertical.current.props.value);
		setAssetWidthValid(
			parseFloat(assetWidth.current.props.value) !== 0 && !Number.isNaN(parseFloat(assetWidth.current.props.value))
		);
		setAssetHeightValid(
			parseFloat(assetHeight.current.props.value) !== 0 && !Number.isNaN(parseFloat(assetWidth.current.props.value))
		);
		setAssetDepthValid(
			parseFloat(assetDepth.current.props.value) !== 0 && !Number.isNaN(parseFloat(assetWidth.current.props.value))
		);
		setAssetMountTypeValid(!!assetMountType.current.props.value);
	};

	const onSwitchChange = (checked: boolean): void => {
		setDimensionInInches(!dimensionInInches);
		if (checked) {
			dispatch({
				type: NEW_ASSET_ACTION_TYPES.UPDATE_DIMENSION,
				value: {
					height: convertToInches(state.dimension.height),
					width: convertToInches(state.dimension.width),
					depth: convertToInches(state.dimension.depth),
				},
			});
		} else {
			dispatch({
				type: NEW_ASSET_ACTION_TYPES.UPDATE_DIMENSION,
				value: {
					height: convertToFeet(state.dimension.height),
					width: convertToFeet(state.dimension.width),
					depth: convertToFeet(state.dimension.depth),
				},
			});
		}
	};

	const debouncedCheckValidity = debounce(checkValidity, 50);

	const openInNewWindow = (): void => {
		if (state.retailLink && assetUrl.current.input.checkValidity()) {
			window.open(state.retailLink, "_blank", "noopener");
		}
	};

	useEffect(() => {
		if (assetData) {
			const newState = {
				_id: assetData._id,
				name: assetData.name,
				description: assetData.description,
				status: assetData.status,
				shoppable: assetData.shoppable || true,
				retailer: getValueSafely(() => assetData.retailer._id, ""),
				retailLink: assetData.retailLink,
				meta: {
					category: getValueSafely(() => assetData.meta.category, ""),
					subcategory: getValueSafely(() => assetData.meta.subcategory, ""),
					vertical: getValueSafely(() => assetData.meta.vertical, ""),
					theme: getValueSafely(() => assetData.meta.theme, ""),
				},
				primaryColor: "", // TO BE ADDED LATER
				secondaryColors: [], // TO BE ADDED LATER
				spatialData: {
					mountType: getValueSafely(() => assetData.spatialData.mountType, MountTypes.attached),
					clampValue: getValueSafely(() => (assetData.spatialData.clampValue === -1 ? -1 : 0), -1),
					fileUrls: {
						glb: getValueSafely(() => assetData.spatialData.fileUrls.glb, ""),
						source: getValueSafely(() => assetData.spatialData.fileUrls.source, ""),
						// eslint-disable-next-line @typescript-eslint/camelcase
						legacy_obj: getValueSafely(() => assetData.spatialData.fileUrls.legacy_obj, ""),
					},
				},
				price: assetData.price,
				currency: assetData.currency || "usd",
				dimension: {
					width: getValueSafely(() => convertToInches(assetData.dimension.width), 0),
					depth: getValueSafely(() => convertToInches(assetData.dimension.depth), 0),
					height: getValueSafely(() => convertToInches(assetData.dimension.height), 0),
				},
				imageUrl: assetData.imageUrl,
				cdn: assetData.cdn,
				tags: assetData.tags, // TO BE ADDED LATER
				artist: assetData.artist,
			};
			dispatch({ type: NEW_ASSET_ACTION_TYPES.SET_ASSET, value: newState });
			debouncedCheckValidity();
			setAssetData(null);
		}
	}, [assetData]);

	const handleChange = (e): void => {
		const {
			target: { name, value },
		} = e;

		dispatch({ type: name, value });
		setModifiedForm(true);
		debouncedCheckValidity();
	};

	const handleSelect = (value, action): void => {
		dispatch({ type: action, value });
		setModifiedForm(true);
		debouncedCheckValidity();
	};

	const onSelect = (selectedValue): void => {
		setModel3dFiles(selectedValue as Model3DFiles);
	};

	useEffect(() => {
		if (state) {
			if (state.cdn) {
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
			dispatch({ type: NEW_ASSET_ACTION_TYPES.CLEAR, value: null });
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
			setModifiedForm(false);
			setFirstLoad(true);
		};
	}, [isOpen]);

	useEffect(() => {
		if (state.meta.vertical && !firstLoad) {
			const mountAndClampValue = MountAndClampValuesForVerticals[state.meta.vertical];
			if (mountAndClampValue) {
				if (mountAndClampValue.clampValue >= 0) {
					dispatch({ type: NEW_ASSET_ACTION_TYPES.ASSET_CLAMP_VALUE, value: 0 });
				} else {
					dispatch({ type: NEW_ASSET_ACTION_TYPES.ASSET_CLAMP_VALUE, value: -1 });
				}
				dispatch({ type: NEW_ASSET_ACTION_TYPES.ASSET_MOUNT_TYPE, value: mountAndClampValue.mountValue });
			} else {
				dispatch({ type: NEW_ASSET_ACTION_TYPES.ASSET_CLAMP_VALUE, value: 0 });
			}
		}
		setFirstLoad(false);
	}, [state.meta.vertical]);

	const handleOnFileUploadChange = (
		uploadFileType: "model" | "source" | "image" | "sourceHighPoly",
		info: UploadChangeParam<UploadFile>
	): void => {
		let fileList = [...info.fileList];

		fileList = fileList.slice(-1);
		// 1. Limit the number of uploaded files
		// Only to show one recent uploaded files, and old ones will be replaced by the new
		if (info.file.status === "done") {
			notification.success({ message: "Product Saved", description: "File has been uploaded" });
			if (uploadFileType === "model") {
				dispatch({
					type: NEW_ASSET_ACTION_TYPES.SET_ASSET,
					value: { ...state, ...info.file.response.data },
				});
			} else if (uploadFileType === "source") {
				dispatch({ type: NEW_ASSET_ACTION_TYPES.SET_ASSET, value: { ...state, ...info.file.response.data } });
			} else if (uploadFileType === "image") {
				dispatch({ type: NEW_ASSET_ACTION_TYPES.SET_ASSET, value: { ...state, ...info.file.response.data } });
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

	const saveAsset = async (): Promise<void> => {
		const endPoint = assetCreateOrUpdationApi(state._id);

		const dimensionsToSend = formatDimensionsForSending(state.dimension, dimensionInInches);

		const requestBody = {
			name: state.name,
			description: state.description,
			status: state.status || Status.pending,
			shoppable: state.shoppable,
			retailer: state.retailer,
			retailLink: state.retailLink,
			primaryColor: state.primaryColor,
			secondaryColors: state.secondaryColors,
			"meta.category": state.meta.category,
			"meta.subcategory": state.meta.subcategory,
			"meta.vertical": state.meta.vertical,
			"meta.theme": state.meta.theme,
			"spatialData.mountType": state.spatialData.mountType,
			"spatialData.clampValue": state.spatialData.clampValue,
			"dimension.width": dimensionsToSend.width,
			"dimension.height": dimensionsToSend.height,
			"dimension.depth": dimensionsToSend.depth,
			price: state.price,
			currency: state.currency,
			imageUrl: state.imageUrl,
			cdn: state.cdn,
			tags: state.tags,
			artist: state.artist,
		};
		try {
			const response = await fetcher({
				endPoint,
				method: state._id ? "PUT" : "POST",
				body: {
					data: requestBody,
				},
			});
			if (response.statusCode <= 300) {
				notification.success({ message: "Product Saved" });
				const responseAssetData: NewAssetUploadState = response.data;
				if (dimensionInInches) {
					responseAssetData.dimension = formatResponseOnRecieve(responseAssetData.dimension, dimensionInInches);
				}
				if (onOkComplete && !state._id) {
					onOkComplete({ _id: responseAssetData._id }, null, Status.pending);
				}
				dispatch({ type: NEW_ASSET_ACTION_TYPES.SET_ASSET, value: responseAssetData });

				setModifiedForm(false);
			}
		} catch (e) {
			if (e.message === "Failed to fetch") {
				notification.error({ message: "Failed to save Product. Please check your internet connection and Retry" });
			} else {
				notification.error({ message: "Failed to save Product" });
			}
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
			location === "MISSING_ASSETS")
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
					<Col>
						<SilentDivider />
					</Col>
					<Col>
						<Row gutter={[0, 4]}>
							<Col span={24}>
								<Text>Product Name</Text>
							</Col>
							<Col span={24}>
								<Input
									ref={assetName}
									required
									onChange={handleChange}
									name={NEW_ASSET_ACTION_TYPES.ASSET_NAME}
									value={state.name}
									placeholder="Product Name"
								/>
							</Col>
						</Row>
					</Col>
					<Col>
						<Row gutter={[0, 4]}>
							<Col span={24}>
								<Text>Description</Text>
							</Col>
							<Col span={24}>
								<Input.TextArea
									ref={assetDescription}
									required
									onChange={handleChange}
									name={NEW_ASSET_ACTION_TYPES.ASSET_DESCRIPTION}
									value={state.description}
									placeholder="Description"
								/>
							</Col>
						</Row>
					</Col>
					<Col>
						<Row gutter={[8, 8]}>
							<Col span={12}>
								<Row gutter={[0, 4]}>
									<Col span={24}>
										<Text>Price</Text>
									</Col>
									<Col span={24}>
										<Input
											ref={assetPrice}
											required
											type="number"
											placeholder="Price"
											onChange={handleChange}
											name={NEW_ASSET_ACTION_TYPES.ASSET_PRICE}
											value={state.price}
											addonAfter={
												<Select
													onChange={(value): void =>
														handleSelect(value, NEW_ASSET_ACTION_TYPES.ASSET_PRICE_CURRENCY_TYPE)
													}
													defaultValue="usd"
													value={state.currency}
													style={{ width: 64 }}
												>
													{Object.keys(Currency).map(key => (
														<Option key={key} value={Currency[key]}>
															{key}
														</Option>
													))}
												</Select>
											}
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
											placeholder="Select Retailer"
											ref={assetRetailer}
											onChange={(value): void => handleSelect(value, NEW_ASSET_ACTION_TYPES.ASSET_RETAILER)}
											value={state.retailer}
											dropdownRender={(menu): JSX.Element => (
												<Row gutter={[0, 4]}>
													<Col>{menu}</Col>
													<Col>
														<SilentDivider />
													</Col>
													<Col>
														<Button
															onMouseDown={(e): void => e.preventDefault()}
															onClick={toggleAddRetailerModal}
															block
															type="ghost"
															size="large"
															icon="plus"
														>
															Add Retailer
														</Button>
													</Col>
												</Row>
											)}
											showSearch
											optionFilterProp="children"
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
									type="url"
									addonAfter={
										<Tooltip placement="top" title="Open URL">
											<Icon onClick={openInNewWindow} type="link" />
										</Tooltip>
									}
									placeholder="Link to product"
									name={NEW_ASSET_ACTION_TYPES.ASSET_RETAIL_LINK}
								/>
							</Col>
						</Row>
					</Col>
					<Col>
						<Row gutter={[4, 4]}>
							<Col span={8}>
								<Row gutter={[4, 4]}>
									<Col span={24}>Category</Col>
									<Col span={24}>
										<Select
											ref={assetCategory}
											onChange={(value): void => handleSelect(value, NEW_ASSET_ACTION_TYPES.ASSET_CATEGORY)}
											value={state.meta.category}
											showSearch
											optionFilterProp="children"
											placeholder="Select A Category"
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
											onChange={(value): void => handleSelect(value, NEW_ASSET_ACTION_TYPES.ASSET_SUB_CATEGORY)}
											disabled={!state.meta.category}
											value={state.meta.subcategory}
											showSearch
											optionFilterProp="children"
											placeholder="Select A Sub Category"
											style={{ width: "100%" }}
										>
											{!!state.meta.category &&
												categoryMap
													.find(category => category.key === state.meta.category)
													.children.map(category => (
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
											onChange={(value): void => handleSelect(value, NEW_ASSET_ACTION_TYPES.ASSET_VERTICAL)}
											disabled={!state.meta.subcategory}
											value={state.meta.vertical}
											showSearch
											optionFilterProp="children"
											placeholder="Select A Vertical"
											style={{ width: "100%" }}
										>
											{!!state.meta.subcategory &&
												categoryMap
													.find(category => category.key === state.meta.category)
													.children.find(subCategory => subCategory.key === state.meta.subcategory)
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
					<Col>
						<Row gutter={[8, 0]}>
							<Col span={12}>
								<Row gutter={[4, 4]}>
									<Col span={24}>
										<Text>Theme</Text>
									</Col>
									<Col span={24}>
										<Select
											ref={assetTheme}
											onChange={(value): void => handleSelect(value, NEW_ASSET_ACTION_TYPES.ASSET_THEME)}
											value={state.meta.theme}
											showSearch
											optionFilterProp="children"
											placeholder="Select a Theme"
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
											onChange={(value): void => handleSelect(value, NEW_ASSET_ACTION_TYPES.ASSET_STATUS)}
											value={state.status}
											showSearch
											optionFilterProp="children"
											placeholder="Select a Status"
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
					<Col>
						<Row type="flex" gutter={[4, 8]}>
							<Col span={12}>
								<Row>
									<Col span={24}>
										<Row>
											<Col>Is the Item Shoppable?</Col>
										</Row>
									</Col>
									<Col span={24}>
										<Radio.Group
											onChange={handleChange}
											value={state.shoppable}
											name={NEW_ASSET_ACTION_TYPES.ASSET_SHOPPABLE}
										>
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
											mode="tags"
											tokenSeparators={[",", " "]}
											open={false}
											onChange={(value): void => handleSelect(value, NEW_ASSET_ACTION_TYPES.ASSET_TAGS)}
											value={state.tags}
											placeholder="Tag products"
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
					<Col>
						<SilentDivider />
					</Col>
					<Col>
						<Row type="flex" gutter={[4, 4]}>
							<Col>Dimensions in Inches?</Col>
							<Col>
								<Switch
									onChange={onSwitchChange}
									checked={dimensionInInches}
									checkedChildren="Yes"
									unCheckedChildren="No"
								/>
							</Col>
						</Row>
					</Col>
					<Col>
						<Row gutter={[4, 4]}>
							<Col span={8}>
								<Row gutter={[4, 4]}>
									<Col span={24}>Width({dimensionText})</Col>
									<Col>
										<Input
											ref={assetWidth}
											required
											onChange={handleChange}
											value={state.dimension.width}
											name={NEW_ASSET_ACTION_TYPES.ASSET_WIDTH}
											placeholder={`Width(${dimensionText})`}
											type="number"
										/>
									</Col>
								</Row>
							</Col>
							<Col span={8}>
								<Row gutter={[4, 4]}>
									<Col span={24}>Height({dimensionText})</Col>
									<Col>
										<Input
											ref={assetHeight}
											required
											onChange={handleChange}
											value={state.dimension.height}
											name={NEW_ASSET_ACTION_TYPES.ASSET_HEIGHT}
											placeholder={`Height(${dimensionText})`}
											type="number"
										/>
									</Col>
								</Row>
							</Col>
							<Col span={8}>
								<Row gutter={[4, 4]}>
									<Col span={24}>Depth({dimensionText})</Col>
									<Col>
										<Input
											ref={assetDepth}
											required
											onChange={handleChange}
											value={state.dimension.depth}
											name={NEW_ASSET_ACTION_TYPES.ASSET_DEPTH}
											placeholder={`Depth(${dimensionText})`}
											type="number"
										/>
									</Col>
								</Row>
							</Col>
						</Row>
					</Col>
					<Col>
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
											optionFilterProp="children"
											onChange={(value): void => handleSelect(value, NEW_ASSET_ACTION_TYPES.ASSET_MOUNT_TYPE)}
											value={state.spatialData.mountType}
											placeholder="Select a Mount Type"
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

					<Col>
						<Row type="flex" gutter={[4, 4]}>
							<Col span={12}>
								<Row>
									<Col>Interacts with other Objects?</Col>
									<Col>
										<small>e.g. Rugs do not interact with other objects</small>
									</Col>
								</Row>
							</Col>
							<Col span={12}>
								<Radio.Group
									onChange={handleChange}
									value={state.spatialData.clampValue}
									name={NEW_ASSET_ACTION_TYPES.ASSET_CLAMP_VALUE}
								>
									<Radio value={0}>Yes</Radio>
									<Radio value={-1}>No</Radio>
								</Radio.Group>
							</Col>
						</Row>
					</Col>
				</Col>
				{!!state._id && (
					<Col lg={12}>
						<Col span={24}>
							<Title level={4}>File Upload</Title>
						</Col>
						<Col>
							<SilentDivider />
						</Col>
						<Col>
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
										name="file"
										fileList={assetFile}
										action={uploadModelEndpoint}
										onRemove={(): false => false}
										onChange={(info): void => handleOnFileUploadChange("model", info)}
										headers={{ Authorization: getCookie(null, cookieNames.authToken) }}
										accept={ModelToExtensionMap[model3dFiles]}
									>
										<Button>
											<Icon type="upload" />
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
										name="file"
										fileList={sourceFileList}
										action={uploadModelSourceEndpoint}
										onRemove={(): false => false}
										onChange={(info): void => handleOnFileUploadChange("source", info)}
										headers={{ Authorization: getCookie(null, cookieNames.authToken) }}
										accept=".blend"
									>
										<Button>
											<Icon type="upload" />
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
										name="file"
										fileList={sourceHighPolyFileList}
										action={uploadModelHighPolySouceEndpoint}
										onRemove={(): false => false}
										onChange={(info): void => handleOnFileUploadChange("sourceHighPoly", info)}
										headers={{ Authorization: getCookie(null, cookieNames.authToken) }}
										accept=".blend"
									>
										<Button>
											<Icon type="upload" />
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
										name="image"
										fileList={imageFile}
										listType="picture-card"
										onPreview={handlePreview}
										action={uploadAssetImageEndpoint}
										onRemove={(): false => false}
										onChange={(info): void => handleOnFileUploadChange("image", info)}
										headers={{ Authorization: getCookie(null, cookieNames.authToken) }}
										accept="image/*"
									>
										<Button>
											<Icon type="upload" />
											Click to Upload
										</Button>
									</Upload>
								</Col>
							</Row>
						</Col>
					</Col>
				)}
				<Col span={24}>
					<Row type="flex" gutter={[8, 0]} justify="end">
						<Col>
							<Button onClick={toggleNewAssetModal}>Cancel</Button>
						</Col>
						<Col>
							<Button
								disabled={submitButtonDisabled || !modifiedForm}
								type="primary"
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
				altText="previewImages"
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
