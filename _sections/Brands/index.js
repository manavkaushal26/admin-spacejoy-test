import Image from "@components/Image";
import ProductBrands from "@mocks/ProductBrands";
import React from "react";
import styled from "styled-components";

const PartnerBrandStyled = styled.div`
	height: 125px;
	display: flex;
	justify-content: center;
	align-items: center;
	border-top: 1px solid ${({ theme }) => theme.colors.bg.light2};
	border-right: 1px solid ${({ theme }) => theme.colors.bg.light2};
	&:hover {
		img {
			opacity: 1;
		}
	}
	img {
		transition: opacity linear 100ms;
		opacity: 0.8;
		height: ${({ height }) => height};
	}
	@media (max-width: 576px) {
		height: 75px;
	}
`;

export default function index() {
	return (
		<div className="grid grid-bleed">
			{ProductBrands.map((brand, i) => (
				<div className={`${i === 2 || i === 5 ? "col-12" : "col-6"} col-xs-6 col-sm-4 col-md-2`} key={brand.name}>
					<PartnerBrandStyled height={brand.size}>
						<Image height={brand.size} src={brand.url} alt={brand.name} />
					</PartnerBrandStyled>
				</div>
			))}
		</div>
	);
}
