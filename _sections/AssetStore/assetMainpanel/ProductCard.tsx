import { DollarCircleFilled, LinkOutlined } from "@ant-design/icons";
import { CapitalizedText } from "@components/CommonStyledComponents";
import Image from "@components/Image";
import { AssetType, ScrapedAssetType } from "@customTypes/moodboardTypes";
import { Role } from "@customTypes/userType";
import useAuth from "@utils/authContext";
import { getValueSafely } from "@utils/commonUtils";
import AssetAvailability from "@utils/componentUtils/AssetAvailable";
import PriceData from "@utils/componentUtils/AssetPrice";
import { Card, Col, Row, Typography } from "antd";
import React, { ReactNode } from "react";
import styled from "styled-components";

const { Text, Link } = Typography;

interface AssetCards {
	asset: Partial<AssetType>;
	onCardClick?: (assetData: string) => void;
	hoverable?: boolean;
	height?: string;
	noVertical?: boolean;
	width?: string;
	actions?: ReactNode[];
	scrapedData?: ScrapedAssetType;
}

const ImageContainer = styled.div`
	text-align: center;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const ColouredSpan = styled.span<{ bg: string }>`
	padding: 0.2rem;
	background: ${({ theme, bg }) => {
		if (bg === "green") {
			return theme.colors.mild.green;
		} else if (bg === "red") {
			return theme.colors.mild.red;
		}
	}};
`;

const ProductCard: (props: AssetCards) => JSX.Element = ({
	asset,
	onCardClick,
	hoverable = true,
	noVertical,
	actions,
	scrapedData,
}) => {
	const { user } = useAuth();

	const availability = React.useMemo(() => {
		if (asset.inStock !== undefined) {
			if (asset.inStock) {
				return <ColouredSpan bg='green'>Available</ColouredSpan>;
			} else {
				return <ColouredSpan bg='red'>Out Of Stock</ColouredSpan>;
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
					<Image width='auto' height='250px' src={asset?.cdn} />
				</ImageContainer>
			}
			actions={actions || []}
			{...(onCardClick ? { onClick: (): void => onCardClick(asset._id) } : {})}
			hoverable={hoverable}
		>
			<Row>
				<Col span={24}>
					<Row gutter={[4, 4]} justify='space-between'>
						<Col>
							<Row gutter={[4, 4]}>
								<Col>
									<DollarCircleFilled />
								</Col>
								<Col>
									<Text strong>{getValueSafely<string | number>(() => asset.price, "N/A")}</Text>
								</Col>
							</Row>
						</Col>
						<Col>
							{availability && (
								<Col span={24}>
									<Row>
										<Col>
											<Text strong>{availability}</Text>
										</Col>
									</Row>
								</Col>
							)}
						</Col>
					</Row>
				</Col>
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
									href={getValueSafely(() => `${asset.retailLink}`, "#")}
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
						target='_blank'
						href={getValueSafely(() => `/assetstore/assetdetails?assetId=${asset._id}`, "#")}
					>
						{getValueSafely(() => asset.name, "N/A")}
					</Link>
				</Col>
				{!noVertical && (
					<Col span={24}>
						<Row gutter={[4, 4]}>
							<Col span={8}>
								<Text style={{ width: "100%", overflow: "hidden" }} ellipsis strong>
									Vertical:{" "}
								</Text>
							</Col>
							<Col span={16}>
								<CapitalizedText style={{ width: "100%", overflow: "hidden" }} ellipsis>{` ${getValueSafely<string>(
									() => asset.meta.vertical as string,
									"Undefined"
								)}`}</CapitalizedText>
							</Col>
						</Row>
					</Col>
				)}

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

				{((asset?.incentive && asset?.incentive !== 0) ||
					(asset?.retailer?.incentive?.designer && asset?.retailer?.incentive?.designer !== 0)) &&
					(user.role === Role.Owner ||
						user.role === Role.Admin ||
						user.role === Role.Designer ||
						user.role === Role["Account Manager"]) && (
						<Col style={{ background: "rgb(151, 207, 151)", padding: "0px 20px" }} span={24}>
							<Row gutter={[4, 4]} justify='space-between'>
								<Col>
									<Text style={{ width: "100%", overflow: "hidden" }} ellipsis strong>
										Incentive:{" "}
									</Text>
								</Col>
								<Col>
									<Col>
										<DollarCircleFilled />{" "}
										<Text>
											{(((asset?.incentive ?? asset?.retailer?.incentive?.designer) / 100) * asset.price).toFixed(2)}
										</Text>
									</Col>
								</Col>
							</Row>
						</Col>
					)}
			</Row>
		</Card>
	);
};

export default ProductCard;
