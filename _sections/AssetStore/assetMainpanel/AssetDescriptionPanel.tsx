import {
	AlignLeftOutlined,
	BookOutlined,
	CodeSandboxOutlined,
	DollarCircleFilled,
	DragOutlined,
	EditOutlined,
	FileImageOutlined,
	HeatMapOutlined,
	LinkOutlined,
	UserOutlined,
} from "@ant-design/icons";
import { getSingleAssetApi } from "@api/designApi";
import { CapitalizedText } from "@components/CommonStyledComponents";
import Image from "@components/Image";
import { AssetType, MetaDescriptiveType, MoodboardAsset } from "@customTypes/moodboardTypes";
import { ASSET_ACTION_TYPES, AssetAction } from "@sections/AssetStore/reducer";
import { SilentDivider } from "@sections/Dashboard/styled";
import { getValueSafely } from "@utils/commonUtils";
import fetcher from "@utils/fetcher";
import { Button, Col, Popconfirm, Result, Row, Skeleton, Typography, message, notification } from "antd";
import moment from "moment-timezone";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { FullheightSpin, GreyDrawer } from "../styled";
import AssetHistoryDrawer from "./AssetHistoryDrawer";
import { isAssetInMoodboard } from "./utils";

const { Title, Text, Paragraph } = Typography;

const DynamicModelViewer = dynamic(() => import("@components/ModelViewer"), {
	loading: function placeholder() {
		return <Skeleton avatar={false} />;
	},
});

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
	themeIdToNameMap: Record<string, string>;
}

