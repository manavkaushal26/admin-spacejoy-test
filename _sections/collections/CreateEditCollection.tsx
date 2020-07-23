import { CheckCircleTwoTone, CloseCircleTwoTone, LinkOutlined, PlusOutlined } from "@ant-design/icons";
import { getMetaDataApi } from "@api/designApi";
import { getSingleCollection } from "@api/metaApi";
import ImageDisplayModal from "@components/ImageDisplayModal";
import { DetailedCollection } from "@customTypes/collectionTypes";
import { RoomTypes } from "@customTypes/dashboardTypes";
import { MetaDataType } from "@customTypes/moodboardTypes";
import { AssetStatus, Status } from "@customTypes/userType";
import { SizeAdjustedModal } from "@sections/AssetStore/styled";
import { getBase64, getValueSafely } from "@utils/commonUtils";
import { cloudinary, company, cookieNames, page } from "@utils/config";
import fetcher from "@utils/fetcher";
import getCookie from "@utils/getCookie";
import { Button, Col, Input, notification, Row, Select, Spin, Tooltip, Typography, Upload } from "antd";
import { UploadChangeParam, UploadFile } from "antd/lib/upload/interface";
import React, { useEffect, useMemo, useState } from "react";

const { Text } = Typography;

const initialState: DetailedCollection = {
	bg: "",
	_id: "",
	name: "",
	metaTitle: "",
	metaDescription: "",
	slug: "",
	cdnThumbnail: "",
	cdnCover: "",
	description: "",
	searchKey: {
		retailers: [],
		tags: [],
		roomType: [],
		themes: [],
	},
	designList: [],
	status: Status.pending,
};

interface CreateEditCollection {
	id: string;
	isOpen: boolean;
	onSave?: (data: DetailedCollection, newEntry: boolean) => void;
	onClose: (id: string, type: "open" | "close") => void;
}

