import Image from "@components/Image";
import { AssetType } from "@customTypes/moodboardTypes";
import { CustomDiv } from "@sections/Dashboard/styled";
import { getValueSafely } from "@utils/commonUtils";
import { Button, Icon, message, Popconfirm, Typography } from "antd";
import { useRouter } from "next/router";
import React, { useState } from "react";
import styled from "styled-components";
import { AssetCard } from "../styled";

const { Text } = Typography;

interface CartAssetCard {
	projectId: string;
	designId: string;
	asset: Partial<AssetType>;
	type: "primary" | "recommendation";
	onRecommendationClick?: (entryId: string) => void;
	entryId?: string;
	addRemoveAsset: (action: "ADD" | "DELETE", assetId: string, assetEntryId?: string) => void;
	currentlySelectingRecommendation?: boolean;
}

const BorderlessAssetCard = styled(AssetCard)`
	border: none;
	background: transparent;
`;

const StyledButton = styled(Button)`
	i.anticon {
		display: flex;
		justify-content: center;
		align-content: center;
	}
`;

const CartAssetCard: (props: CartAssetCard) => JSX.Element = ({
	projectId,
	designId,
	asset,
	type,
	onRecommendationClick,
	entryId,
	addRemoveAsset,
	currentlySelectingRecommendation
}) => {
	const [loading, setLoading] = useState<boolean>(false);

	const Router = useRouter();

	const onClick = (e): void => {
		setLoading(true);
		if (type === "primary") {
			addRemoveAsset("DELETE", entryId);
		}
		if (type === "recommendation") {
			addRemoveAsset("DELETE", asset._id, entryId);
		}
		message.success(type === "primary" ? "Primary Asset Removed" : "Recommendation Removed");
		setLoading(false);
	};

	const redirect = (e, typeOfCard: string): void => {
		if (typeOfCard === "primary" && !e.target.className.startsWith("ant"))
			Router.push(
				{ pathname: "/assetstore", query: { designId, assetEntryId: entryId, projectId } },
				`/assetstore/pid/${projectId}/did/${designId}/aeid/${entryId}`
			);
	};

	return (
		<CustomDiv py="8px">
			<BorderlessAssetCard id="cartCard" hoverable={type === "primary"} onClick={e => redirect(e, type)}>
				<CustomDiv type="flex">
					<CustomDiv overflow="hidden" width="30%" justifyContent="center" type="flex" align="center">
						<Image height="115px" src={`q_80,h_100/${asset.cdn}`} />
					</CustomDiv>
					<CustomDiv
						width="70%"
						px="8px"
						py="8px"
						type="flex"
						flexWrap="wrap"
						justifyContent="space-evenly"
						align="center"
					>
						<CustomDiv width="100%">
							<Text style={{ width: "100%" }} strong ellipsis>
								{getValueSafely(() => asset.name, "N/A")}
							</Text>
						</CustomDiv>
						<CustomDiv pb="0.2rem" width="100%" type="flex" justifyContent="baseline" align="baseline">
							<CustomDiv type="flex" pr="5px">
								<Icon type="link" />
							</CustomDiv>
							<CustomDiv>
								<Text type="secondary">
									<a target="_blank" rel="noopener noreferrer" href={getValueSafely(() => asset.retailLink, "#")}>
										{getValueSafely(() => asset.retailer.name, "N/A")}
									</a>
								</Text>
							</CustomDiv>
						</CustomDiv>
						<CustomDiv width="100%" type="flex" justifyContent="baseline" pb="0.5rem" align="center">
							<CustomDiv type="flex" pr="5px">
								<Icon type="dollar-circle" theme="filled" />
							</CustomDiv>
							<CustomDiv>
								<Text strong>{asset.price}</Text>
							</CustomDiv>
						</CustomDiv>
						<CustomDiv type="flex" width="80%" pr="4px">
							{type === "primary" && (
								<Button
									block
									onClick={(e): void => {
										e.stopPropagation();
										onRecommendationClick(entryId);
									}}
								>
									Recommendations
								</Button>
							)}
						</CustomDiv>
						<CustomDiv type="flex" width="20%" px="4px">
							<Popconfirm
								placement="left"
								onConfirm={onClick}
								title="Are you sure?"
								okText="Yes"
								disabled={currentlySelectingRecommendation}
								cancelText="Cancel"
							>
								<StyledButton
									disabled={currentlySelectingRecommendation}
									loading={loading}
									icon="delete"
									onClick={(e): void => e.stopPropagation()}
									type="danger"
									block
								/>
							</Popconfirm>
						</CustomDiv>
					</CustomDiv>
				</CustomDiv>
			</BorderlessAssetCard>
		</CustomDiv>
	);
};
export default CartAssetCard;
