import Button from "@components/Button";
import { removeSpaces } from "@utils/helper";
import Link from "next/link";
import React, { useMemo } from "react";
import styled from "styled-components";
import { Assets } from "@customTypes/dashboardTypes";
import { Col, Row } from "antd";
import { getValueSafely } from "@utils/commonUtils";

const ProductCardRow = styled(Row)`
	> * + * {
		margin-top: 1rem;
	}
`;

const ProductImageWrapperStyled = styled.div<{ size?: string; url?: string }>`
	background: ${({ url }): string => `url('${url}')`};
	border: 1px solid ${({ theme }): string => theme.colors.bg.light2};
	height: ${({ size }): string => `${size}px`};
	background-repeat: no-repeat;
	background-position: center;
	background-size: contain;
	width: 100%;
`;

const ProductBrandStyled = styled.h5`
	margin: 0;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
	color: ${({ theme }): string => theme.colors.primary1};
`;

const ProductNameStyled = styled(ProductBrandStyled)`
	font-weight: normal;
	font-family: "AirbnbCerealBook";
	color: ${({ theme }): string => theme.colors.fc.dark1};
`;

const ProductPriceStyled = styled.h3`
	margin: 0;
`;

const ProductLoadMoreStyled = styled.div<{ size: string }>`
	width: 100%;
	height: ${({ size }): string => `${size}px`};
	padding: 1rem;
	box-shadow: 0 0 10px 0px ${({ theme }): string => theme.colors.mild.black};
	div {
		border: 1px dashed ${({ theme }): string => theme.colors.bg.light2};
		display: flex;
		flex-direction: column;
		height: ${({ size }): string => `calc(${size}px - 2rem)`};
		justify-content: center;
		align-items: center;
		img {
			margin: 0.5rem 0;
			&:first-child {
				transform: rotate(180deg);
			}
		}
	}
`;

interface ProductCard {
	assets: Assets[];
	gridCount: number;
	designName: string;
	designId: string;
	showLoadMore?: boolean;
	size: string;
}

const removeRepeatAssets = (assets: Assets[]) => {
	const alreadyAdded: Record<string, boolean> = {};
	return assets.filter(asset => {
		if (!alreadyAdded[asset.asset._id]) {
			alreadyAdded[asset.asset._id] = true;
			return true;
		}
		return false;
	});
};

const ProductCard: React.FC<ProductCard> = ({ assets, gridCount, designName, designId, showLoadMore, size }) => {
	const designNameClean = removeSpaces(designName);

	const uniqueAssets = useMemo(
		() => removeRepeatAssets(assets.filter(asset => asset.asset.shoppable && asset.billable && !asset.hidden)),
		[assets]
	);

	return (
		<ProductCardRow justify='space-between'>
			{uniqueAssets.map(item => {
				return item.asset.shoppable && item.billable && !item.hidden ? (
					<Col md={11} lg={7} key={item._id}>
						<Row align='middle'>
							<Col span={24}>
								<ProductImageWrapperStyled
									url={`//res.cloudinary.com/spacejoy/image/upload/q_100,w_300/${getValueSafely(
										() => item.asset.cdn,
										"N/A"
									)}`}
									size={size}
								/>
							</Col>

							<Col span={14}>
								<ProductBrandStyled>{getValueSafely(() => item.asset.retailer.name, "N/A")}</ProductBrandStyled>
								<ProductNameStyled>{getValueSafely(() => item.asset.name, "N/A")}</ProductNameStyled>
								<ProductPriceStyled>$ {getValueSafely(() => item.asset.price, NaN)}</ProductPriceStyled>
							</Col>
							<Col span={10}>
								<Row justify='end'>
									<a href={item.asset.retailLink} target='_blank' rel='noopener noreferrer'>
										<Button
											variant='secondary'
											fill='ghost'
											size='xs'
											action='buy product'
											label={`buy product > ${item.asset.retailLink}`}
											event='buyProduct'
											data={{ SectionName: "Product Buy Link" }}
										>
											Buy Now
										</Button>
									</a>
								</Row>
							</Col>
						</Row>
					</Col>
				) : null;
			})}
			{showLoadMore && (
				<div className={`col-xs-${gridCount}`}>
					<div className='grid'>
						<div className='col-xs-12'>
							<Link
								href={{ pathname: "/designView", query: { designName: designNameClean, designId } }}
								as={`/designView/${designNameClean}/${designId}`}
							>
								<a href={`/designView/${designNameClean}/${designId}`}>
									<ProductLoadMoreStyled size={size}>
										<div>
											<span>See All Products</span>
										</div>
									</ProductLoadMoreStyled>
								</a>
							</Link>
						</div>
					</div>
				</div>
			)}
		</ProductCardRow>
	);
};

export default ProductCard;
