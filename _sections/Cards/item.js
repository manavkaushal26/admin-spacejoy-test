import Image from "@components/Image";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const ProductImageWrapperStyled = styled.div`
	background: ${({ theme, url }) => `${theme.colors.bg.light2} url('${url}')`};
	height: 130px;
	background-repeat: no-repeat;
	background-position: center;
`;

const ProductNameStyled = styled.h5`
	margin: 0;
	font-weight: normal;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
`;

const ProductPriceStyled = styled.h3`
	margin: 0;
`;

const ProductExternalLinkStyled = styled.button`
	padding: 0.35rem 0.75rem;
	border: 1px solid ${({ theme }) => theme.colors.bg.dark1};
	float: right;
	background: transparent;
	font-size: 0.8rem;
	outline: none;
	color: ${({ theme }) => theme.colors.fc.dark1};
	&:hover {
		color: ${({ theme }) => theme.colors.primary};
		border: 1px solid ${({ theme }) => theme.colors.primary};
	}
`;

const ProductLoadMoreStyled = styled.div`
	width: 100%;
	height: 130px;
	padding: 1rem;
	box-shadow: 0 0 10px 0px rgba(0, 0, 0, 0.1);
	div {
		border: 1px dashed ${({ theme }) => theme.colors.bg.light2};
		display: flex;
		flex-direction: column;
		height: calc(130px - 2rem);
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

function ItemCard({ products }) {
	return (
		<div className="grid justify-space-between">
			{products.map(product => (
				<div className="col-xs-6" key={product.productId}>
					<div className="grid">
						<div className="col-xs-12 justify-space-between">
							<ProductImageWrapperStyled url={product.productImage} />
						</div>
						<div className="col-xs-8 col-bleed-y">
							<ProductNameStyled>{product.productName}</ProductNameStyled>
							<ProductPriceStyled>$ {product.productCost}</ProductPriceStyled>
						</div>
						<div className="col-xs-4 col-bleed-y">
							<a href={product.productExternalUrl} target="_blank" rel="noopener noreferrer">
								<ProductExternalLinkStyled>Buy Now</ProductExternalLinkStyled>
							</a>
						</div>
					</div>
				</div>
			))}
			<div className="col-xs-6">
				<div className="grid">
					<div className="col-xs-12">
						<ProductLoadMoreStyled>
							<div>
								<Image
									size="10px"
									src="https://res.cloudinary.com/spacejoy/image/upload/v1568717082/web/design-devider_kqs0bb.png"
								/>
								<span>Load More...</span>
								<Image
									size="10px"
									src="https://res.cloudinary.com/spacejoy/image/upload/v1568717082/web/design-devider_kqs0bb.png"
								/>
							</div>
						</ProductLoadMoreStyled>
					</div>
				</div>
			</div>
		</div>
	);
}

ItemCard.defaultProps = {
	products: []
};

ItemCard.propTypes = {
	products: PropTypes.arrayOf(PropTypes.shape({}))
};

export default ItemCard;
