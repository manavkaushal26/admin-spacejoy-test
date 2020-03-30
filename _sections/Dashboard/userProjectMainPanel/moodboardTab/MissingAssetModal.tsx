import { markMissingAssetAsComplete } from "@api/assetApi";
import { getMetaDataApi, getMoodboardApi } from "@api/designApi";
import { AssetType, MetaDataType, MoodboardAsset } from "@customTypes/moodboardTypes";
import { Status } from "@customTypes/userType";
import NewAssetModal from "@sections/AssetStore/newAssetModal";
import { SizeAdjustedModal } from "@sections/AssetStore/styled";
import { AddOnAfterWithoutPadding, CustomDiv } from "@sections/Dashboard/styled";
import fetcher from "@utils/fetcher";
import { Button, Col, Icon, List, message, Popconfirm, Row, Spin, Tooltip, Typography, notification } from "antd";
import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import styled from "styled-components";

const { Text } = Typography;

const ChildSpacedDiv = styled.div`
	> * + * {
		margin-top: 1rem;
	}
`;

const MARK_AS_COMPLETE_NOTIFICATION_KEY = "COMPLETE_ASSET";

interface MissingAssetModal {
	designId: string;
	setMoodboard: React.Dispatch<React.SetStateAction<MoodboardAsset[]>>;
	missingAssets: MoodboardAsset[];
	toggleAddMissingAssetModal: () => void;
	addMissingAssetModalVisible: boolean;
}

interface CategoryMap {
	key: string;
	title: {
		name: string;
		level: string;
	};
	children?: Array<CategoryMap>;
}

