import { getAssetApi } from "@api/designApi";
import { AssetType, MoodBoardType } from "@customTypes/moodboardTypes";
import { AssetAction, AssetStoreState, ASSET_ACTION_TYPES } from "@sections/AssetStore/reducer";
import { CustomDiv } from "@sections/Dashboard/styled";
import { debounce } from "@utils/commonUtils";
import fetcher from "@utils/fetcher";
import { Pagination, Row, Typography } from "antd";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import AssetDescriptionPanel from "./AssetDescriptionPanel";
import ProductCard from "./ProductCard";

const { Title } = Typography;

interface AssetMainPanelProps {
	state: AssetStoreState;
	assetEntryId: string;
	addRemoveAsset: (action: "ADD" | "DELETE", assetId: string, assetEntryId?: string) => void;
	moodboard: MoodBoardType;
	designId: string;
	dispatch: React.Dispatch<AssetAction>;
	projectId: string;
}

interface fetchAndPopulate {
	(
		state: AssetStoreState,
		pageCount: number,
		setAssetData: React.Dispatch<React.SetStateAction<AssetType[]>>,
		setTotalCount: React.Dispatch<React.SetStateAction<number>>,
		dispatch: React.Dispatch<AssetAction>
	): Promise<void>;
}

const MainAssetPanel = styled(CustomDiv)`
	> *:last-child {
		align-self: flex-start;
		justify-self: flex-start;
	}
`;

const fetchAndPopulate: fetchAndPopulate = async (state, pageCount, setAssetData, setTotalCount, dispatch) => {
	dispatch({ type: ASSET_ACTION_TYPES.LOADING_STATUS, value: true });
	const endPoint = getAssetApi();
	const queryParams = `?skip=${(pageCount - 1) * 10}&limit=30`;
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
				"dimensions.height": { search: "range", value: state.heightRange }
			}
		}
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
	state,
	addRemoveAsset,
	moodboard,
	designId,
	assetEntryId,
	dispatch,
	projectId
}) => {
	const [assetData, setAssetData] = useState<AssetType[]>([]);
	const [pageCount, setPageCount] = useState<number>(1);
	const [totalCount, setTotalCount] = useState<number>(0);

	const onCardClick = assetId => {
		dispatch({ type: ASSET_ACTION_TYPES.SELECTED_ASSET, value: assetId });
	};

	useEffect(() => {
		if (moodboard && assetEntryId) {
			const asset = moodboard.assets.find(asset => {
				return asset._id == assetEntryId;
			});
			dispatch({ type: ASSET_ACTION_TYPES.SUB_CATEGORY, value: [asset.asset] });
		}
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
		state.heightRange
	]);

	useEffect(() => {
		debouncedFetchAsset(state, pageCount, setAssetData, setTotalCount, dispatch);
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
		pageCount
	]);
	return (
		<>
			<Row type="flex" justify="start">
				<CustomDiv pt="0.5em" pl="0.5em" width="100%">
					<Title level={3}>{assetEntryId ? "Recommendation Selection" : "Primary product selection"}</Title>
				</CustomDiv>
				<MainAssetPanel type="flex" flexWrap="wrap" justifyContent="space-evenly" flexGrow={1}>
					{assetData.map(asset => {
						return <ProductCard key={asset._id} asset={asset} onCardClick={onCardClick} />;
					})}
				</MainAssetPanel>
				<CustomDiv py="16px" justifyContent="space-around" type="flex" align="center" width="100%">
					<Pagination
						current={pageCount}
						defaultPageSize={12}
						hideOnSinglePage={true}
						total={totalCount}
						onChange={page => setPageCount(page)}
					/>
				</CustomDiv>
				<AssetDescriptionPanel
					dataLoading={state.loading}
					dispatch={dispatch}
					projectId={projectId}
					assetEntryId={assetEntryId}
					designId={designId}
					moodboard={moodboard}
					addRemoveAsset={addRemoveAsset}
					assetId={state.selectedAsset}
				/>
			</Row>
		</>
	);
};

export default AssetMainPanel;
