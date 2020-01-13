import { MoodboardAsset } from "@customTypes/moodboardTypes";
import ProductCard from "@sections/AssetStore/assetMainpanel/ProductCard";
import { CustomDiv, SilentDivider } from "@sections/Dashboard/styled";
import { Typography, Empty } from "antd";
import { useRouter } from "next/router";
import React from "react";
import { getValueSafely } from "@utils/commonUtils";

interface MoodboardDisplayProps {
	moodboard: MoodboardAsset[];
	designId: string;
	projectId: string;
}

const MoodboardDisplay: (props: MoodboardDisplayProps) => JSX.Element = ({ moodboard, projectId, designId }) => {
	const Router = useRouter();
	const onPrimaryAssetClick = assetEntryId => {
		Router.push(
			{ pathname: "/assetstore", query: { designId, assetEntryId, projectId } },
			`/assetstore/pid/${projectId}/did/${designId}/aeid/${assetEntryId}`
		);
	};

	return (
		<>
			<CustomDiv mt="0.5em" type="flex" width="100%">
				<CustomDiv inline minWidth="30ch" px="0.7em">
					<Typography.Title style={{ width: "100%" }} level={3}>
						Primary ({getValueSafely(() => moodboard.filter(asset => asset.isExistingAsset).length, 0)})
					</Typography.Title>
				</CustomDiv>
				<CustomDiv inline>
					<SilentDivider style={{ height: "100%" }} type="vertical" />
				</CustomDiv>
				<CustomDiv px="0.7em" inline overX="scroll" whiteSpace="nowrap">
					<Typography.Title style={{ width: "100%" }} ellipsis level={3}>
						Recommendations
					</Typography.Title>
				</CustomDiv>
			</CustomDiv>
			<SilentDivider />
			{moodboard &&
				moodboard
					.filter(assetEntry => assetEntry.isExistingAsset)
					.map(assetEntry => {
						return (
							<>
								<CustomDiv type="flex" width="100%">
									<CustomDiv inline minWidth="30ch" maxWidth="30ch">
										<ProductCard
											height="200px"
											width="auto"
											asset={assetEntry.asset}
											onCardClick={() => {
												onPrimaryAssetClick(assetEntry.asset._id);
											}}
										/>
									</CustomDiv>
									<CustomDiv inline>
										<SilentDivider style={{ height: "100%" }} type="vertical" />
									</CustomDiv>
									<CustomDiv inline overX="scroll" whiteSpace="nowrap">
										{assetEntry.recommendations.length ? (
											assetEntry.recommendations.map(asset => {
												return (
													<CustomDiv minWidth="30ch" key={assetEntry._id} inline>
														<ProductCard
															height="200px"
															hoverable={false}
															width="auto"
															asset={asset}
															onCardClick={() => {}}
														/>
													</CustomDiv>
												);
											})
										) : (
											<CustomDiv type="flex" px="1rem" align="center" width="100%" height="100%">
												<Empty description="No Recommendations added for this product yet." />
											</CustomDiv>
										)}
									</CustomDiv>
								</CustomDiv>
								<SilentDivider />
							</>
						);
					})}
		</>
	);
};

export default MoodboardDisplay;
