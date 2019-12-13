import Image from "@components/Image";
import { AssetType } from "@customTypes/moodboardTypes";
import { CustomDiv } from "@sections/Dashboard/styled";
import { getValueSafely } from "@utils/commonUtils";
import { Button, Typography, Popconfirm, message } from "antd";
import React, { useState } from "react";
import styled from "styled-components";
import { AssetCard } from "../styled";
import { useRouter } from "next/router";

const { Text } = Typography;

interface CartAssetCard {
	projectId: string;
	designId: string;
	asset: Partial<AssetType>;
	type: "primary" | "recommendation";
	onRecommendationClick?: (entryId: string) => void;
	entryId?: string;
	addRemoveAsset: (action: "ADD" | "DELETE", assetId: string, assetEntryId?: string) => void;
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
	addRemoveAsset
}) => {
	const [loading, setLoading] = useState<boolean>(false);

	const Router = useRouter();

	const onClick = async () => {
		setLoading(true);
		if (type === "primary") {
			await addRemoveAsset("DELETE", entryId);
		}
		if (type === "recommendation") {
			await addRemoveAsset("DELETE", asset._id, entryId);
		}
		message.success(type === "primary" ? "Primary Asset Removed" : "Recommendation Removed");
		setLoading(false);
	};

	const redirect = () => {
		Router.push(
			{ pathname: "/assetstore", query: { designId, assetEntryId: entryId, projectId } },
			`/assetstore/pid/${projectId}/did/${designId}/aeid/${entryId}`
		);
	};

	return (
		<CustomDiv py="8px">
			<BorderlessAssetCard hoverable={type === "primary"} onClick={type === "primary" ? redirect : null}>
				<CustomDiv type="flex">
					<CustomDiv overflow="hidden" width="30%" justifyContent="center" type="flex">
						<Image height="100px" src={`q_80,h_100/${asset.cdn}`} />
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
						<CustomDiv width="100%">
							<Text style={{ width: "100%" }} strong ellipsis>
								{getValueSafely(() => asset.retailer.name, "N/A")}
							</Text>
						</CustomDiv>
						<CustomDiv type="flex" width="80%" px="4px">
							{type === "primary" && (
								<Button block onClick={() => onRecommendationClick(entryId)}>
									Recommendations
								</Button>
							)}
						</CustomDiv>
						<CustomDiv type="flex" width="20%" px="4px">
							<Popconfirm
								placement="topRight"
								onConfirm={onClick}
								title="Are you sure?"
								okText="Yes"
								cancelText="Cancel"
							>
								<StyledButton loading={loading} icon="delete" type="danger" block></StyledButton>
							</Popconfirm>
						</CustomDiv>
					</CustomDiv>
				</CustomDiv>
			</BorderlessAssetCard>
		</CustomDiv>
	);
};
export default CartAssetCard;
