import { DollarCircleFilled } from "@ant-design/icons";
import Image from "@components/Image";
import { MoodboardAsset } from "@customTypes/moodboardTypes";
import { AssetAction, ASSET_ACTION_TYPES } from "@sections/AssetStore/reducer";
import { getValueSafely } from "@utils/commonUtils";
import { Col, Empty, Row, Spin, Statistic, Typography } from "antd";
import React, { useMemo, useState } from "react";
import { GreyDrawer } from "../styled";
import CartAssetCard from "./CartAssetCard";

const { Text } = Typography;

interface AssetCartModalProps {
	cartOpen: boolean;
	designId: string;
	projectId: string;
	moodboard: MoodboardAsset[];
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
	selectedAssetId,
}: AssetCartModalProps): JSX.Element => {
	const [selectedEntry, setSelectedEntry] = useState<string>(null);

	const onRecomendationClick = (entryId): void => {
		setSelectedEntry(entryId);
	};

	const onSecondaryClose = (): void => {
		setSelectedEntry(null);
	};

	const costOfMoodboard = useMemo(() => {
		if (moodboard)
			return moodboard
				.filter(asset => asset.isExistingAsset && asset.asset !== null)
				.reduce((acc, asset) => {
					return acc + asset.asset.price;
				}, 0);
		return 0;
	}, [moodboard]);

	const selectedAsset = useMemo(() => {
		if (moodboard) {
			const assetEntry = moodboard
				.filter(asset => asset.isExistingAsset && asset.asset !== null)
				.find(asset => {
					return asset.asset._id === selectedEntry;
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
				<Row>
					<Col span={24}>
						<Text>Primary Assets</Text>
					</Col>
					<Col span={24}>
						<Statistic value={costOfMoodboard} prefix={<DollarCircleFilled />} />
					</Col>
				</Row>
			}
			width={360}
			onClose={handlePrimaryMoodboardClose}
			closable
			visible={cartOpen}
		>
			<Spin spinning={dataLoading}>
				<Row gutter={[4, 4]}>
					{getValueSafely<boolean>(() => moodboard.length > 0, false) ? (
						moodboard
							.filter(assetEntry => assetEntry.isExistingAsset && assetEntry.asset !== null)
							.map(assetEntry => {
								return (
									<Col key={assetEntry.asset._id} span={24}>
										<CartAssetCard
											projectId={projectId}
											designId={designId}
											addRemoveAsset={addRemoveAsset}
											onRecommendationClick={onRecomendationClick}
											type='primary'
											currentlySelectingRecommendation={selectedAssetId === assetEntry.asset._id}
											asset={assetEntry.asset}
											entryId={assetEntry.asset._id}
										/>
									</Col>
								);
							})
					) : (
						<Col span={24}>
							<Row justify='center'>
								<Empty description='Add some products as recommendation' />
							</Row>
						</Col>
					)}
					{selectedEntry && (
						<GreyDrawer
							title={
								<>
									<Row justify='center' align='middle'>
										<Col span={24}>
											<Row justify='center' align='middle'>
												<Image width='40%' src={`/q_80/${selectedAsset.asset.cdn}`} />
											</Row>
										</Col>
										<Col span={24}>
											<Row justify='center' align='middle'>
												{getValueSafely(() => `${selectedAsset.asset.name} Recommendation`, "Recommendations")}
											</Row>
										</Col>
									</Row>
								</>
							}
							width={360}
							onClose={onSecondaryClose}
							closable
							visible={selectedEntry !== null}
						>
							<Spin spinning={dataLoading}>
								<Row gutter={[4, 4]}>
									{selectedAsset && selectedAsset.recommendations.length ? (
										selectedAsset.recommendations.map(asset => {
											return (
												<Col span={24} key={selectedAsset.asset._id}>
													<CartAssetCard
														projectId={projectId}
														designId={designId}
														entryId={selectedAsset.asset._id}
														addRemoveAsset={addRemoveAsset}
														type='recommendation'
														asset={asset}
													/>
												</Col>
											);
										})
									) : (
										<Col span={24}>
											<Row justify='center'>
												<Empty description='Add some products as recommendation' />
											</Row>
										</Col>
									)}
								</Row>
							</Spin>
						</GreyDrawer>
					)}
				</Row>
			</Spin>
		</GreyDrawer>
	);
};

export default AssetCartModal;
