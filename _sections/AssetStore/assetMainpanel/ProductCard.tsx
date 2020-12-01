import { DollarCircleFilled, LinkOutlined } from "@ant-design/icons";
import { CapitalizedText } from "@components/CommonStyledComponents";
import Image from "@components/Image";
import { AssetType, ScrapedAssetType } from "@customTypes/moodboardTypes";
import { getValueSafely } from "@utils/commonUtils";
import AssetAvailability from "@utils/componentUtils/AssetAvailable";
import PriceData from "@utils/componentUtils/AssetPrice";
import config from "@utils/config";
import { Card, Col, Row, Typography } from "antd";
import React, { ReactNode, useMemo } from "react";
import styled from "styled-components";

const { Text, Link } = Typography;

interface AssetCards {
	asset: Partial<AssetType>;
	onCardClick?: (assetData: string) => void;
	hoverable?: boolean;
	height?: string;
	noVertical?: boolean;
	width?: string;
	verticalMap?: Record<string, string>;
	actions?: ReactNode[];
	scrapedData?: ScrapedAssetType;
}

const CardPadding = styled.div`
	padding: 0.5rem;
`;

const ImageContainer = styled.div`
	text-align: center;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const ProductCard: (props: AssetCards) => JSX.Element = ({
	asset,
	onCardClick,
	hoverable = true,
	noVertical,
	actions,
	scrapedData,
}) => {
	const availability = useMemo(() => {
		if (asset.inStock !== undefined) {
			if (asset.inStock) {
				return <>Available</>;
			} else {
				return <>Out Of Stock</>;
			}
		} else if (scrapedData) {
			return <AssetAvailability scrapedData={scrapedData} />;
		}
		return undefined;
	}, [scrapedData, asset]);

	return (
		<Card
			size='small'
			cover={
				<ImageContainer>
					<Image
						width='auto'
						height='250px'
						src={
							asset?.productImages
								? `q_80,h_250,w_250,c_pad,b_white/${asset.productImages[0]?.cdn}`
								: undefined || `q_80,h_250,w_250,c_pad,b_white/${asset?.cdn}`
						}
					/>
				</ImageContainer>
			}
			actions={actions || []}
			{...(onCardClick ? { onClick: (): void => onCardClick(asset._id) } : {})}
			hoverable={hoverable}
		>
			<Row>
				<Col span={24}>
					<Row gutter={[4, 4]}>
						<Col>
							<LinkOutlined />
						</Col>
						<Col>
							<Text style={{ width: "100%", overflow: "hidden" }} ellipsis type='secondary'>
								<a
									onClick={e => e.stopPropagation()}
									target='_blank'
									rel='noopener noreferrer'
									href={getValueSafely(() => `${config.company.customerPortalLink}/product-view/${asset._id}`, "#")}
								>
									{getValueSafely(() => asset.retailer.name, "N/A")}
								</a>
							</Text>
						</Col>
					</Row>
				</Col>
				<Col span={24}>
					<Link
						style={{ width: "100%", overflow: "hidden" }}
						onClick={e => e.stopPropagation()}
						ellipsis
						strong
						href={getValueSafely(() => `/assetstore/assetdetails?assetId=${asset._id}`, "#")}
					>
						{getValueSafely(() => asset.name, "N/A")}
					</Link>
				</Col>
				{!noVertical && (
					<Col span={24}>
						<Row gutter={[4, 4]}>
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
					</Col>
				)}
				<Col span={24}>
					<Row gutter={[8, 0]}>
						<Col>
							<DollarCircleFilled />
						</Col>
						<Col>
							<Text strong>{getValueSafely<string | number>(() => asset.price, "N/A")}</Text>
						</Col>
					</Row>
				</Col>
				{scrapedData && (
					<Col span={24}>
						<Row gutter={[10, 0]}>
							<Col>
								<Text strong>Current Price:</Text>
							</Col>
							<Col>
								<Text strong>
									<PriceData scrapedData={scrapedData} />
								</Text>
							</Col>
						</Row>
					</Col>
				)}
				{availability && (
					<Col span={24}>
						<Row>
							<Col>
								<Text strong>Availability:</Text>
							</Col>

							<Col>
								<Text strong>{availability}</Text>
							</Col>
						</Row>
					</Col>
				)}
				<Col span={24}>
					<Row justify='space-between'>
						<Col span={8}>
							<Row>
								<Col span={24}>
									<Text strong>W</Text>
								</Col>
								<Col span={24}>
									<CapitalizedText>
										{getValueSafely<string | number>(() => (asset.dimension.width * 12).toFixed(2), "N/A")}&#34;
									</CapitalizedText>
								</Col>
							</Row>
						</Col>

						<Col span={8}>
							<Row>
								<Col span={24}>
									<Text strong>H</Text>
								</Col>
								<Col span={24}>
									<CapitalizedText>
										{getValueSafely<string | number>(() => (asset.dimension.height * 12).toFixed(2), "N/A")}&#34;
									</CapitalizedText>
								</Col>
							</Row>
						</Col>
						<Col span={8}>
							<Row>
								<Col span={24}>
									<Text strong>D</Text>
								</Col>
								<Col span={24}>
									<CapitalizedText>
										{getValueSafely<string | number>(() => (asset.dimension.depth * 12).toFixed(2), "N/A")}&#34;
									</CapitalizedText>
								</Col>
							</Row>
						</Col>
					</Row>
				</Col>
			</Row>
		</Card>
	);
};

export default ProductCard;
