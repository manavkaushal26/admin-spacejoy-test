import { getAssetApi } from "@api/designApi";
import Image from "@components/Image";
import { AssetType, MoodboardAsset } from "@customTypes/moodboardTypes";
import { AssetAction, AssetStoreState, ASSET_ACTION_TYPES } from "@sections/AssetStore/reducer";
import { CustomDiv, FontCorrectedPre, ModifiedText, SilentDivider } from "@sections/Dashboard/styled";
import { debounce } from "@utils/commonUtils";
import fetcher from "@utils/fetcher";
import { Col, Icon, Pagination, Row, Typography } from "antd";
import React, { useEffect, useRef, useState, useMemo } from "react";
import styled from "styled-components";
import AssetDescriptionPanel from "./AssetDescriptionPanel";
import ProductCard from "./ProductCard";

const { Title, Text } = Typography;

interface AssetMainPanelProps {
	state: AssetStoreState;
	assetEntryId: string;
	addRemoveAsset: (action: "ADD" | "DELETE", assetId: string, assetEntryId?: string) => void;
	moodboard: MoodboardAsset[];
	designId: string;
	dispatch: React.Dispatch<AssetAction>;
	projectId: string;
}

interface FetchAndPopulate {
	(
		state: AssetStoreState,
		pageCount: number,
		setAssetData: React.Dispatch<React.SetStateAction<AssetType[]>>,
		setTotalCount: React.Dispatch<React.SetStateAction<number>>,
		dispatch: React.Dispatch<AssetAction>,
		setHasMore: React.Dispatch<React.SetStateAction<boolean>>
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
	@media only screen and (max-width: 767px) and (min-width: 540px) {
		column-count: 2;
	}
`;

const fetchAndPopulate: FetchAndPopulate = async (
	state,
	pageCount,
	setAssetData,
	setTotalCount,
	dispatch,
	setHasMore
) => {
	dispatch({ type: ASSET_ACTION_TYPES.LOADING_STATUS, value: true });
	const endPoint = getAssetApi();
	const queryParams = `?skip=${(pageCount - 1) * 35}&limit=35`;
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
			},
		},
	});
	if (responseData.statusCode <= 300) {
		if (responseData.data.data) {
			if (responseData.data.data.length) {
				setAssetData(responseData.data.data);
				setTotalCount(responseData.data.count);
			} else {
				setHasMore(false);
			}
		}
	}
	dispatch({ type: ASSET_ACTION_TYPES.LOADING_STATUS, value: false });
};

const debouncedFetchAsset = debounce(fetchAndPopulate, 500);

const AssetMainPanel: (props: AssetMainPanelProps) => JSX.Element = ({
	state,
	addRemoveAsset,
	moodboard,
	designId,
	assetEntryId,
	dispatch,
	projectId,
}) => {
	const [assetData, setAssetData] = useState<AssetType[]>([]);
	const [selectedAssetData, setSelectedAssetData] = useState<AssetType>(null);
	const [pageCount, setPageCount] = useState<number>(1);
	const [totalCount, setTotalCount] = useState<number>(0);
	const [primaryAsset, setPrimaryAsset] = useState<Partial<AssetType>>(null);

	const onCardClick = (selectedProduct): void => {
		console.log("selectedProduct", selectedProduct);
		setSelectedAssetData(selectedProduct);
	};

	useEffect(() => {
		if (moodboard && assetEntryId) {
			const asset = moodboard
				.filter(moodboardAsset => moodboardAsset.isExistingAsset)
				.find(moodboardAsset => {
					return moodboardAsset.asset._id === assetEntryId;
				});
			setPrimaryAsset(asset.asset);
			dispatch({ type: ASSET_ACTION_TYPES.SUB_CATEGORY, value: asset.asset });
		}
		return (): void => {
			setPrimaryAsset(null);
			dispatch({ type: ASSET_ACTION_TYPES.RESET_FILTERS, value: null });
		};
	}, [assetEntryId]);

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
		state.heightRange,
		pageCount,
	]);

	const categoryMap = useMemo(() => {
		if (state.metaData) {
			return state.metaData.categories.list.reduce((acc, category) => ({ ...acc, [category._id]: category.name }), {});
		}
		return {};
	}, [state.metaData]);

	const subCategoryMap = useMemo(() => {
		if (state.metaData) {
			return state.metaData.subcategories.list.reduce(
				(acc, subCategory) => ({ ...acc, [subCategory._id]: subCategory.name }),
				{}
			);
		}
		return {};
	}, [state.metaData]);
	const verticalMap = useMemo(() => {
		if (state.metaData) {
			return state.metaData.verticals.list.reduce((acc, vertical) => ({ ...acc, [vertical._id]: vertical.name }), {});
		}
		return {};
	}, [state.metaData]);
	return (
		<Row>
			<Col span={24}>
				<TopMarginTitle level={3}>
					{assetEntryId ? "Recommendation Selection" : "Primary product selection"}
				</TopMarginTitle>
			</Col>
			<Col span={24}>
				<SilentDivider />
			</Col>
			{primaryAsset && (
				<Col span={24}>
					<CustomDiv pt="0.5rem">
						<Text strong>For Primary Asset</Text>
					</CustomDiv>
					<CustomDiv width="100%" py="1rem" type="flex">
						<CustomDiv inline>
							<Image height="100px" src={primaryAsset.cdn} nolazy />
						</CustomDiv>
						<CustomDiv inline pl="1rem">
							<CustomDiv type="flex">
								<Text strong>
									<FontCorrectedPre>Name: </FontCorrectedPre>
								</Text>
								<ModifiedText textTransform="capitalize" type="secondary">
									{primaryAsset.name}
								</ModifiedText>
							</CustomDiv>
							<CustomDiv py="0.5em" type="flex" justifyContent="baseline" align="center">
								<CustomDiv type="flex" pr="5px">
									<Icon type="dollar-circle" theme="filled" />
								</CustomDiv>
								<CustomDiv>
									<Text strong>{primaryAsset.price}</Text>
								</CustomDiv>
							</CustomDiv>
						</CustomDiv>
					</CustomDiv>
					<SilentDivider />
				</Col>
			)}
			<Col span={24}>
				<MainAssetPanel ref={scrollParentRef}>
					{assetData.map(asset => {
						return <ProductCard verticalMap={verticalMap} key={asset._id} asset={asset} onCardClick={onCardClick} />;
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
