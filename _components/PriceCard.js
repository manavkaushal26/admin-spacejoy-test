import Button from "@components/Button";
import Image from "@components/Image";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const PriceCardWrapperStyled = styled.div`
	position: relative;
	overflow: hidden;
	box-shadow: 0 0 10px 0px rgba(0, 0, 0, 0.1);
	text-align: center;
	background: white;
	width: ${({ variant }) => (variant === "recommend" ? "340px" : "300px")};
	z-index: ${({ variant }) => (variant === "recommend" ? 1 : 0)};
	margin: ${({ variant }) => (variant === "recommend" ? "-20px 0" : 0)};
	padding: ${({ variant }) => (variant === "recommend" ? "20px 0" : 0)};
	border-radius: 2px;
`;

const RecommendBannerStyled = styled.div`
	padding: 0.25rem;
	background: ${({ theme }) => theme.colors.primary};
	color: white;
	position: absolute;
	width: 120px;
	top: 20px;
	right: -30px;
	font-size: 0.8rem;
	transform: rotate(45deg);
`;

const PriceCardHeaderStyled = styled.div`
	padding: 2rem 0;
	h2 {
		margin: 0;
		small {
			font-family: "system";
			font-weight: normal;
			font-size: 1rem;
			color: ${({ theme }) => theme.colors.fc.dark2};
		}
	}
`;

const PriceCardBodyStyled = styled.div`
	width: 250px;
	margin: auto;
`;
const PriceCardFooterStyled = styled.div`
	padding: 2rem 0;
`;

function PriceCard({ variant }) {
	return (
		<PriceCardWrapperStyled variant={variant}>
			<PriceCardHeaderStyled>
				{variant === "recommend" && <RecommendBannerStyled>Recommend</RecommendBannerStyled>}
				<h2>
					Consultation
					<br />
					<small>Advice & Inspiration</small>
				</h2>
			</PriceCardHeaderStyled>
			<PriceCardBodyStyled>
				<Image src="https://storage.googleapis.com/isuite-artifacts/homeWeb2/spacejoy/Examples_Starter1.jpg" />
				<h2>$19</h2>
				<p>Need a new layout in 3D of your current space with the existing furniture & upgrade advice on key pieces</p>
			</PriceCardBodyStyled>
			<PriceCardFooterStyled>
				<Button>Select</Button>
			</PriceCardFooterStyled>
		</PriceCardWrapperStyled>
	);
}

PriceCard.defaultProps = {
	variant: "normal"
};

PriceCard.propTypes = {
	variant: PropTypes.string
};

export default PriceCard;
