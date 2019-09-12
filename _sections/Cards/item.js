import Image from "@components/Image";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const ItemCardStyled = styled.div`
	height: 215px;
	width: 180px;
	margin-right: 2rem;
	display: inline-block;
`;

const ThumbnailStyled = styled.div`
	height: 165px;
	border-radius: 5px;
	overflow: hidden;
	text-align: center;
	img {
		width: 100%;
	}
`;

const ItemNameStyled = styled.strong`
	margin: 0.5rem 0 0.25rem 0;
	display: inline-block;
`;

const PriceStyled = styled.span`
	display: block;
`;

const ItemCardFooterStyled = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

function ItemCard({ products }) {
	return (
		<>
			{products.map(product => (
				<ItemCardStyled key={product.productId}>
					<ThumbnailStyled>
						<Image src={product.productImage} />
					</ThumbnailStyled>
					<ItemCardFooterStyled>
						<div>
							<ItemNameStyled>{product.productName}</ItemNameStyled>
							<PriceStyled>
								<strong>Price</strong>: $ {product.productCost}
							</PriceStyled>
						</div>
						<div>
							<a href={product.productExternalUrl} rel="noopener noreferrer" target="_blank">
								<Image
									size="xs"
									src="https://res.cloudinary.com/spacejoy/image/upload/v1567248916/shared/cart_nynqqa.svg"
								/>
							</a>
						</div>
					</ItemCardFooterStyled>
				</ItemCardStyled>
			))}
		</>
	);
}

ItemCard.defaultProps = {
	products: []
};

ItemCard.propTypes = {
	products: PropTypes.arrayOf(PropTypes.shape({}))
};

export default ItemCard;
