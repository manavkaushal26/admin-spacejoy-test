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
					<Image src="https://api.homefuly.com/assets/5d5e78f3c8ac32675c61d75b/5d5e78f3c8ac32675c61d75b.jpg" />
				</ThumbnailStyled>
				<ItemCardFooterStyled>
					<div>
						<ItemNameStyled>Anthropologie</ItemNameStyled>
						<PriceStyled>
							<strong>Price</strong>: $ 7695
						</PriceStyled>
					</div>
					<div>
						<Image size="xs" src="https://image.flaticon.com/icons/svg/126/126510.svg" />
					</div>
				</ItemCardFooterStyled>
			</ItemCardStyled>
			<ItemCardStyled>
				<ThumbnailStyled>
					<Image src="https://api.homefuly.com/assets/5d5e9d426815d405db09a1ff/5d5e9d426815d405db09a1ff.jpg" />
				</ThumbnailStyled>
				<ItemCardFooterStyled>
					<div>
						<ItemNameStyled>Restoration Hardware</ItemNameStyled>
						<PriceStyled>
							<strong>Price</strong>: $ 7695
						</PriceStyled>
					</div>
					<div>
						<Image size="xs" src="https://image.flaticon.com/icons/svg/126/126510.svg" />
					</div>
				</ItemCardFooterStyled>
			</ItemCardStyled>
		</>
	);
}

ItemCard.defaultProps = {};

ItemCard.propTypes = {};

export default ItemCard;