const MissingAssetModal: React.FC<MissingAssetModal> = ({
	designId,
	missingAssets,
	addMissingAssetModalVisible,
	setMoodboard,
	toggleAddMissingAssetModal,
}) => {
	const [assetUrl, setAssetUrl] = useState<string>("");
	const [loading, setLoading] = useState(false);
	const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
	const [metaData, setMetadata] = useState<MetaDataType>(null);
	const [editAssetData, setEditAssetData] = useState<Partial<AssetType>>(null);
	const [newAssetModalVisible, setNewAssetModalVisible] = useState<boolean>(false);
	const [editAssetId, setEditAsseId] = useState<string>(null);

	const toggleNewAssetModal = (): void => {
		setNewAssetModalVisible(prevState => {
			return !prevState;
		});
	};

	const categoryMap: Array<CategoryMap> = useMemo(() => {
		if (metaData) {
			return metaData.categories.list.map(elem => {
				return {
					title: { name: elem.name, level: "category" },
					key: elem._id,
					children: metaData.subcategories.list
						.filter(subElem => {
							return subElem.category === elem._id;
						})
						.map(subElem => {
							return {
								title: { name: subElem.name, level: "subCategory" },
								key: subElem._id,
								children: metaData.verticals.list
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
	}, [metaData]);

	const assetUrlChange = (e: ChangeEvent<HTMLInputElement>): void => {
		const {
			target: { value },
		} = e;
		setAssetUrl(value);
	};

	const fetchMetaData = async (): Promise<void> => {
		const endpoint = getMetaDataApi();
		const response = await fetcher({ endPoint: endpoint, method: "GET" });
		if (response.statusCode === 200) {
			setMetadata(response.data);
		}
	};

	useEffect(() => {
		fetchMetaData();
	}, [addMissingAssetModalVisible]);

	const addAsset = async (): Promise<void> => {
		if (assetUrl) {
			setLoading(true);
			const endpoint = getMoodboardApi(designId);
			const response = await fetcher({
				endPoint: endpoint,
				method: "POST",
				body: {
					data: {
						assets: [],
						assetUrls: [assetUrl],
					},
				},
			});
			if (response.statusCode <= 300) {
				setMoodboard(response.data.moodboard);
				setAssetUrl("");
				message.success("Product URL added successfully");
			}
			setLoading(false);
		}
	};

	const removeAsset = async (missingAssetUrl): Promise<void> => {
		setDeleteLoading(true);
		const endpoint = getMoodboardApi(designId);
		const response = await fetcher({
			endPoint: endpoint,
			method: "DELETE",
			body: {
				data: {
					assets: [],
					assetUrls: [missingAssetUrl],
				},
			},
		});
		if (response.statusCode <= 300) {
			setMoodboard(response.data.moodboard);
			message.success("Product URL deleted successfully");
		}
		setDeleteLoading(false);
	};

	const onClick = (assetData: MoodboardAsset): void => {
		setEditAssetData({ retailLink: assetData.externalUrl, ...assetData.asset });
		setEditAsseId(assetData._id);
		toggleNewAssetModal();
	};

	const markAssetAsComplete = async (
		{ _id }: Partial<AssetType>,
		missingAssetId?: string,
		status?: Status
	): Promise<void> => {
		notification.open({
			key: MARK_AS_COMPLETE_NOTIFICATION_KEY,
			message: "Please Wait",
			icon: <Icon type="loading" />,
			description: "Asset status is being updated",
		});

		const endPoint = markMissingAssetAsComplete(designId, missingAssetId || editAssetId);

		setEditAsseId(null);
		const response = await fetcher({
			endPoint,
			method: "PUT",
			body: {
				data: {
					status: status || Status.completed,
					assetId: _id,
				},
			},
		});
		if (response.status === "success" && response.statusCode <= 300) {
			setMoodboard(response.data.moodboard);
			notification.open({
				key: MARK_AS_COMPLETE_NOTIFICATION_KEY,
				message: "Successful",
				icon: <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />,
				description: "Asset status is being updated",
			});
		} else {
			notification.open({
				key: MARK_AS_COMPLETE_NOTIFICATION_KEY,
				message: "Error",
				icon: <Icon type="close-circle" theme="twoTone" twoToneColor="#f5222d" />,
				description: "There was a problem marking this asset.",
			});
		}
	};

	return (
		<SizeAdjustedModal
			title="Add Missing Product"
			onCancel={toggleAddMissingAssetModal}
			footer={null}
			destroyOnClose
			visible={addMissingAssetModalVisible}
		>
			<ChildSpacedDiv>
				<Text strong>Add missing Asset</Text>
				<CustomDiv>
					<Text>Copy the URL for the missing product into the below textbox</Text>
				</CustomDiv>

				<AddOnAfterWithoutPadding
					onChange={assetUrlChange}
					onPressEnter={addAsset}
					value={assetUrl}
					addonAfter={
						<Button loading={loading} type="primary" onClick={addAsset}>
							Add
						</Button>
					}
				/>
				<Spin spinning={deleteLoading}>
					<List
						header={<Text strong>Added Product URL&apos;s</Text>}
						bordered
						dataSource={missingAssets}
						renderItem={(asset): JSX.Element => (
							<List.Item>
								<Row type="flex" gutter={[4, 4]} style={{ width: "100%" }} justify="space-between">
									<Col span={21}>
										<a
											style={{ width: "100%", textOverflow: "ellipsis" }}
											target="_blank"
											rel="noopener noreferrer"
											href={`${asset.externalUrl}`}
										>
											{asset.externalUrl}
										</a>
									</Col>
									<Col span={3}>
										<Row type="flex" justify="end">
											{asset.modellingStatus !== Status.completed && (
												<Col span={8}>
													<Row align="middle" justify="center" type="flex">
														<Tooltip title="Upload Asset">
															<Icon onClick={(): void => onClick(asset)} type="upload" />
														</Tooltip>
													</Row>
												</Col>
											)}
											{asset.modellingStatus === Status.completed ? (
												<Col span={8}>
													<Row align="middle" justify="center" type="flex">
														<Popconfirm
															title="Are you sure?"
															onConfirm={(): Promise<void> =>
																markAssetAsComplete(asset.asset, asset._id, Status.pending)
															}
														>
															<Tooltip title="Mark as not complete">
																<Icon type="close-circle" theme="twoTone" twoToneColor="#f5222d" />
															</Tooltip>
														</Popconfirm>
													</Row>
												</Col>
											) : (
												<Col span={8}>
													<Row align="middle" justify="center" type="flex">
														<Tooltip title="Mark as complete">
															<Icon
																type="check-circle"
																twoToneColor="#52c41a"
																onClick={(): Promise<void> =>
																	markAssetAsComplete(asset.asset, asset._id, Status.completed)
																}
																theme="twoTone"
															/>
														</Tooltip>
													</Row>
												</Col>
											)}
											<Col span={8}>
												<Row align="middle" justify="center" type="flex">
													<Tooltip title="Delete">
														<Popconfirm
															title="Delete Missing Asset URL?"
															onConfirm={(): Promise<void> => removeAsset(asset.externalUrl)}
														>
															<Icon type="delete" />
														</Popconfirm>
													</Tooltip>
												</Row>
											</Col>
										</Row>
									</Col>
								</Row>
							</List.Item>
						)}
					/>
				</Spin>
				<NewAssetModal
					location="MISSING_ASSETS"
					metadata={metaData}
					categoryMap={categoryMap}
					assetData={editAssetData}
					setAssetData={setEditAssetData}
					toggleNewAssetModal={toggleNewAssetModal}
					isOpen={newAssetModalVisible}
					onOkComplete={markAssetAsComplete}
				/>
			</ChildSpacedDiv>
		</SizeAdjustedModal>
	);
};

export default MissingAssetModal;
