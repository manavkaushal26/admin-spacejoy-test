import Image from "@components/Image";
import { AssetType } from "@customTypes/moodboardTypes";
import { CustomDiv, SilentDivider } from "@sections/Dashboard/styled";
import { getValueSafely } from "@utils/commonUtils";
import { Typography, Icon } from "antd";
import React from "react";
import { AssetCard } from "../styled";

const { Text } = Typography;

interface AssetCards {
	asset: Partial<AssetType>;
	onCardClick: (id: string) => void;
	hoverable?: boolean;
	height?: string;
	width?: string;
}

const ProductCard: (props: AssetCards) => JSX.Element = ({ asset, onCardClick, hoverable = true, height, width }) => {
	const imageHeight = height || "auto";
	const imageWidth = width || "100%";
	return (
		<AssetCard onClick={() => onCardClick(asset._id)} hoverable={hoverable}>
			<CustomDiv width="100%" type="flex" overflow="hidden" flexDirection="column">
				<CustomDiv justifyContent="space-around" type="flex">
					<Image width={imageWidth} height={imageHeight} src={asset.cdn} />
				</CustomDiv>
				<SilentDivider />
				<CustomDiv type="flex" justifyContent="center" flexDirection="column" height="30%" py="1rem" px="1rem">
					<CustomDiv>
						<Text style={{ width: "100%" }} strong>
							{getValueSafely(() => asset.retailer.name, "N/A")}
						</Text>
					</CustomDiv>
					<CustomDiv whiteSpace="nowrap">
						<Text style={{ width: "100%" }} ellipsis strong>
							{getValueSafely(() => asset.name, "N/A")}
						</Text>
					</CustomDiv>
					<CustomDiv>
						<CustomDiv type="flex" justifyContent="baseline" align="center">
							<CustomDiv type="flex" pr="5px">
								<Icon type="dollar-circle" theme="filled" />
							</CustomDiv>
							<CustomDiv>
								<Text strong>{getValueSafely<string | number>(() => asset.price, "N/A")}</Text>
							</CustomDiv>
						</CustomDiv>
					</CustomDiv>
				</CustomDiv>
			</CustomDiv>
		</AssetCard>
	);
};

export default ProductCard;
