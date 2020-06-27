import { DollarCircleFilled, LinkOutlined } from "@ant-design/icons";
import { CapitalizedText } from "@components/CommonStyledComponents";
import Image from "@components/Image";
import { AssetType } from "@customTypes/moodboardTypes";
import { getValueSafely } from "@utils/commonUtils";
import { Col, Row, Typography } from "antd";
import React, { ReactNode } from "react";
import styled from "styled-components";
import { AssetCard } from "../styled";

const { Text } = Typography;

interface AssetCards {
	asset: Partial<AssetType>;
	onCardClick?: (assetData: string) => void;
	hoverable?: boolean;
	height?: string;
	noVertical?: boolean;
	width?: string;
	verticalMap?: Record<string, string>;
	actions?: ReactNode[];
}

const CardPadding = styled.div`
	padding: 0.5rem;
`;

const ImageContainer = styled.div`
	text-align: center;
	min-height: 250px;
	display: flex;
	justify-content: center;
	align-items: center;
	> img {
		max-width: 100%;
		max-height: 250px;
	}
`;

const ProductCard: (props: AssetCards) => JSX.Element = ({
	asset,
	onCardClick,
	hoverable = true,
	noVertical,
	actions,
}) => {
	return (
		<AssetCard
			cover={
				<ImageContainer>
					<Image
						width='auto'
						height='250px'
						autoAdjust
						src={getValueSafely(
							() => asset.cdn,
							process.env.NODE_ENV !== "production"
								? "v1581080070/admin/productImagePlaceholder.jpg"
								: "v1581080111/admin/productImagePlaceholder.jpg"
						)}
					/>
				</ImageContainer>
			}
			actions={actions || []}
			{...(onCardClick ? { onClick: (): void => onCardClick(asset._id) } : {})}
			hoverable={hoverable}
		>
			<Row gutter={[10, 0]}>
				<Col span={24}>
					<CardPadding>
						<Row gutter={[5, 0]}>
							<Col>
								<LinkOutlined />
							</Col>
							<Col>
								<Text style={{ width: "100%" }} ellipsis type='secondary'>
									<a target='_blank' rel='noopener noreferrer' href={getValueSafely(() => asset.retailLink, "#")}>
										{getValueSafely(() => asset.retailer.name, "N/A")}
									</a>
								</Text>
							</Col>
						</Row>
						<Row>
							<Col>
								<Text style={{ width: "100%" }} ellipsis strong>
									{getValueSafely(() => asset.name, "N/A")}
								</Text>
							</Col>
						</Row>

						{!noVertical && (
							<Row gutter={[5, 0]}>
								<Col>
									<Text strong>Vertical: </Text>
								</Col>
								<Col>
									<CapitalizedText>{` ${getValueSafely<string>(
										() => asset.meta.vertical,
										"Undefined"
									)}`}</CapitalizedText>
								</Col>
							</Row>
						)}
						<Row gutter={[5, 0]}>
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
						<Row gutter={[10, 0]}>
							<Col>
								<DollarCircleFilled />
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
