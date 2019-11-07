import Divider from "@components/Divider";
import { removeSpaces } from "@utils/helper";
import Link from "next/link";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const ProductImageWrapperStyled = styled.div`
	background: ${({ url, theme }) => `${theme.colors.bg.light2} url('${url}')`};
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

const ProductExternalLinkStyled = styled.button`
	padding: 0.35rem 0.75rem;
	border: 1px solid ${({ theme }) => theme.colors.bg.dark1};
	float: right;
	cursor: pointer;
	background: transparent;
	font-size: 0.8rem;
	outline: none;
	color: ${({ theme }) => theme.colors.fc.dark1};
	&:hover {
		color: ${({ theme }) => theme.colors.primary1};
		border: 1px solid ${({ theme }) => theme.colors.primary1};
	}
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

function ItemCard({ products, gridCount, designName, designId, showLoadMore, size, secure }) {
	const designNameClean = removeSpaces(designName);
	return (
		<div className="grid">
			{products.map(product => (
				<div className={`col-xs-${gridCount}`} key={product.productId}>
					<div className="grid">
						<div className="col-12 justify-space-between col-bleed-y">
							<ProductImageWrapperStyled
								url={
									secure
										? `https://api.spacejoy.com/api/file/download?url=${product.productImage}`
										: product.productImage
								}
								size={size}
							/>
						</div>
						<div className="col-7">
							<ProductNameStyled>{product.productName}</ProductNameStyled>
							<ProductBrandStyled>{product.productRetailer}</ProductBrandStyled>
							<ProductPriceStyled>$ {product.productCost}</ProductPriceStyled>
						</div>
						<div className="col-5">
							<a href={product.productExternalUrl} target="_blank" rel="noopener noreferrer">
								<ProductExternalLinkStyled>Buy Now</ProductExternalLinkStyled>
							</a>
						</div>
					</div>
				</div>
			))}
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
											<span>See All Products</span>
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
	products: [],
	gridCount: 6,
	showLoadMore: false,
	size: "130",
	secure: false
};

ItemCard.propTypes = {
	products: PropTypes.arrayOf(PropTypes.shape({})),
	gridCount: PropTypes.number,
	designName: PropTypes.string.isRequired,
	designId: PropTypes.string.isRequired,
	showLoadMore: PropTypes.bool,
	size: PropTypes.string,
	secure: PropTypes.bool
};

export default ItemCard;
