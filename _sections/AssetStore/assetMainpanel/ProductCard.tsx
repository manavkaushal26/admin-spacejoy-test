import Image from "@components/Image";
import { AssetType } from "@customTypes/moodboardTypes";
import { SilentDivider } from "@sections/Dashboard/styled";
import { getValueSafely } from "@utils/commonUtils";
import { Typography, Icon, Row, Col } from "antd";
import React from "react";
import styled from "styled-components";
import { AssetCard, CapitalizedText } from "../styled";

const { Text } = Typography;

interface AssetCards {
	asset: Partial<AssetType>;
	onCardClick: (assetData: Partial<AssetType>) => void;
	hoverable?: boolean;
	height?: string;
	width?: string;
	verticalMap?: Record<string, string>;
}

const CardPadding = styled.div`
	padding: 0.5rem;
`;

const ProductCard: (props: AssetCards) => JSX.Element = ({
	asset,
	onCardClick,
	hoverable = true,
	height,
	width,
	verticalMap,
}) => {
	const imageHeight = height || "auto";
	const imageWidth = width || "100%";
	return (
		<AssetCard onClick={(): void => onCardClick(asset)} hoverable={hoverable}>
			<Row gutter={[10, 0]}>
				<Col span={24}>
					<Image width={imageWidth} height={imageHeight} src={asset.cdn} nolazy />
					<SilentDivider />
				</Col>
				<Col span={24}>
					<CardPadding>
						<Row type="flex" gutter={[5, 0]}>
							<Col>
								<Icon type="link" />
							</Col>
							<Col>
								<Text type="secondary">
									<a target="_blank" rel="noopener noreferrer" href={getValueSafely(() => asset.retailLink, "#")}>
										{getValueSafely(() => asset.retailer.name, "N/A")}
									</a>
								</Text>
							</Col>
						</Row>
						<Row>
							<Col>
								<Text strong>{getValueSafely(() => asset.name, "N/A")}</Text>
							</Col>
						</Row>

						<Row type="flex" gutter={[5, 0]}>
							<Col>
								<Text strong>Vertical: </Text>
							</Col>
							<Col>
								<CapitalizedText>{` ${getValueSafely<string>(
									() => verticalMap[asset.meta.vertical],
									"Undefined"
								)}`}</CapitalizedText>
							</Col>
						</Row>
						<Row type="flex" gutter={[5, 0]}>
							<Col>
								<Text strong>W:</Text>
							</Col>
							<Col>
								<CapitalizedText>
									{getValueSafely<string | number>(() => (asset.dimension.width * 12).toFixed(2), "N/A")}&#34;
								</CapitalizedText>
							</Col>
							<Col>
								<Text strong>H:</Text>
							</Col>
							<Col>
								<CapitalizedText>
									{getValueSafely<string | number>(() => (asset.dimension.height * 12).toFixed(2), "N/A")}&#34;
								</CapitalizedText>
							</Col>
							<Col>
								<Text strong>D:</Text>
							</Col>
							<Col>
								<CapitalizedText>
									{getValueSafely<string | number>(() => (asset.dimension.depth * 12).toFixed(2), "N/A")}&#34;
								</CapitalizedText>
							</Col>
						</Row>
						<Row type="flex" gutter={[10, 0]}>
							<Col>
								<Icon type="dollar-circle" theme="filled" />
							</Col>
							<Col>
								<Text strong>{getValueSafely<string | number>(() => asset.price, "N/A")}</Text>
							</Col>
						</Row>
					</CardPadding>
				</Col>
			</Row>
		</AssetCard>
	);
};

export default ProductCard;
