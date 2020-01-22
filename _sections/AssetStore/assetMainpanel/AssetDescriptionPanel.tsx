import { uploadAssetModel } from "@api/designApi";
import Image from "@components/Image";
import { MoodboardAsset, AssetType } from "@customTypes/moodboardTypes";
import { AssetAction, ASSET_ACTION_TYPES } from "@sections/AssetStore/reducer";
import { SilentDivider } from "@sections/Dashboard/styled";
import { getValueSafely } from "@utils/commonUtils";
import { Button, Icon, message, Popconfirm, Typography, Upload, Row, Col } from "antd";
import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import getCookie from "@utils/getCookie";
import { cookieNames } from "@utils/config";
import { ModelToExtensionMap } from "@customTypes/dashboardTypes";
import { UploadFile, UploadChangeParam } from "antd/lib/upload/interface";
import ImageDisplayModal from "@components/ImageDisplayModal";
import { FullheightSpin, GreyDrawer, CapitalizedText } from "../styled";

const { Title, Text } = Typography;

interface AssetDescriptionPanelProps {
	addRemoveAsset: (action: "ADD" | "DELETE", assetId: string, assetEntryId?: string) => void;
	moodboard: MoodboardAsset[];
	designId: string;
	assetEntryId: string;
	selectedAssetData: AssetType;
	setSelectedAssetData: React.Dispatch<React.SetStateAction<AssetType>>;
	projectId: string;
	dispatch: React.Dispatch<AssetAction>;
	dataLoading: boolean;
	verticalMap?: Record<string, string>;
	categoryMap?: Record<string, string>;
	subCategoryMap?: Record<string, string>;
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
	selectedAssetData,
	setSelectedAssetData,
	projectId,
	dispatch,
	dataLoading,
	verticalMap,
	categoryMap,
	subCategoryMap,
}) => {
	const [assetFile, setAssetFile] = useState<UploadFile<any>[]>([]);

	const [loading, setLoading] = useState<boolean>(true);

	const assetId = getValueSafely(() => selectedAssetData._id, "");

	const [imagePreviewVisible, setImagePreviewVisible] = useState<boolean>(false);

	const moodboardAssetIdMap = useMemo(() => {
		setLoading(true);
		if (moodboard) {
			if (assetEntryId) {
				setLoading(false);
				return moodboard
					.filter(asset => asset.isExistingAsset)
					.find(elem => {
						return elem.asset._id === assetEntryId;
					})
					.recommendations.reduce((acc, currRecommendation) => {
						return { ...acc, [currRecommendation._id]: currRecommendation._id };
					}, {});
			}
			setLoading(false);
			return moodboard
				.filter(asset => asset.isExistingAsset)
				.reduce((acc, currAsset) => {
					return { ...acc, [currAsset.asset._id]: currAsset.asset._id };
				}, {});
		}
		setLoading(false);
		return {};
	}, [moodboard, assetEntryId]);

	const handleOnFileUploadChange = (info: UploadChangeParam<UploadFile>): void => {
		let fileList = [...info.fileList];

		fileList = fileList.slice(-1);
		// 1. Limit the number of uploaded files
		// Only to show one recent uploaded files, and old ones will be replaced by the new
		setAssetFile(fileList);
	};
	const Router = useRouter();
	const assetInMoodboard = !!moodboardAssetIdMap[assetId];
	const onButtonClick = async (): Promise<void> => {
		setLoading(true);
		if (assetInMoodboard && !assetEntryId) {
			const primaryAssetId = moodboardAssetIdMap[assetId];
			Router.push(
				{ pathname: "/assetstore", query: { designId, assetEntryId: primaryAssetId, projectId } },
				`/assetstore/pid/${projectId}/did/${designId}/aeid/${primaryAssetId}`
			);
			await dispatch({ type: ASSET_ACTION_TYPES.SELECTED_ASSET, value: null });
		} else {
			await addRemoveAsset("ADD", assetId, assetEntryId);
			message.success(assetEntryId ? "Added Recommendation" : "Added Primary Asset");
		}
		setLoading(false);
	};

	const onRemoveClick = async (): Promise<void> => {
		setLoading(true);
		await addRemoveAsset("DELETE", moodboardAssetIdMap[assetId], assetEntryId);
		message.success(assetEntryId ? "Removed Recommendation" : "Removed Primary Asset");
		setLoading(false);
	};

	const closeDrawer = (): void => {
		setSelectedAssetData(null);
	};

	const buttonText = assetInMoodboard ? "Add Recommendations" : "Add to Design";

	const uploadModelEndpoint = uploadAssetModel(assetId);

	const toggleImagePreviewModal = (): void => {
		setImagePreviewVisible(!imagePreviewVisible);
	};

	return (
		<GreyDrawer
			onClose={closeDrawer}
			width={360}
			visible={!!selectedAssetData}
			title={<SilentTitle level={4}>{getValueSafely<string>(() => selectedAssetData.name, "")}</SilentTitle>}
		>
			<FullheightSpin spinning={loading || dataLoading}>
				{selectedAssetData && (
					<Row gutter={[0, 10]}>
						<Col span={24}>
							<Row type="flex" justify="center">
								<ClickDiv onClick={toggleImagePreviewModal}>
									<Image width="100%" src={`${selectedAssetData.cdn}`} />
								</ClickDiv>
							</Row>
						</Col>
						<Col span={24}>
							<Row type="flex" justify="space-between">
								<Col>
									<Row type="flex" gutter={[10, 0]}>
										<Col>
											<Icon type="dollar-circle" theme="filled" />
										</Col>
										<Col>
											<Text strong>{selectedAssetData.price}</Text>
										</Col>
									</Row>
								</Col>
								<Col>
									<Row type="flex" gutter={[10, 0]}>
										<Col>
											<Icon type="link" />
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
							</Row>
						</Col>
						<Col span={24}>
							<SilentDivider />
						</Col>
						<Col span={24}>
							<Row gutter={[0, 10]}>
								<Col>
									<Row type="flex" gutter={[10, 0]}>
										<Col>
											<Icon type="drag" />
										</Col>
										<Col>
											<Text type="secondary">Dimensions</Text>
										</Col>
									</Row>
								</Col>
								<Col>
									<Row type="flex" justify="space-between" gutter={[0, 10]}>
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
									<Row type="flex" gutter={[10, 0]}>
										<Col>
											<Icon type="book" />
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
									</Row>
								</Col>
							</Row>
						</Col>
						<Col span={24}>
							<SilentDivider />
						</Col>

						{projectId ? (
							<Col span={24}>
								<Row gutter={[0, 10]}>
									{assetInMoodboard && (
										<Col>
											<Popconfirm title="Are you sure?" onConfirm={onRemoveClick} okText="Yes" cancelText="Cancel">
												<Button block type="danger">
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
						) : (
							<Col span={24}>
								<Upload
									supportServerRender
									name="file"
									fileList={assetFile}
									action={uploadModelEndpoint}
									onRemove={(): false => false}
									onChange={(info): void => handleOnFileUploadChange(info)}
									headers={{ Authorization: getCookie(null, cookieNames.authToken) }}
									accept={ModelToExtensionMap.glb}
								>
									<Button>
										<Icon type="upload" />
										Click to Upload
									</Button>
								</Upload>
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
