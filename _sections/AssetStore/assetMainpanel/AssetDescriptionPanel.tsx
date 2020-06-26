import {
	AlignLeftOutlined,
	BookOutlined,
	CodeSandboxOutlined,
	DollarCircleFilled,
	DragOutlined,
	FileImageOutlined,
	LinkOutlined,
	UserOutlined,
	EditOutlined,
} from "@ant-design/icons";
import { getSingleAssetApi } from "@api/designApi";
import { CapitalizedText } from "@components/CommonStyledComponents";
import Image from "@components/Image";
import ImageDisplayModal from "@components/ImageDisplayModal";
import ModelViewer from "@components/ModelViewer";
import { AssetType, MoodboardAsset } from "@customTypes/moodboardTypes";
import { AssetAction, ASSET_ACTION_TYPES } from "@sections/AssetStore/reducer";
import { SilentDivider } from "@sections/Dashboard/styled";
import { getValueSafely } from "@utils/commonUtils";
import fetcher from "@utils/fetcher";
import { Button, Col, message, notification, Popconfirm, Result, Row, Typography } from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { FullheightSpin, GreyDrawer } from "../styled";
import { isAssetInMoodboard } from "./utils";

const { Title, Text, Paragraph } = Typography;

interface AssetDescriptionPanelProps {
	editAsset: (assetData: AssetType) => void;

	addRemoveAsset: (action: "ADD" | "DELETE", assetId: string, assetEntryId?: string) => void;
	moodboard: MoodboardAsset[];
	designId: string;
	assetEntryId: string;
	selectedAssetId: string;
	setSelectedAssetId: React.Dispatch<React.SetStateAction<string>>;
	projectId: string;
	dispatch: React.Dispatch<AssetAction>;
	dataLoading: boolean;
	verticalMap?: Record<string, string>;
	categoryMap?: Record<string, string>;
	subCategoryMap?: Record<string, string>;
	themeIdToNameMap: Record<string, string>;
}

const SilentTitle = styled(Title)`
	text-transform: capitalize;
	margin-bottom: 0 !important;
`;

const ClickDiv = styled.div`
	cursor: pointer;
`;

