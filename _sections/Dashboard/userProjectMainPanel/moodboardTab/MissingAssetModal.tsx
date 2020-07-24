import {
	CheckCircleOutlined,
	CheckCircleTwoTone,
	CloseCircleOutlined,
	CloseCircleTwoTone,
	DeleteOutlined,
	LoadingOutlined,
	UploadOutlined,
} from "@ant-design/icons";
import { markMissingAssetAsComplete } from "@api/assetApi";
import { getMoodboardApi } from "@api/designApi";
import { AssetType, MoodboardAsset } from "@customTypes/moodboardTypes";
import { Status } from "@customTypes/userType";
import { SizeAdjustedModal } from "@sections/AssetStore/styled";
import { AddOnAfterWithoutPadding, CustomDiv } from "@sections/Dashboard/styled";
import { redirectToLocation } from "@utils/auth";
import { dateFromObjectId, getValueSafely } from "@utils/commonUtils";
import fetcher from "@utils/fetcher";
import { Badge, Button, Col, List, notification, Popconfirm, Row, Spin, Tooltip, Typography } from "antd";
import moment from "moment";
import React, { ChangeEvent, useState } from "react";
import styled from "styled-components";

const { Text, Link } = Typography;

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

	const [editAssetId, setEditAsseId] = useState<string>(null);

	const assetUrlChange = (e: ChangeEvent<HTMLInputElement>): void => {
		const {
			target: { value },
		} = e;
		setAssetUrl(value);
	};

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
				notification.success({
					message: "Successfully added URL",
					description:
						"Please make sure that the link contains details regarding product such as Dimensions, Color, etc. If not Please add the info by clicking the upload Icon next to the URL",
					duration: 12000,
				});
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
			notification.success({ message: "Product URL deleted successfully" });
		}
		setDeleteLoading(false);
	};

	const onClick = (assetData: MoodboardAsset): void => {
		redirectToLocation({
			pathname: "/assetstore/assetdetails",
			query: {
				assetId: assetData.asset ? assetData.asset._id : undefined,
				mai: assetData._id,
				did: designId,
				rlink: assetData.externalUrl,
				entry: window.location.pathname,
			},
			url: `/assetstore/assetdetails?mai=${assetData._id}&did=${designId}&entry=${window.location.pathname}&rlink=${
				assetData.externalUrl
			}${assetData.asset ? `&assetId=${assetData.asset._id}` : ""}`,
		});
		// setEditAssetData({ retailLink: assetData.externalUrl, ...assetData.asset });
		// setEditAsseId(assetData._id);
		// toggleNewAssetModal();
	};

	const markAssetAsComplete = async (
		createdAsset: Partial<AssetType>,
		missingAssetId?: string,
		status?: Status,
		force?: boolean
	): Promise<void> => {
		const _id = getValueSafely(() => createdAsset._id, "");
		notification.open({
			key: MARK_AS_COMPLETE_NOTIFICATION_KEY,
			message: "Please Wait",
			icon: <LoadingOutlined />,
			description: "Asset status is being updated",
		});

		const endPoint = markMissingAssetAsComplete(designId, missingAssetId || editAssetId);
		if (_id !== "" || force) {
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

	const whatArethePopoverOptions = (asset): { title: string; force: boolean; okText } => {
		const options = {
			title: "Have you verified the asset status has been marked active?",
			force: false,
			okText: "Yes, I have",
		};
		if (!asset) {
			options.title = "Asset not yet uploaded. Are you sure you want to mark it as complete?";
			options.force = true;
			options.okText = "Yes, I want to";
		}
		return options;
	};

	return (
		<SizeAdjustedModal
			title='Add Missing Product'
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
						<Button loading={loading} type='primary' onClick={addAsset}>
							Add
						</Button>
					}
				/>
				<Spin spinning={deleteLoading}>
					<List
						header={<Text strong>Added Product URL&apos;s</Text>}
						bordered
						dataSource={missingAssets}
						renderItem={(asset): JSX.Element => {
							const popoverOptions = whatArethePopoverOptions(asset.asset);

							return (
								<List.Item>
									<Row gutter={[4, 4]} style={{ width: "100%" }} justify='space-between' align='middle'>
										<Col span={21}>
											<Row gutter={[8, 8]}>
												<Col span={3}>{moment(dateFromObjectId(asset._id)).format("MM-DD-YYYY")}</Col>
												<Col span={21}>
													<Link
														style={{ width: "100%" }}
														href={
															asset.externalUrl.includes("res.cloudinary") &&
															!asset.externalUrl.startsWith("//") &&
															!asset.externalUrl.startsWith("http")
																? `//${asset.externalUrl}`
																: asset.externalUrl
														}
														target='_blank'
														rel='noopener noreferrer'
														ellipsis={true}
													>
														{asset.externalUrl}
													</Link>
												</Col>
											</Row>
										</Col>
										<Col span={3}>
											<Row justify='end'>
												{asset.modellingStatus !== Status.completed && (
													<Badge dot>
														<Col span={8}>
															<Row align='middle' justify='center'>
																<Tooltip title='Upload Asset'>
																	<UploadOutlined onClick={() => onClick(asset)} />
																</Tooltip>
															</Row>
														</Col>
													</Badge>
												)}
												{asset.modellingStatus === Status.completed ? (
													<Col span={8}>
														<Row align='middle' justify='center'>
															<Popconfirm
																title='Are you sure you want to mark product as incomplete?'
																onConfirm={(): Promise<void> =>
																	markAssetAsComplete(asset.asset, asset._id, Status.pending)
																}
															>
																<Tooltip placement='bottom' title='Mark as not complete'>
																	<CloseCircleOutlined />
																</Tooltip>
															</Popconfirm>
														</Row>
													</Col>
												) : (
													<Col span={8}>
														<Row align='middle' justify='center'>
															<Popconfirm
																title={popoverOptions.title}
																okText={popoverOptions.okText}
																disabled={!popoverOptions.force}
																cancelText='No, Cancel'
																onConfirm={(): Promise<void> =>
																	markAssetAsComplete(asset.asset, asset._id, Status.completed, popoverOptions.force)
																}
															>
																<Tooltip title='Mark as complete'>
																	<CheckCircleOutlined
																		{...(!popoverOptions.force
																			? {
																					onClick: (): Promise<void> =>
																						markAssetAsComplete(
																							asset.asset,
																							asset._id,
																							Status.completed,
																							popoverOptions.force
																						),
																			  }
																			: {})}
																	/>
																</Tooltip>
															</Popconfirm>
														</Row>
													</Col>
												)}
												<Col span={8}>
													<Row align='middle' justify='center'>
														<Tooltip title='Delete'>
															<Popconfirm
																title='Delete Missing Asset URL?'
																onConfirm={(): Promise<void> => removeAsset(asset.externalUrl)}
															>
																<DeleteOutlined />
															</Popconfirm>
														</Tooltip>
													</Row>
												</Col>
											</Row>
										</Col>
									</Row>
								</List.Item>
							);
						}}
					/>
				</Spin>
			</ChildSpacedDiv>
		</SizeAdjustedModal>
	);
};

export default MissingAssetModal;
