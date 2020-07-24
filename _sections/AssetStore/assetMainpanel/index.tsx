import { ClusterOutlined, DeleteOutlined, DollarCircleFilled, LinkOutlined, PlusOutlined } from "@ant-design/icons";
import { getAssetElasticSearchApi } from "@api/designApi";
import Image from "@components/Image";
import { AssetStoreSearchResponse, AssetType, MoodboardAsset } from "@customTypes/moodboardTypes";
import { AssetAction, AssetStoreState, ASSET_ACTION_TYPES } from "@sections/AssetStore/reducer";
import { ModifiedText, SilentDivider } from "@sections/Dashboard/styled";
import { debounce, getValueSafely } from "@utils/commonUtils";
import fetcher from "@utils/fetcher";
import { Col, message, Pagination, Popconfirm, Row, Tooltip, Typography } from "antd";
import { useRouter } from "next/router";
import React, { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import AssetDescriptionPanel from "./AssetDescriptionPanel";
import ProductCard from "./ProductCard";
import { categoryIdNameMapper, isAssetInMoodboard, subCategoryIdNameMapper, verticalIdNameMapper } from "./utils";

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

const fetchAndPopulate: FetchAndPopulate = async (state, pageCount, setAssetData, setTotalCount, dispatch) => {
	dispatch({ type: ASSET_ACTION_TYPES.LOADING_STATUS, value: true });
	const endPoint = getAssetElasticSearchApi();
	const queryParams = `?skip=${(pageCount - 1) * 36}&limit=36`;
	const responseData = await fetcher({
		endPoint: `/${endPoint}${queryParams}`,
		method: "POST",
		body: {
			searchText: state.searchText,
			sort: "createdAt",
			filters: {
				retailer: state.retailerFilter,
				category: state.checkedKeys.category,
				subcategory: state.checkedKeys.subCategory,
				vertical: state.checkedKeys.verticals,
				price: state.priceRange,
				depth: state.depthRange,
				width: state.widthRange,
				height: state.heightRange,
				status: state.status,
			},
		},
	});

	if (responseData.statusCode <= 300) {
		if (responseData.data.hits) {
			const assetData: AssetType[] = responseData.data.hits.map((asset: AssetStoreSearchResponse) => {
				return {
					name: asset.name,
					price: asset.price,
					currency: asset.currency,
					description: asset.description,
					retailer: {
						_id: "",
						name: asset.retailer,
					},
					status: asset.status,
					shoppable: asset.shoppable,
					spatialData: {
						mountType: asset.mountType,
						clampValue: asset.clampValue,
					},
					dimension: {
						depth: asset.depth,
						width: asset.width,
						height: asset.height,
					},
					meta: {
						category: asset.category,
						subcategory: asset.subcategory,
						vertical: asset.vertical,
						theme: asset.theme,
					},
					retailLink: asset.retailLink,
					cdn: asset.cdn,
					_id: asset._id,
					imageUrl: asset.imageUrl,
					artist: {
						_id: "",
						profile: {
							firstName: getValueSafely(() => asset.artist.split(" ")[0], ""),
							lastName: getValueSafely(() => asset.artist.split(" ")[1], ""),
						},
						name: asset.artist,
					},
					tags: asset.tags,
					createdAt: asset.createdAt,
					updatedAt: asset.updatedAt,
				};
			});
			setAssetData(assetData);
			setTotalCount(responseData.data.total);
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
	const [selectedAssetId, setSelectedAssetId] = useState<string>(null);
	const [pageCount, setPageCount] = useState<number>(1);
	const [totalCount, setTotalCount] = useState<number>(0);
	const [primaryAsset, setPrimaryAsset] = useState<Partial<AssetType>>(null);

	const onCardClick = (selectedId): void => {
		setSelectedAssetId(selectedId);
	};

	const subCategoryMap = useMemo(() => {
		return subCategoryIdNameMapper(state.metaData);
	}, [state.metaData]);

	useEffect(() => {
		const aeid = assetEntryId;
		if (moodboard && aeid) {
			const asset = moodboard
				.filter(moodboardAsset => moodboardAsset.isExistingAsset)
				.find(moodboardAsset => {
					return moodboardAsset.asset._id === aeid;
				});
			setPrimaryAsset(asset.asset);
			dispatch({
				type: ASSET_ACTION_TYPES.SUB_CATEGORY,
				value: subCategoryMap[getValueSafely(() => asset.asset.meta.subcategory, "")],
			});
		}
		return (): void => {
			if (aeid === null) {
				setPrimaryAsset(null);
			}

			if (aeid !== assetEntryId) {
				dispatch({ type: ASSET_ACTION_TYPES.RESET_FILTERS, value: null });
			}
		};
	}, [assetEntryId, moodboard, state.metaData]);

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

	const verticalMap = useMemo(() => {
		return verticalIdNameMapper(state.metaData);
	}, [state.metaData]);

	const onButtonClick = async (assetId: string, assetInMoodboard: boolean): Promise<void> => {
		dispatch({ type: ASSET_ACTION_TYPES.LOADING_STATUS, value: true });
		if (assetInMoodboard && !assetEntryId) {
			const primaryAssetId = assetId;
			Router.push(
				{
					pathname: "/assetstore",
					query: { designId, assetEntryId: primaryAssetId, projectId },
				},
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
					title='Are you sure?'
					onConfirm={(e): void => {
						e.stopPropagation();
						onRemoveClick(assetId);
					}}
					okText='Yes'
					cancelText='Cancel'
				>
					<DeleteOutlined onClick={(e): void => e.stopPropagation()} />
				</Popconfirm>
			);
		}

		if (!assetInMoodboard) {
			actionButtons.push(
				<Tooltip title='Add'>
					<PlusOutlined
						onClick={(e): void => {
							e.stopPropagation();
							onButtonClick(assetId, assetInMoodboard);
						}}
					/>
				</Tooltip>
			);
		}

		if (assetInMoodboard && !assetEntryId) {
			actionButtons.push(
				<Tooltip title='Add Recommendations'>
					<ClusterOutlined
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
				<>
					<Col span={24}>
						<TopMarginTitle level={3}>
							{assetEntryId ? "Recommendation Selection" : "Primary product selection"}
						</TopMarginTitle>
					</Col>
					<Col span={24}>
						<SilentDivider />
					</Col>
				</>
			)}

			{primaryAsset && (
				<>
					<Col span={24}>
						<Row>
							<Col span={24}>
								<Title level={4}>Primary Asset</Title>
							</Col>
							<Col>
								<Row gutter={[12, 12]}>
									<Col>
										<Image height='200px' src={primaryAsset.cdn} />
									</Col>
									<Col>
										<Row gutter={[4, 4]}>
											<Col span={24}>
												<Row gutter={[8, 0]}>
													<Col>
														<Text strong>Name:</Text>
													</Col>
													<Col>
														<ModifiedText textTransform='capitalize' type='secondary'>
															{primaryAsset.name}
														</ModifiedText>
													</Col>
												</Row>
											</Col>
											<Col span={24}>
												<Row gutter={[8, 0]}>
													<Col>
														<DollarCircleFilled />
													</Col>
													<Col>
														<Text strong>{primaryAsset.price}</Text>
													</Col>
												</Row>
											</Col>
											<Col span={24}>
												<Row gutter={[8, 0]}>
													<Col>
														<LinkOutlined />
													</Col>
													<Col>
														<Text type='secondary'>
															<a
																target='_blank'
																rel='noopener noreferrer'
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
					<Col span={24}>
						<SilentDivider />
					</Col>
				</>
			)}

			<Col span={24}>
				<Row ref={scrollParentRef} gutter={[8, 8]}>
					{assetData.map(asset => {
						const assetInMoodboard = isAssetInMoodboard(moodboard, asset._id, assetEntryId);
						return (
							<Col sm={12} key={asset._id} md={8} lg={6}>
								<ProductCard
									actions={projectId ? getActions(asset._id, assetInMoodboard) : []}
									verticalMap={verticalMap}
									asset={asset}
									onCardClick={onCardClick}
								/>
							</Col>
						);
					})}
				</Row>
			</Col>
			<Col span={24}>
				<Row gutter={[10, 10]} justify='center'>
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
				selectedAssetId={selectedAssetId}
				setSelectedAssetId={setSelectedAssetId}
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
