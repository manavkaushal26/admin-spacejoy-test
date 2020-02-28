import { getAssetApi } from "@api/designApi";
import Image from "@components/Image";
import { AssetType, MoodboardAsset } from "@customTypes/moodboardTypes";
import { AssetAction, AssetStoreState, ASSET_ACTION_TYPES } from "@sections/AssetStore/reducer";
import { ModifiedText, SilentDivider } from "@sections/Dashboard/styled";
import { debounce, getValueSafely } from "@utils/commonUtils";
import fetcher from "@utils/fetcher";
import { Col, Icon, Pagination, Row, Typography, Popconfirm, message, Tooltip } from "antd";
import React, { useEffect, useRef, useState, useMemo, ReactNode } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import AssetDescriptionPanel from "./AssetDescriptionPanel";
import ProductCard from "./ProductCard";
import { categoryIdNameMapper, subCategoryIdNameMapper, verticalIdNameMapper, isAssetInMoodboard } from "./utils";

const { Title, Text } = Typography;

interface AssetMainPanelProps {
	editAsset: (assetData: AssetType) => void;
	state: AssetStoreState;
	assetEntryId: string;
	addRemoveAsset: (action: "ADD" | "DELETE", assetId: string, assetEntryId?: string) => void;
	moodboard: MoodboardAsset[];
	designId: string;
	dispatch: React.Dispatch<AssetAction>;
	projectId: string;
	themeIdToNameMap: Record<string, string>;
}

interface FetchAndPopulate {
	(
		state: AssetStoreState,
		pageCount: number,
		setAssetData: React.Dispatch<React.SetStateAction<AssetType[]>>,
		setTotalCount: React.Dispatch<React.SetStateAction<number>>,
		dispatch: React.Dispatch<AssetAction>
	): Promise<void>;
}

const TopMarginTitle = styled(Title)<{ level: number }>`
	margin-top: 0.5em;
`;

const MainAssetPanel = styled.div`
	margin: 1rem auto;
	column-gap: 1rem;
	column-count: 4;

	/* The Masonry Brick */
	> * {
		display: inline-block;
		margin: 0 0 1rem;
		width: 100%;
	}

	/* Masonry on large screens */
	@media only screen and (min-width: 1024px) {
		column-count: 4;
	}

	/* Masonry on medium-sized screens */
	@media only screen and (max-width: 1023px) and (min-width: 768px) {
		column-count: 3;
	}

	/* Masonry on small screens */
	@media only screen and (max-width: 767px) {
		column-count: 2;
	}
`;

const fetchAndPopulate: FetchAndPopulate = async (state, pageCount, setAssetData, setTotalCount, dispatch) => {
	dispatch({ type: ASSET_ACTION_TYPES.LOADING_STATUS, value: true });
	const endPoint = getAssetApi();
	const queryParams = `?sort=-1&skip=${(pageCount - 1) * 35}&limit=35`;
	const responseData = await fetcher({
		endPoint: `/${endPoint}${queryParams}`,
		method: "POST",
		body: {
			data: {
				retailer: { search: "array", value: state.retailerFilter },
				name: { search: "single", value: state.searchText },
				"meta.category": { search: "array", value: state.checkedKeys.category },
				"meta.subcategory": { search: "array", value: state.checkedKeys.subCategory },
				"meta.vertical": { search: "array", value: state.checkedKeys.verticals },
				price: { search: "range", value: state.priceRange },
				"dimensions.depth": { search: "range", value: state.depthRange },
				"dimensions.width": { search: "range", value: state.widthRange },
				"dimensions.height": { search: "range", value: state.heightRange },
				status: { search: "array", value: state.status },
			},
		},
	});
	if (responseData.statusCode <= 300) {
		if (responseData.data.data) {
			setAssetData(responseData.data.data);
			setTotalCount(responseData.data.count);
		}
	}
	dispatch({ type: ASSET_ACTION_TYPES.LOADING_STATUS, value: false });
};

const debouncedFetchAsset = debounce(fetchAndPopulate, 500);