const CreateEditCollection: React.FC<CreateEditCollection> = ({ id, isOpen, onSave, onClose }) => {
	const [collectionData, setCollectionData] = useState<DetailedCollection>(initialState);
	const [loading, setLoading] = useState<boolean>(false);
	const [metadata, setMetadata] = useState<MetaDataType>(null);
	const [preview, setPreview] = useState({ previewImage: "", previewVisible: false });
	const themes = useMemo(() => getValueSafely(() => metadata.themes.list, []), [metadata]);
	const retailers = useMemo(() => getValueSafely(() => metadata.retailers.list, []), [metadata]);
	const [thumbnailList, setThumbnailList] = useState<UploadFile[]>([]);
	const [coverList, setCoverList] = useState<UploadFile[]>([]);

	const uploadImageEndpoint = useMemo(
		() => collectionData._id && `${page.apiBaseUrl}${getSingleCollection(collectionData._id)}`,
		[collectionData]
	);

	useEffect(() => {
		return (): void => {
			setCollectionData(initialState);
			setLoading(false);
			setThumbnailList([]);
			setCoverList([]);
		};
	}, [isOpen]);

	useEffect(() => {
		if (collectionData) {
			if (collectionData.cdnThumbnail) {
				setThumbnailList([
					{
						uid: "-1",
						name: collectionData.cdnThumbnail.split("/").pop(),
						status: "done",
						url: `${cloudinary.baseDeliveryURL}/image/upload/${collectionData.cdnThumbnail}`,
						size: 0,
						type: "application/octet-stream",
					},
				]);
			}
			if (collectionData.cdnCover) {
				setCoverList([
					{
						uid: "-1",
						name: collectionData.cdnCover.split("/").pop(),
						status: "done",
						url: `${cloudinary.baseDeliveryURL}/image/upload/${collectionData.cdnCover}`,
						size: 0,
						type: "application/octet-stream",
					},
				]);
			}
		}
	}, [collectionData]);

	const fetchCollectionDetails = async (): Promise<void> => {
		setLoading(true);
		const endPoint = getSingleCollection(id);
		try {
			const response = await fetcher({ endPoint, method: "GET" });
			if (response.status === "success") {
				setCollectionData(response.data);
			} else {
				notification.error({ message: "Something went wrong fetching the collection" });
			}
		} catch (e) {
			notification.error({ message: "Facing communication issues. Please check your internet connection." });
		}
		setLoading(false);
	};

	const fetchMetaData = async (): Promise<void> => {
		const endpoint = getMetaDataApi();
		const response = await fetcher({ endPoint: endpoint, method: "GET" });
		if (response.statusCode === 200) {
			setMetadata(response.data);
		}
	};

	const onChange = (e): void => {
		const {
			target: { name, value },
		} = e;

		setCollectionData({
			...collectionData,
			[name]: value,
		});
	};

	const handleOnFileUploadChange = (
		uploadFileType: "thumbnail" | "cover",
		info: UploadChangeParam<UploadFile>
	): void => {
		let fileList = [...info.fileList];

		fileList = fileList.slice(-1);
		// 1. Limit the number of uploaded files
		// Only to show one recent uploaded files, and old ones will be replaced by the new
		if (info.file.status === "done") {
			notification.open({ key: uploadFileType, message: `Uploading ${uploadFileType}` });
			setCollectionData({ ...collectionData, ...info.file.response.data });
			onSave({ ...collectionData, ...info.file.response.data }, !collectionData._id);
		} else if (info.file.status === "error") {
			notification.error({ message: "Error uploading file" });
		} else {
			notification.open({ key: uploadFileType, message: `Uploading ${uploadFileType}` });
		}
		if (uploadFileType === "thumbnail") {
			setThumbnailList(fileList);
		} else if (uploadFileType === "cover") {
			setCoverList(fileList);
		}
	};

	const onRegenerateClick = async (): Promise<void> => {
		notification.open({ key: "Regenerate", message: "Regenerating Collection" });

		const endPoint = `/designcollection/${collectionData._id}/regenerate`;
		try {
			const response = await fetcher({
				endPoint,
				method: "POST",
				body: {
					data: {
						keepNonMatching: true,
					},
				},
			});

			if (response.status === "success") {
				setCollectionData({ ...collectionData, ...response.data });
				onSave({ ...collectionData, ...response.data }, false);
				notification.open({
					key: "Regenerate",
					message: "Saved Collection",
					icon: <CheckCircleTwoTone twoToneColor='#52c41a' />,
				});
			} else {
				notification.open({
					key: "Regenerate",
					message: "Error Saving Collection",
					icon: <CloseCircleTwoTone twoToneColor='#f5222d' />,
				});
			}
		} catch (e) {
			notification.open({
				key: "Regenerate",
				message: "Error Saving Collection",
				icon: <CloseCircleTwoTone twoToneColor='#f5222d' />,
			});
		}
		setLoading(false);
	};

	const onSaveClick = async (): Promise<void> => {
		notification.open({ key: "save", message: "Saving Collection" });
		const endPoint = getSingleCollection(collectionData._id);
		const method = collectionData._id ? "PUT" : "POST";
		const newEntry = !collectionData._id;
		const body = {
			data: collectionData,
		};

		if (newEntry) {
			delete body.data._id;
			delete body.data.slug;
		}
		const response = await fetcher({
			endPoint,
			method,
			body: {
				data: collectionData,
			},
		});
		if (response.status === "success") {
			notification.open({
				key: "save",
				message: "Saved Collection",
				icon: <CheckCircleTwoTone twoToneColor='#52c41a' />,
			});
			setCollectionData(response.data);
			await onRegenerateClick();
			if (onSave) {
				onSave(response.data, newEntry);
			}
		} else {
			notification.open({
				key: "save",
				message: "Error Saving Collection",
				icon: <CloseCircleTwoTone twoToneColor='#f5222d' />,
			});
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

	const handleSelect = (value, name): void => {
		if (name === "status") {
			setCollectionData({
				...collectionData,
				[name]: value,
			});
			return;
		}
		setCollectionData({
			...collectionData,
			searchKey: {
				...collectionData.searchKey,
				[name]: value,
			},
		});
	};

	useEffect(() => {
		fetchMetaData();
	}, []);

	useEffect(() => {
		if (id !== null) {
			fetchCollectionDetails();
		}
	}, [id]);

	const onCloseModal = (): void => {
		onClose(null, "close");
	};

	const openInNewWindow = (): void => {
		if (collectionData.slug) {
			window.open(`${company.customerPortalLink}/interior-designs/${collectionData.slug}`, "_blank", "noopener");
		}
	};

	return (
		<Spin spinning={loading}>
			<SizeAdjustedModal
				visible={isOpen}
				onCancel={onCloseModal}
				onOk={onSaveClick}
				footer={[
					<Button key='back' onClick={onCloseModal}>
						Close
					</Button>,
					...[
						collectionData._id ? (
							<Button key='regen' type='default' onClick={onRegenerateClick}>
								Regenerate Collection
							</Button>
						) : null,
					],
					<Button key='save' type='primary' loading={loading} onClick={onSaveClick}>
						Save
					</Button>,
				]}
			>
				<Row gutter={[8, 8]}>
					<Col span={24}>
						<Row gutter={[4, 4]}>
							<Col span={24}>
								<Text strong>Name</Text>
							</Col>
							<Col span={24}>
								<Input onChange={onChange} name='name' value={collectionData.name} />
							</Col>
						</Row>
					</Col>
					<Col span={24}>
						<Row gutter={[4, 4]}>
							<Col span={24}>
								<Text strong>Description</Text>
							</Col>
							<Col span={24}>
								<Input.TextArea onChange={onChange} name='description' value={collectionData.description} />
							</Col>
						</Row>
					</Col>
					<Col span={24}>
						<Row gutter={[4, 4]}>
							<Col span={24}>
								{" "}
								<Text strong>Meta Title </Text>
							</Col>
							<Col span={24}>
								<Input onChange={onChange} name='metaTitle' value={collectionData.metaTitle} />
							</Col>
						</Row>
					</Col>
					<Col span={24}>
						<Row gutter={[4, 4]}>
							<Col span={24}>
								<Text strong>Meta Description</Text>
							</Col>
							<Col span={24}>
								<Input.TextArea onChange={onChange} name='metaDescription' value={collectionData.metaDescription} />
							</Col>
						</Row>
					</Col>
					<Col span={24}>
						<Row gutter={[4, 4]}>
							<Col span={24}>
								<Text strong>Slug</Text>
							</Col>
							<Col span={24}>
								<Input
									onChange={onChange}
									name='slug'
									value={collectionData.slug}
									addonAfter={
										<Tooltip placement='top' title='Open URL'>
											<LinkOutlined onClick={openInNewWindow} />
										</Tooltip>
									}
								/>
							</Col>
						</Row>
					</Col>
					<Col span={12}>
						<Row gutter={[4, 4]}>
							<Col span={24}>
								<Text strong>Background Color</Text>
							</Col>
							<Col span={24}>
								<Input onChange={onChange} name='bg' value={collectionData.bg} type='color' />
							</Col>
						</Row>
					</Col>
					<Col span={12}>
						<Row gutter={[4, 4]}>
							<Col span={24}>
								<Text strong>Status</Text>
							</Col>
							<Col span={24}>
								<Select
									onChange={(value): void => handleSelect(value, "status")}
									value={collectionData.status}
									showSearch
									optionFilterProp='children'
									placeholder='Select a Status'
									style={{ width: "100%" }}
								>
									{Object.keys(AssetStatus).map(key => (
										<Select.Option value={AssetStatus[key]} key={key}>
											{key}
										</Select.Option>
									))}
								</Select>
							</Col>
						</Row>
					</Col>
					<Col span={12}>
						<Row gutter={[4, 4]}>
							<Col span={24}>
								<Text strong>Tags</Text>
							</Col>
							<Col span={24}>
								<Select
									onChange={(value): void => handleSelect(value, "tags")}
									style={{ width: "100%" }}
									mode='tags'
									open={false}
									tokenSeparators={[","]}
								/>
							</Col>
						</Row>
					</Col>
					<Col span={12}>
						<Row gutter={[4, 4]}>
							<Col span={24}>
								<Text strong>Room Type</Text>
							</Col>
							<Col span={24}>
								<Select
									showSearch
									onChange={(value): void => handleSelect(value, "roomType")}
									optionFilterProp='children'
									mode='multiple'
									style={{ width: "100%" }}
									value={collectionData.searchKey.roomType}
								>
									{Object.entries(RoomTypes).map(([key, value]) => (
										<Select.Option value={value} key={key}>
											{key}
										</Select.Option>
									))}
								</Select>
							</Col>
						</Row>
					</Col>
					<Col span={12}>
						<Row gutter={[4, 4]}>
							<Col span={24}>
								<Text strong>Retailers</Text>
							</Col>
							<Col span={24}>
								<Select
									onChange={(value): void => handleSelect(value, "retailers")}
									placeholder='Select Retailer'
									value={collectionData.searchKey.retailers}
									showSearch
									mode='multiple'
									optionFilterProp='children'
									style={{ width: "100%" }}
								>
									{retailers.map(retailer => (
										<Select.Option key={retailer._id} value={retailer._id}>
											{retailer.name}
										</Select.Option>
									))}
								</Select>
							</Col>
						</Row>
					</Col>
					<Col span={12}>
						<Row gutter={[4, 4]}>
							<Col span={24}>
								<Text strong>Themes</Text>
							</Col>
							<Col span={24}>
								<Select
									mode='multiple'
									onChange={(value): void => handleSelect(value, "themes")}
									value={collectionData.searchKey.themes}
									showSearch
									optionFilterProp='children'
									placeholder='Select a Theme'
									style={{ width: "100%" }}
								>
									{themes.map(theme => (
										<Select.Option value={theme._id} key={theme._id}>
											{theme.name}
										</Select.Option>
									))}
								</Select>
							</Col>
						</Row>
					</Col>
					{getValueSafely<string | undefined>(() => collectionData._id, undefined) && (
						<>
							<Col span={12}>
								<Row gutter={[4, 4]}>
									<Col span={24}>
										<Text strong>Thumbnail</Text>
									</Col>
									<Col span={24}>
										<Upload
											supportServerRender
											name='thumbnail'
											fileList={thumbnailList}
											listType='picture-card'
											onPreview={handlePreview}
											action={uploadImageEndpoint}
											onRemove={(): false => false}
											onChange={(info): void => handleOnFileUploadChange("thumbnail", info)}
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
									</Col>
								</Row>
							</Col>
							<Col span={12}>
								<Row gutter={[4, 4]}>
									<Col span={24}>
										<Text strong>Cover</Text>
									</Col>
									<Col span={24}>
										<Upload
											supportServerRender
											name='cover'
											fileList={coverList}
											listType='picture-card'
											onPreview={handlePreview}
											action={uploadImageEndpoint}
											onRemove={(): false => false}
											onChange={(info): void => handleOnFileUploadChange("cover", info)}
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
									</Col>
								</Row>
							</Col>
						</>
					)}
				</Row>
				<ImageDisplayModal
					handleCancel={handleCancel}
					previewImage={preview.previewImage}
					previewVisible={preview.previewVisible}
					altText='previewImages'
				/>
			</SizeAdjustedModal>
		</Spin>
	);
};

export default CreateEditCollection;