const AssetDescriptionPanel: (props: AssetDescriptionPanelProps) => JSX.Element = ({
	addRemoveAsset,
	moodboard,
	designId,
	assetEntryId,
	selectedAssetId,
	setSelectedAssetId,
	projectId,
	dispatch,
	dataLoading,
	verticalMap,
	categoryMap,
	subCategoryMap,
	editAsset,
	themeIdToNameMap,
}) => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<boolean>(false);
	const [errorData, setErrorData] = useState<{
		status: string;
		group: string;
		data: string;
	}>(null);
	const [selectedAssetData, setSelectedAssetData] = useState<AssetType>(null);
	const [imagePreviewVisible, setImagePreviewVisible] = useState<boolean>(false);
	const Router = useRouter();
	const assetInMoodboard = useMemo(() => isAssetInMoodboard(moodboard, selectedAssetId, assetEntryId), [
		selectedAssetId,
		moodboard,
		assetEntryId,
	]);

	const fetchAssetData = async (): Promise<void> => {
		setLoading(true);
		const endPoint = getSingleAssetApi(selectedAssetId);
		const response = await fetcher({ endPoint, method: "GET" });
		if (response.statusCode <= 300) {
			const { category, subcategory, vertical, theme } = getValueSafely(() => response.data.meta, {
				category: { _id: "", name: "Undefined" },
				subcategory: { _id: "", name: "Undefined" },
				vertical: { _id: "", name: "Undefined" },
				theme: { _id: "", name: "Undefined" },
			});

			setSelectedAssetData({
				...response.data,
				meta: {
					category: getValueSafely(() => category._id, "Undefined"),
					subcategory: getValueSafely(() => subcategory._id, "Undefined"),
					vertical: getValueSafely(() => vertical._id, "Undefined"),
					theme: getValueSafely(() => theme._id, "Undefined"),
				},
			});
		} else {
			setError(true);
			setErrorData(response);
			notification.error({ message: "Failed to load asset data" });
		}
		setLoading(false);
	};

	useEffect(() => {
		if (selectedAssetId) {
			fetchAssetData();
		}
		return (): void => {
			setSelectedAssetData(null);
			setError(false);
			setLoading(true);
		};
	}, [selectedAssetId]);

	const onButtonClick = async (): Promise<void> => {
		setLoading(true);
		if (assetInMoodboard && !assetEntryId) {
			const primaryAssetId = selectedAssetId;
			Router.push(
				{ pathname: "/assetstore", query: { designId, assetEntryId: primaryAssetId, projectId } },
				`/assetstore/pid/${projectId}/did/${designId}/aeid/${primaryAssetId}`
			);
			await dispatch({ type: ASSET_ACTION_TYPES.SELECTED_ASSET, value: null });
		} else {
			await addRemoveAsset("ADD", selectedAssetId, assetEntryId);
			message.success(assetEntryId ? "Added Recommendation" : "Added Primary Asset");
		}
		setLoading(false);
	};

	const onRemoveClick = async (): Promise<void> => {
		setLoading(true);
		await addRemoveAsset("DELETE", selectedAssetId, assetEntryId);
		message.success(assetEntryId ? "Removed Recommendation" : "Removed Primary Asset");
		setLoading(false);
	};

	const closeDrawer = (): void => {
		setSelectedAssetId(null);
		setSelectedAssetData(null);
	};

	const buttonText = assetInMoodboard ? "Add Recommendations" : "Add to Design";

	const toggleImagePreviewModal = (): void => {
		setImagePreviewVisible(!imagePreviewVisible);
	};

	const pathToFile = getValueSafely(() => selectedAssetData.spatialData.fileUrls.glb, null);
	const typeOfFile = "glb";
	return (
		<GreyDrawer
			onClose={closeDrawer}
			width={360}
			visible={!!selectedAssetId}
			title={<SilentTitle level={4}>{getValueSafely<string>(() => selectedAssetData.name, "")}</SilentTitle>}
		>
			<FullheightSpin spinning={loading || dataLoading}>
				{error && (
					<Result
						status="500"
						title="Error"
						subTitle="Something went wrong"
						extra={
							<Row justify="center">
								<Col span={24}>
									<Button type="primary" onClick={closeDrawer}>
										Close
									</Button>
								</Col>
								<Col span={24}>Error Response</Col>
								<Col span={24}>
									<Paragraph copyable ellipsis={{ rows: 1, expandable: true }} code>
										{JSON.stringify(errorData)}
									</Paragraph>
								</Col>
							</Row>
						}
					/>
				)}
				{selectedAssetData && (
					<Row gutter={[0, 10]}>
						{pathToFile && (
							<Col span={24}>
								<Row justify="center" gutter={[0, 10]}>
									<Col span={24}>
										<Row gutter={[10, 0]}>
											<Col>
												<CodeSandboxOutlined />
											</Col>
											<Col>
												<Text type="secondary">Model</Text>
											</Col>
										</Row>
									</Col>
									<Col>
										<ModelViewer type={typeOfFile} pathToFile={pathToFile} />
									</Col>
								</Row>
							</Col>
						)}

						<Col span={24}>
							<Row justify="center" gutter={[0, 10]}>
								<Col span={24}>
									<Row gutter={[10, 0]}>
										<Col>
											<FileImageOutlined />
										</Col>
										<Col>
											<Text type="secondary">Image</Text>
										</Col>
									</Row>
								</Col>
								<Col>
									<ClickDiv onClick={toggleImagePreviewModal}>
										<Image
											width="100%"
											src={getValueSafely(
												() => selectedAssetData.cdn,
												process.env.NODE_ENV === "production"
													? "v1581080070/admin/productImagePlaceholder.jpg"
													: "v1581080111/admin/productImagePlaceholder.jpg"
											)}
										/>
									</ClickDiv>
								</Col>
							</Row>
						</Col>
						<Col span={24}>
							<Row align="middle" justify="space-between">
								<Col>
									<Row gutter={[10, 0]}>
										<Col>
											<DollarCircleFilled />
										</Col>
										<Col>
											<Text strong>{selectedAssetData.price}</Text>
										</Col>
									</Row>
								</Col>

								<Col>
									<Row gutter={[10, 0]}>
										<Col>
											<LinkOutlined />
										</Col>
										<Col>
											<Text type="secondary">
												<a
													target="_blank"
													rel="noopener noreferrer"
													href={getValueSafely(() => selectedAssetData.retailLink, "#")}
												>
													{getValueSafely(() => selectedAssetData.retailer.name, "N/A")}
												</a>
											</Text>
										</Col>
									</Row>
								</Col>
								<Col>
									<Button
										type="primary"
										icon={<EditOutlined />}
										onClick={(): void => {
											editAsset(selectedAssetData);
											setSelectedAssetId(null);
										}}
									/>
								</Col>
							</Row>
						</Col>
						<Col span={24}>
							<SilentDivider />
						</Col>
						<Col span={24}>
							<Row gutter={[0, 10]}>
								<Col>
									<Row gutter={[10, 0]}>
										<Col>
											<AlignLeftOutlined />
										</Col>
										<Col>
											<Text type="secondary">Description</Text>
										</Col>
									</Row>
								</Col>
								<Col>
									<Text>{getValueSafely(() => selectedAssetData.description, "No Description provided")}</Text>
								</Col>
							</Row>
						</Col>
						<Col span={24}>
							<SilentDivider />
						</Col>
						<Col span={24}>
							<Row gutter={[0, 10]}>
								<Col>
									<Row gutter={[10, 0]}>
										<Col>
											<DragOutlined />
										</Col>
										<Col>
											<Text type="secondary">Dimensions</Text>
										</Col>
									</Row>
								</Col>
								<Col>
									<Row justify="space-between" gutter={[0, 10]}>
										<Col>
											<Text strong>Width: </Text>
											<Text>
												{getValueSafely<string | number>(
													() => (selectedAssetData.dimension.width * 12).toFixed(2),
													"N/A"
												)}
												&#34;
											</Text>
										</Col>
										<Col>
											<Text strong>Height: </Text>
											<Text>
												{getValueSafely<string | number>(
													() => (selectedAssetData.dimension.height * 12).toFixed(2),
													"N/A"
												)}
												&#34;
											</Text>
										</Col>
										<Col>
											<Text strong>Depth: </Text>
											<Text>
												{getValueSafely<string | number>(
													() => (selectedAssetData.dimension.depth * 12).toFixed(2),
													"N/A"
												)}
												&#34;
											</Text>
										</Col>
									</Row>
								</Col>
							</Row>
						</Col>
						<Col span={24}>
							<SilentDivider />
						</Col>
						<Col span={24}>
							<Row gutter={[0, 10]}>
								<Col>
									<Row gutter={[10, 0]}>
										<Col>
											<BookOutlined />
										</Col>
										<Col>
											<Text type="secondary">Categorization</Text>
										</Col>
									</Row>
								</Col>
								<Col>
									<Row gutter={[0, 10]}>
										<Col>
											<Text strong>Category: </Text>
											<CapitalizedText>
												{getValueSafely(() => categoryMap[selectedAssetData.meta.category], "Undefined")}
											</CapitalizedText>
										</Col>
										<Col>
											<Text strong>Sub-Category: </Text>
											<CapitalizedText>
												{getValueSafely(() => subCategoryMap[selectedAssetData.meta.subcategory], "Undefined")}
											</CapitalizedText>
										</Col>
										<Col>
											<Text strong>Vertical: </Text>
											<CapitalizedText>
												{getValueSafely(() => verticalMap[selectedAssetData.meta.vertical], "Undefined")}
											</CapitalizedText>
										</Col>
										<Col>
											<Text strong>Theme: </Text>
											<CapitalizedText>
												{getValueSafely(() => themeIdToNameMap[selectedAssetData.meta.theme], "Undefined")}
											</CapitalizedText>
										</Col>
									</Row>
								</Col>
							</Row>
						</Col>
						<Col span={24}>
							<SilentDivider />
						</Col>

						<Col span={24}>
							<Row gutter={[0, 10]}>
								<Col>
									<Row gutter={[10, 0]}>
										<Col>
											<UserOutlined />
										</Col>
										<Col>
											<Text type="secondary">Metadata</Text>
										</Col>
									</Row>
								</Col>
								<Col>
									<Row gutter={[0, 10]}>
										<Col>
											<Text strong>Created by: </Text>
											<CapitalizedText>
												{getValueSafely(() => `${selectedAssetData.artist.profile.name}`, "Undefined")}
											</CapitalizedText>
										</Col>
										<Col>
											<Text strong>Created At: </Text>
											<CapitalizedText>
												{getValueSafely<string>(
													() => moment(selectedAssetData.createdAt).format("D-MMM-YYYY"),
													"Undefined"
												)}
											</CapitalizedText>
										</Col>
										<Col>
											<Text strong>Updated At: </Text>
											<CapitalizedText>
												{getValueSafely<string>(
													() => moment(selectedAssetData.updatedAt).format("D-MMM-YYYY"),
													"Undefined"
												)}
											</CapitalizedText>
										</Col>
									</Row>
								</Col>
							</Row>
						</Col>

						<Col span={24}>
							<SilentDivider />
						</Col>
						{designId && (
							<Col span={24}>
								<Row gutter={[0, 10]}>
									{assetInMoodboard && (
										<Col>
											<Popconfirm title="Are you sure?" onConfirm={onRemoveClick} okText="Yes" cancelText="Cancel">
												<Button block type="primary" danger>
													Remove Asset
												</Button>
											</Popconfirm>
										</Col>
									)}
									{!assetInMoodboard && assetEntryId && (
										<Col>
											<Button block type="primary" loading={loading} onClick={onButtonClick}>
												Add as Recommendation
											</Button>
										</Col>
									)}
									{!assetEntryId && (
										<Col>
											<Button block type="primary" loading={loading} onClick={onButtonClick}>
												{buttonText}
											</Button>
										</Col>
									)}
								</Row>
							</Col>
						)}
					</Row>
				)}
			</FullheightSpin>
			{selectedAssetData && (
				<ImageDisplayModal
					previewImage={getValueSafely(() => selectedAssetData.cdn, "")}
					previewVisible={imagePreviewVisible}
					handleCancel={toggleImagePreviewModal}
					altText={getValueSafely(() => selectedAssetData.name, "Product Image")}
					cdn
				/>
			)}
		</GreyDrawer>
	);
};

export default AssetDescriptionPanel;
