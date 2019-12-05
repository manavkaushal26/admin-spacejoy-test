import { MoodBoardType } from "@customTypes/moodboardTypes";
import { AssetAction, ASSET_ACTION_TYPES } from "@sections/AssetStore/reducer";
import { SilentDivider } from "@sections/Dashboard/styled";
import { getValueSafely } from "@utils/commonUtils";
import { Empty, Spin, Typography } from "antd";
import React, { useMemo, useState } from "react";
import { GreyDrawer } from "../styled";
import CartAssetCard from "./CartAssetCard";

const { Text } = Typography;

interface AssetCartModalProps {
	cartOpen: boolean;
	moodboard: MoodBoardType;
	dispatch: React.Dispatch<AssetAction>;
	dataLoading: boolean;
	addRemoveAsset: (action: "ADD" | "DELETE", assetId: string, assetEntryId?: string) => void;
}

const AssetCartModal: (props: AssetCartModalProps) => JSX.Element = ({
	cartOpen,
	dispatch,
	moodboard,
	addRemoveAsset,
	dataLoading
}) => {
	const [selectedEntry, setSelectedEntry] = useState<string>(null);

	const onRecomendationClick = entryId => {
		setSelectedEntry(entryId);
	};

	const onSecondaryClose = () => {
		setSelectedEntry(null);
	};
	const selectedAsset = useMemo(() => {
		if (moodboard) {
			const assetEntry = moodboard.assets.find(asset => {
				return asset._id === selectedEntry;
			});
			return assetEntry;
		}
	}, [selectedEntry, moodboard]);

	const handlePrimaryMoodboardClose = () => {
		dispatch({ type: ASSET_ACTION_TYPES.TOGGLE_CART, value: null });
	};

	return (
		<GreyDrawer
			title="Primary product list"
			width={360}
			onClose={handlePrimaryMoodboardClose}
			closable={true}
			visible={cartOpen}
		>
			<Spin spinning={dataLoading}>
				{getValueSafely<boolean>(() => moodboard.assets.length > 0, false) ? (
					moodboard.assets.map(assetEntry => {
						return (
							<>
								<CartAssetCard
									addRemoveAsset={addRemoveAsset}
									onRecommendationClick={onRecomendationClick}
									type="primary"
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
						title={getValueSafely(() => `${selectedAsset.asset.name} Recommendation`, "Recommendations")}
						width={360}
						onClose={onSecondaryClose}
						closable={true}
						visible={selectedEntry !== null}
					>
						<Spin spinning={dataLoading}>
							{selectedAsset && selectedAsset.recommendations.length ? (
								selectedAsset.recommendations.map(asset => {
									return (
										<>
											<CartAssetCard
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
