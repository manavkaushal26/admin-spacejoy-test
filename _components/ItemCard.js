import Button from "@components/Button";
import Divider from "@components/Divider";
import { removeSpaces } from "@utils/helper";
import Link from "next/link";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const ProductImageWrapperStyled = styled.div`
	background: ${({ url }) => `url('${url}')`};
	border: 1px solid ${({ theme }) => theme.colors.bg.light2};
	height: ${({ size }) => `${size}px`};
	background-repeat: no-repeat;
	background-position: center;
	background-size: contain;
`;

const ProductBrandStyled = styled.h5`
	margin: 0;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
`;

const ProductNameStyled = styled(ProductBrandStyled)`
	font-weight: normal;
`;

const ProductPriceStyled = styled.h3`
	margin: 0;
`;

const ProductLoadMoreStyled = styled.div`
	width: 100%;
	height: ${({ size }) => `${size}px`};
	padding: 1rem;
	box-shadow: 0 0 10px 0px ${({ theme }) => theme.colors.mild.black};
	div {
		border: 1px dashed ${({ theme }) => theme.colors.bg.light2};
		display: flex;
		flex-direction: column;
		height: ${({ size }) => `calc(${size}px - 2rem)`};
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

function ItemCard({ assets, gridCount, designName, designId, showLoadMore, size }) {
	const designNameClean = removeSpaces(designName);
	return (
		<div className="grid">
			{assets.map(item => {
				return item.asset.shoppable ? (
					<div className={`col-xs-${gridCount}`} key={item.asset.id}>
						<div className="grid">
							<div className="col-12 justify-space-between col-bleed-y">
								<ProductImageWrapperStyled
									url={`//res.cloudinary.com/spacejoy/image/upload/q_100,w_300/${item.asset.cdn}`}
									size={size}
								/>
							</div>
							<div className="col-8">
								<ProductNameStyled>{item.asset.name}</ProductNameStyled>
								<ProductBrandStyled>{item.asset.retailer}</ProductBrandStyled>
								<ProductPriceStyled>$ {item.asset.price}</ProductPriceStyled>
							</div>
							<div className="col-4 text-right">
								<a href={item.asset.retailLink} target="_blank" rel="noopener noreferrer">
									<Button
										variant="secondary"
										fill="ghost"
										size="xs"
										action="buy product"
										label={`buy product > ${item.asset.retailLink}`}
										event="buyProduct"
										data={{ SectionName: "Product Buy Link" }}
									>
										Buy Now
									</Button>
								</a>
							</div>
						</div>
					</div>
				) : null;
			})}
			{showLoadMore && (
				<div className={`col-xs-${gridCount}`}>
					<div className="grid">
						<div className="col-xs-12 col-bleed-y">
							<Link
								href={{ pathname: "/designView", query: { designName: designNameClean, designId } }}
								as={`/designView/${designNameClean}/${designId}`}
							>
								<a href={`/designView/${designNameClean}/${designId}`}>
									<ProductLoadMoreStyled size={size}>
										<div>
											<Divider fancy size="20px" />
											<span>See All assets</span>
											<Divider fancy size="20px" />
										</div>
									</ProductLoadMoreStyled>
								</a>
							</Link>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

ItemCard.defaultProps = {
	assets: [],
	gridCount: 6,
	showLoadMore: false,
	size: "130"
};

ItemCard.propTypes = {
	assets: PropTypes.arrayOf(PropTypes.shape({})),
	gridCount: PropTypes.number,
	designName: PropTypes.string.isRequired,
	designId: PropTypes.string.isRequired,
	showLoadMore: PropTypes.bool,
	size: PropTypes.string
};

export default ItemCard;
