import Image from "@components/Image";
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

function ItemCard() {
	return (
		<>
			<ItemCardStyled>
				<ThumbnailStyled>
					<Image src="https://res.cloudinary.com/spacejoy/image/upload/c_scale,w_200/v1567248421/web/sofa_uvcr02.jpg" />
				</ThumbnailStyled>
				<ItemCardFooterStyled>
					<div>
						<ItemNameStyled>Anthropologie</ItemNameStyled>
						<PriceStyled>
							<strong>Price</strong>: $ 7695
						</PriceStyled>
					</div>
					<div>
						<Image
							size="xs"
							src="https://res.cloudinary.com/spacejoy/image/upload/v1567248916/shared/cart_nynqqa.svg"
						/>
					</div>
				</ItemCardFooterStyled>
			</ItemCardStyled>
			<ItemCardStyled>
				<ThumbnailStyled>
					<Image src="https://res.cloudinary.com/spacejoy/image/upload/c_scale,w_200/v1567248422/web/table_xr6uk8.jpg" />
				</ThumbnailStyled>
				<ItemCardFooterStyled>
					<div>
						<ItemNameStyled>Restoration Hardware</ItemNameStyled>
						<PriceStyled>
							<strong>Price</strong>: $ 7695
						</PriceStyled>
					</div>
					<div>
						<Image
							size="xs"
							src="https://res.cloudinary.com/spacejoy/image/upload/v1567248916/shared/cart_nynqqa.svg"
						/>
					</div>
				</ItemCardFooterStyled>
			</ItemCardStyled>
		</>
	);
}

ItemCard.defaultProps = {};

ItemCard.propTypes = {};

export default ItemCard;
