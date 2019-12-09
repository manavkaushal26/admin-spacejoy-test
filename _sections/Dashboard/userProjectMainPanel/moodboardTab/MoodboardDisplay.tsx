import { MoodBoardType } from "@customTypes/moodboardTypes";
import ProductCard from "@sections/AssetStore/assetMainpanel/ProductCard";
import { CustomDiv, SilentDivider } from "@sections/Dashboard/styled";
import { Typography } from "antd";
import { useRouter } from "next/router";
import React from "react";

interface MoodboardDisplayProps {
    moodboard: MoodBoardType;
    designId: string;
    projectId: string;
}

const MoodboardDisplay: (props: MoodboardDisplayProps) => JSX.Element = ({ moodboard, projectId, designId }) => {
    const Router = useRouter();
    const onPrimaryAssetClick = (assetEntryId) => {
		Router.push(
            { pathname: "/assetstore", query: { designId, assetEntryId, projectId } },
            `/assetstore/pid/${projectId}/did/${designId}/aeid/${assetEntryId}`
        );  }

	return (
		<>
			<CustomDiv mt="0.5em" type="flex" width="100%">
				<CustomDiv inline minWidth="29ch" px="0.7em">
					<Typography.Title style={{ width: "100%" }} level={3}>
						Primary
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
				moodboard.assets.map(assetEntry => {
					return (
						<>
							<CustomDiv type="flex" width="100%">
								<CustomDiv inline minWidth="29ch">
									<ProductCard asset={assetEntry.asset} onCardClick={() => {onPrimaryAssetClick(assetEntry._id)}} />
								</CustomDiv>
								<CustomDiv inline>
									<SilentDivider style={{ height: "100%" }} type="vertical" />
								</CustomDiv>
								<CustomDiv inline overX="scroll" whiteSpace="nowrap">
									{assetEntry.recommendations.map(asset => {
										return (
											<CustomDiv inline>
												<ProductCard hoverable={false} asset={asset} onCardClick={() => {}} />
											</CustomDiv>
										);
									})}
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