const SilentTitle = styled(Title)`
	text-transform: capitalize;
	margin-bottom: 0 !important;
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
	const Router = useRouter();
	const assetInMoodboard = useMemo(
		() => isAssetInMoodboard(moodboard, selectedAssetId, assetEntryId),
		[selectedAssetId, moodboard, assetEntryId]
	);

	// const { scrapedData, triggerScraping, scraping, error: scrapingError } = useScraper(
	// 	selectedAssetId,
	// 	[selectedAssetId],
	// 	true
	// );

	// useEffect(() => {
	// 	if (scraping) notification.info({ message: "Scraping Products data. This may take a minute" });
	// }, [scraping]);

	// useEffect(() => {
	// 	if (scrapingError) notification.error({ message: "Failed to scrape Data" });
	// }, [scrapingError]);

	const [historyOpen, setHistoryOpen] = useState(false);

	const toggleHistory = () => {
		setHistoryOpen(prevState => !prevState);
	};

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
					category: getValueSafely(() => category, "Undefined"),
					subcategory: getValueSafely(() => subcategory, "Undefined"),
					vertical: getValueSafely(() => vertical, "Undefined"),
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
						status='500'
						title='Error'
						subTitle='Something went wrong'
						extra={
							<Row justify='center'>
								<Col span={24}>
									<Button type='primary' onClick={closeDrawer}>
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
					<Row gutter={[8, 8]}>
						{pathToFile && (
							<Col span={24}>
								<Row justify='center' gutter={[8, 8]}>
									<Col span={24}>
										<Row gutter={[8, 8]}>
											<Col>
												<CodeSandboxOutlined />
											</Col>
											<Col>
												<Text type='secondary'>Model</Text>
											</Col>
										</Row>
									</Col>
									<Col>
										<DynamicModelViewer type={typeOfFile} pathToFile={pathToFile} />
									</Col>
								</Row>
							</Col>
						)}

						<Col span={24}>
							<Row justify='center' gutter={[8, 8]}>
								<Col span={24}>
									<Row gutter={[8, 8]}>
										<Col>
											<FileImageOutlined />
										</Col>
										<Col>
											<Text type='secondary'>Image</Text>
										</Col>
									</Row>
								</Col>
								<Col>
									<Image
										width='100%'
										//w_400,c_pad/
										src={`${getValueSafely(
											() =>
												selectedAssetData?.productImages?.length !== 0
													? selectedAssetData?.productImages[0].cdn
													: selectedAssetData.cdn,
											"v1581080070/admin/productImagePlaceholder.jpg"
										)}`}
										preview
									/>
								</Col>
							</Row>
						</Col>
						<Col span={24}>
							<Row align='middle' justify='space-between'>
								<Col>
									<Row gutter={[8, 8]}>
										<Col>
											<DollarCircleFilled />
										</Col>
										<Col>
											<Text strong>{selectedAssetData.price}</Text>
										</Col>
									</Row>
								</Col>

								<Col>
									<Row gutter={[8, 8]}>
										<Col>
											<LinkOutlined />
										</Col>
										<Col>
											<Text type='secondary'>
												<a
													target='_blank'
													rel='noopener noreferrer'
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
										type='primary'
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
							<Row gutter={[8, 8]} justify='space-between'>
								<Col span={24}>
									<Row justify='space-between' align='top'>
										<Col>
											<Row gutter={[8, 8]}>
												<Col>
													<HeatMapOutlined />
												</Col>
												<Col>
													<Text type='secondary'>Scraped data</Text>
												</Col>
											</Row>
										</Col>
									</Row>
								</Col>
								{/* <Col span={24}>
									<Row gutter={[8, 8]}>
										<Col>
											<Text strong>Current Price:</Text>
										</Col>
										<Col>
											<Text>
												{scrapedData ? (
													<PriceData scrapedData={scrapedData[selectedAssetData?._id]} />
												) : (
													"Not Scraped Yet"
												)}
											</Text>
										</Col>
									</Row>
								</Col>
								 */}
								<Col>
									<Row gutter={[8, 8]}>
										<Col>
											<Text strong>Availability score</Text>:
										</Col>

										<Col>
											<Text>{selectedAssetData?.scraper?.availabilityScore}</Text>
										</Col>
									</Row>
								</Col>
							</Row>
						</Col>

						<Col span={24}>
							<SilentDivider />
						</Col>
						<Col span={24}>
							<Row gutter={[8, 8]}>
								<Col span={24}>
									<Row gutter={[8, 8]}>
										<Col>
											<AlignLeftOutlined />
										</Col>
										<Col>
											<Text type='secondary'>Description</Text>
										</Col>
									</Row>
								</Col>
								<Col span={24}>
									<Text>{getValueSafely(() => selectedAssetData.description, "No Description provided")}</Text>
								</Col>
							</Row>
						</Col>
						<Col span={24}>
							<SilentDivider />
						</Col>
						<Col span={24}>
							<Row gutter={[8, 8]}>
								<Col>
									<Row gutter={[8, 8]}>
										<Col>
											<DragOutlined />
										</Col>
										<Col>
											<Text type='secondary'>Dimensions</Text>
										</Col>
									</Row>
								</Col>
								<Col>
									<Row justify='space-between' gutter={[10, 10]}>
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
							<Row gutter={[8, 8]}>
								<Col span={24}>
									<Row gutter={[8, 8]}>
										<Col>
											<BookOutlined />
										</Col>
										<Col>
											<Text type='secondary'>Categorization</Text>
										</Col>
									</Row>
								</Col>
								<Col>
									<Row gutter={[8, 8]}>
										<Col span={24}>
											<Text strong>Category: </Text>
											<CapitalizedText>
												{getValueSafely(
													() => (selectedAssetData.meta.category as MetaDescriptiveType)?.name,
													"Undefined"
												)}
											</CapitalizedText>
										</Col>
										<Col span={24}>
											<Text strong>Sub-Category: </Text>
											<CapitalizedText>
												{getValueSafely(
													() => (selectedAssetData.meta.subcategory as MetaDescriptiveType)?.name,
													"Undefined"
												)}
											</CapitalizedText>
										</Col>
										<Col span={24}>
											<Text strong>Vertical: </Text>
											<CapitalizedText>
												{getValueSafely(
													() => (selectedAssetData.meta.vertical as MetaDescriptiveType)?.name,
													"Undefined"
												)}
											</CapitalizedText>
										</Col>
										<Col span={24}>
											<Text strong>Theme: </Text>
											<CapitalizedText>
												{getValueSafely(() => themeIdToNameMap[selectedAssetData.meta.theme as string], "Undefined")}
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
							<Row gutter={[0, 8]}>
								<Col span={24}>
									<Row gutter={[8, 0]} align='middle' justify='space-between'>
										<Col>
											<Row gutter={[8, 0]}>
												<Col>
													<UserOutlined />
												</Col>
												<Col>
													<Text type='secondary'>Metadata</Text>
												</Col>
											</Row>
										</Col>
										<Col flex='auto'>
											<Row justify='end'>
												<Button onClick={toggleHistory} type='link'>
													See history
												</Button>
											</Row>
										</Col>
									</Row>
								</Col>
								<Col span={24}>
									<Row gutter={[8, 8]}>
										<Col span={24}>
											<Text strong>Created by: </Text>
											<CapitalizedText>
												{getValueSafely(() => `${selectedAssetData.artist.profile.name}`, "Undefined")}
											</CapitalizedText>
										</Col>
										<Col span={24}>
											<Text strong>Created At: </Text>
											<CapitalizedText>
												{getValueSafely<string>(
													() => moment(selectedAssetData.createdAt).format("D-MMM-YYYY"),
													"Undefined"
												)}
											</CapitalizedText>
										</Col>
										<Col span={24}>
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
								<Row gutter={[8, 8]}>
									{assetInMoodboard && (
										<Col>
											<Popconfirm title='Are you sure?' onConfirm={onRemoveClick} okText='Yes' cancelText='Cancel'>
												<Button block type='primary' danger>
													Remove Asset
												</Button>
											</Popconfirm>
										</Col>
									)}
									{!assetInMoodboard && assetEntryId && (
										<Col>
											<Button block type='primary' loading={loading} onClick={onButtonClick}>
												Add as Recommendation
											</Button>
										</Col>
									)}
									{!assetEntryId && (
										<Col>
											<Button block type='primary' loading={loading} onClick={onButtonClick}>
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
			<AssetHistoryDrawer assetId={selectedAssetId} open={historyOpen} closeModal={toggleHistory} />
		</GreyDrawer>
	);
};

export default AssetDescriptionPanel;
