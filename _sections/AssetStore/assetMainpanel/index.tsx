import { getAssetApi } from "@api/designApi";
import Image from "@components/Image";
import { AssetType, MoodBoardType } from "@customTypes/moodboardTypes";
import { AssetAction, AssetStoreState, ASSET_ACTION_TYPES } from "@sections/AssetStore/reducer";
import { CustomDiv, FontCorrectedPre, ModifiedText, SilentDivider } from "@sections/Dashboard/styled";
import { debounce } from "@utils/commonUtils";
import fetcher from "@utils/fetcher";
import { Icon, Pagination, Row, Typography } from "antd";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import AssetDescriptionPanel from "./AssetDescriptionPanel";
import ProductCard from "./ProductCard";

const { Title, Text } = Typography;

interface AssetMainPanelProps {
	state: AssetStoreState;
	assetEntryId: string;
	addRemoveAsset: (action: "ADD" | "DELETE", assetId: string, assetEntryId?: string) => void;
	moodboard: MoodBoardType;
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
		dispatch: React.Dispatch<AssetAction>
	): Promise<void>;
}

const MainAssetPanel = styled(CustomDiv)`
	> *:last-child {
		align-self: flex-start;
		justify-self: flex-start;
	}
`;

const fetchAndPopulate: FetchAndPopulate = async (state, pageCount, setAssetData, setTotalCount, dispatch) => {
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
	const [primaryAsset, setPrimaryAsset] = useState<Partial<AssetType>>(null);
	const onCardClick = (assetId): void => {
		dispatch({ type: ASSET_ACTION_TYPES.SELECTED_ASSET, value: assetId });
	};

	useEffect(() => {
		if (moodboard && assetEntryId) {
			const asset = moodboard.assets.find(moodboardAsset => {
				return moodboardAsset._id === assetEntryId;
			});
			setPrimaryAsset(asset.asset);
			dispatch({ type: ASSET_ACTION_TYPES.SUB_CATEGORY, value: asset.asset });
		}
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
		state.heightRange
	]);

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
		pageCount
	]);
	return (
		<>
			<Row type="flex" justify="start">
				<CustomDiv pt="0.5rem" pl="0.5rem" width="100%">
					<Title level={3}>{assetEntryId ? "Recommendation Selection" : "Primary product selection"}</Title>
				</CustomDiv>
				<SilentDivider />
				{primaryAsset && (
					<>
						<CustomDiv pl="0.5rem">
							<Text strong>For Primary Asset</Text>
						</CustomDiv>
						<CustomDiv pl="0.5rem" width="100%" py="1rem" type="flex">
							<CustomDiv inline>
								<Image height="100px" src={primaryAsset.cdn} />
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
					</>
				)}
				<MainAssetPanel type="flex" flexWrap="wrap" justifyContent="space-evenly" flexGrow={1}>
					{assetData.map(asset => {
						return <ProductCard key={asset._id} asset={asset} onCardClick={onCardClick} />;
					})}
				</MainAssetPanel>
				<CustomDiv py="16px" justifyContent="space-around" type="flex" align="center" width="100%">
					<Pagination
						current={pageCount}
						defaultPageSize={12}
						hideOnSinglePage
						total={totalCount}
						onChange={(page): void => setPageCount(page)}
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
