import Image from "@components/Image";
import { MoodBoardType } from "@customTypes/moodboardTypes";
import { AssetAction, ASSET_ACTION_TYPES } from "@sections/AssetStore/reducer";
import { CustomDiv, SilentDivider } from "@sections/Dashboard/styled";
import { getValueSafely } from "@utils/commonUtils";
import { Empty, Icon, Spin, Statistic, Typography } from "antd";
import React, { useMemo, useState } from "react";
import { GreyDrawer } from "../styled";
import CartAssetCard from "./CartAssetCard";

const { Text } = Typography;

interface AssetCartModalProps {
	cartOpen: boolean;
	designId: string;
	projectId: string;
	moodboard: MoodBoardType;
	dispatch: React.Dispatch<AssetAction>;
	dataLoading: boolean;
	addRemoveAsset: (action: "ADD" | "DELETE", assetId: string, assetEntryId?: string) => void;
	selectedAssetId: string;
}

const AssetCartModal = ({
	cartOpen,
	dispatch,
	projectId,
	designId,
	moodboard,
	addRemoveAsset,
	dataLoading,
	selectedAssetId
}: AssetCartModalProps): JSX.Element => {
	const [selectedEntry, setSelectedEntry] = useState<string>(null);

	const onRecomendationClick = (entryId): void => {
		setSelectedEntry(entryId);
	};

	const onSecondaryClose = (): void => {
		setSelectedEntry(null);
	};

	const costOfMoodboard = useMemo(() => {
		if (moodboard.assets)
			return moodboard.assets.reduce((acc, asset) => {
				return acc + asset.asset.price;
			}, 0);
		return 0;
	}, [moodboard.assets]);

	const selectedAsset = useMemo(() => {
		if (moodboard) {
			const assetEntry = moodboard.assets.find(asset => {
				return asset._id === selectedEntry;
			});
			return assetEntry;
		}
		return null;
	}, [selectedEntry, moodboard]);

	const handlePrimaryMoodboardClose = (): void => {
		dispatch({ type: ASSET_ACTION_TYPES.TOGGLE_CART, value: null });
	};

	return (
		<GreyDrawer
			title={
				<CustomDiv>
					<Text>Primary Assets</Text>
					<Statistic value={costOfMoodboard} prefix={<Icon type="dollar-circle" theme="filled" />} />
				</CustomDiv>
			}
			width={360}
			onClose={handlePrimaryMoodboardClose}
			closable
			visible={cartOpen}
		>
			<Spin spinning={dataLoading}>
				{getValueSafely<boolean>(() => moodboard.assets.length > 0, false) ? (
					moodboard.assets.map(assetEntry => {
						return (
							<>
								<CartAssetCard
									projectId={projectId}
									designId={designId}
									addRemoveAsset={addRemoveAsset}
									onRecommendationClick={onRecomendationClick}
									type="primary"
									currentlySelectingRecommendation={selectedAssetId === assetEntry._id}
									asset={assetEntry.asset}
									entryId={assetEntry._id}
								/>
								<SilentDivider />
							</>
						);
					})
				) : (
					<Empty description="Add some products to design" />
				)}
				{selectedEntry && (
					<GreyDrawer
						title={
							<>
								<CustomDiv type="flex" flexDirection="column" justifyContent="center" align="center">
									<Image width="40%" src={`/q_80/${selectedAsset.asset.cdn}`} />
									{getValueSafely(() => `${selectedAsset.asset.name} Recommendation`, "Recommendations")}
								</CustomDiv>
							</>
						}
						width={360}
						onClose={onSecondaryClose}
						closable
						visible={selectedEntry !== null}
					>
						<Spin spinning={dataLoading}>
							{selectedAsset && selectedAsset.recommendations.length ? (
								selectedAsset.recommendations.map(asset => {
									return (
										<>
											<CartAssetCard
												projectId={projectId}
												designId={designId}
												entryId={selectedAsset._id}
												addRemoveAsset={addRemoveAsset}
												type="recommendation"
												asset={asset}
											/>
											<SilentDivider />
										</>
									);
								})
							) : (
								<Empty description="Add some products as recommendation" />
							)}
						</Spin>
					</GreyDrawer>
				)}
			</Spin>
		</GreyDrawer>
	);
};

export default AssetCartModal;