const AssetMainPanel: (props: AssetMainPanelProps) => JSX.Element = ({
	editAsset,
	state,
	addRemoveAsset,
	moodboard,
	designId,
	assetEntryId,
	dispatch,
	projectId,
	themeIdToNameMap,
}) => {
	const [assetData, setAssetData] = useState<AssetType[]>([]);
	const [selectedAssetData, setSelectedAssetData] = useState<AssetType>(null);
	const [pageCount, setPageCount] = useState<number>(1);
	const [totalCount, setTotalCount] = useState<number>(0);
	const [primaryAsset, setPrimaryAsset] = useState<Partial<AssetType>>(null);

	const onCardClick = (selectedProduct): void => {
		setSelectedAssetData(selectedProduct);
	};

	useEffect(() => {
		const aeid = assetEntryId;
		if (moodboard && aeid) {
			const asset = moodboard
				.filter(moodboardAsset => moodboardAsset.isExistingAsset)
				.find(moodboardAsset => {
					return moodboardAsset.asset._id === aeid;
				});
			setPrimaryAsset(asset.asset);
			dispatch({ type: ASSET_ACTION_TYPES.SUB_CATEGORY, value: asset.asset });
		}
		return (): void => {
			if (aeid === null) {
				setPrimaryAsset(null);
			}

			if (aeid !== assetEntryId) {
				dispatch({ type: ASSET_ACTION_TYPES.RESET_FILTERS, value: null });
			}
		};
	}, [assetEntryId, moodboard]);

	useEffect(() => {
		setPageCount(1);
	}, [
		state.searchText,
		state.checkedKeys.subCategory.length,
		state.checkedKeys.verticals.length,
		state.checkedKeys.category.length,
		state.retailerFilter.length,
		state.priceRange,
		state.widthRange,
		state.depthRange,
		state.heightRange,
		state.status.length,
	]);

	const scrollParentRef = useRef();

	useEffect(() => {
		debouncedFetchAsset(state, pageCount, setAssetData, setTotalCount, dispatch);
	}, [
		state.searchText,
		state.checkedKeys.subCategory,
		state.checkedKeys.verticals,
		state.checkedKeys.category,
		state.retailerFilter,
		state.priceRange,
		state.widthRange,
		state.depthRange,
		state.status.length,
		state.heightRange,
		pageCount,
	]);
	const Router = useRouter();

	const categoryMap = useMemo(() => {
		return categoryIdNameMapper(state.metaData);
	}, [state.metaData]);

	const subCategoryMap = useMemo(() => {
		return subCategoryIdNameMapper(state.metaData);
	}, [state.metaData]);
	const verticalMap = useMemo(() => {
		return verticalIdNameMapper(state.metaData);
	}, [state.metaData]);

	const onButtonClick = async (assetId: string, assetInMoodboard: boolean): Promise<void> => {
		dispatch({ type: ASSET_ACTION_TYPES.LOADING_STATUS, value: true });
		if (assetInMoodboard && !assetEntryId) {
			const primaryAssetId = assetId;
			Router.push(
				{ pathname: "/assetstore", query: { designId, assetEntryId: primaryAssetId, projectId } },
				`/assetstore/pid/${projectId}/did/${designId}/aeid/${primaryAssetId}`
			);
			await dispatch({ type: ASSET_ACTION_TYPES.SELECTED_ASSET, value: null });
		} else {
			await addRemoveAsset("ADD", assetId, assetEntryId);
			message.success(assetEntryId ? "Added Recommendation" : "Added Primary Asset");
		}
		dispatch({ type: ASSET_ACTION_TYPES.LOADING_STATUS, value: false });
	};

	const onRemoveClick = async (assetId: string): Promise<void> => {
		dispatch({ type: ASSET_ACTION_TYPES.LOADING_STATUS, value: true });

		await addRemoveAsset("DELETE", assetId, assetEntryId);
		message.success(assetEntryId ? "Removed Recommendation" : "Removed Primary Asset");
		dispatch({ type: ASSET_ACTION_TYPES.LOADING_STATUS, value: false });
	};

	const getActions = (assetId: string, assetInMoodboard: boolean): ReactNode[] => {
		const actionButtons: ReactNode[] = [];
		if (assetInMoodboard) {
			actionButtons.push(
				<Popconfirm
					title="Are you sure?"
					onConfirm={(e): void => {
						e.stopPropagation();
						onRemoveClick(assetId);
					}}
					okText="Yes"
					cancelText="Cancel"
				>
					<Icon onClick={(e): void => e.stopPropagation()} type="delete" />
				</Popconfirm>
			);
		}

		if (!assetInMoodboard) {
			actionButtons.push(
				<Tooltip title="Add">
					<Icon
						onClick={(e): void => {
							e.stopPropagation();
							onButtonClick(assetId, assetInMoodboard);
						}}
						type="plus"
					/>
				</Tooltip>
			);
		}

		if (assetInMoodboard && !assetEntryId) {
			actionButtons.push(
				<Tooltip title="Add Recommendations">
					<Icon
						type="cluster"
						onClick={(e): void => {
							e.stopPropagation();
							onButtonClick(assetId, assetInMoodboard);
						}}
					/>
				</Tooltip>
			);
		}

		return actionButtons;
	};

	return (
		<Row gutter={[12, 12]}>
			{projectId && (
				<Col span={24}>
					<TopMarginTitle level={3}>
						{assetEntryId ? "Recommendation Selection" : "Primary product selection"}
					</TopMarginTitle>
				</Col>
			)}
			<Col span={24}>
				<SilentDivider />
			</Col>
			{primaryAsset && (
				<Col span={24}>
					<Row>
						<Col>
							<Title level={4}>Primary Asset</Title>
						</Col>
						<Col>
							<Row type="flex" gutter={[12, 12]}>
								<Col>
									<Image height="200px" src={primaryAsset.cdn} />
								</Col>
								<Col>
									<Row>
										<Col>
											<Row type="flex" gutter={[8, 0]}>
												<Col>
													<Text strong>Name:</Text>
												</Col>
												<Col>
													<ModifiedText textTransform="capitalize" type="secondary">
														{primaryAsset.name}
													</ModifiedText>
												</Col>
											</Row>
										</Col>
										<Col>
											<Row type="flex" gutter={[8, 0]}>
												<Col>
													<Icon type="dollar-circle" theme="filled" />
												</Col>
												<Col>
													<Text strong>{primaryAsset.price}</Text>
												</Col>
											</Row>
										</Col>
										<Col>
											<Row type="flex" gutter={[8, 0]}>
												<Col>
													<Icon type="link" />
												</Col>
												<Col>
													<Text type="secondary">
														<a
															target="_blank"
															rel="noopener noreferrer"
															href={getValueSafely(() => primaryAsset.retailLink, "#")}
														>
															{getValueSafely(() => primaryAsset.retailer.name, "N/A")}
														</a>
													</Text>
												</Col>
											</Row>
										</Col>
									</Row>
								</Col>
							</Row>
						</Col>
					</Row>
				</Col>
			)}
			<Col span={24}>
				<SilentDivider />
			</Col>
			<Col span={24}>
				<MainAssetPanel ref={scrollParentRef}>
					{assetData.map(asset => {
						const assetInMoodboard = isAssetInMoodboard(moodboard, asset._id, assetEntryId);
						return (
							<ProductCard
								actions={projectId ? getActions(asset._id, assetInMoodboard) : []}
								verticalMap={verticalMap}
								key={asset._id}
								asset={asset}
								onCardClick={onCardClick}
							/>
						);
					})}
				</MainAssetPanel>
			</Col>
			<Col span={24}>
				<Row type="flex" gutter={[10, 10]} justify="center">
					<Col>
						<Pagination
							current={pageCount}
							defaultPageSize={35}
							hideOnSinglePage
							total={totalCount}
							onChange={(page): void => setPageCount(page)}
						/>
					</Col>
				</Row>
			</Col>
			<AssetDescriptionPanel
				themeIdToNameMap={themeIdToNameMap}
				editAsset={editAsset}
				dataLoading={state.loading}
				dispatch={dispatch}
				projectId={projectId}
				assetEntryId={assetEntryId}
				selectedAssetData={selectedAssetData}
				setSelectedAssetData={setSelectedAssetData}
				categoryMap={categoryMap}
				verticalMap={verticalMap}
				subCategoryMap={subCategoryMap}
				designId={designId}
				moodboard={moodboard}
				addRemoveAsset={addRemoveAsset}
			/>
		</Row>
	);
};

export default AssetMainPanel;
