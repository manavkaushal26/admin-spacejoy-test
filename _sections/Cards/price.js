import Button from "@components/Button";
import Image from "@components/Image";
import Link from "next/link";
import PropTypes from "prop-types";
import React, { PureComponent } from "react";
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
	background: ${({ theme }) => theme.colors.accent};
	color: white;
	position: absolute;
	width: 140px;
	top: 30px;
	right: -30px;
	font-size: 0.8rem;
	text-transform: uppercase;
	transform: rotate(45deg);
`;

const PriceCardHeaderStyled = styled.div`
	padding: 2rem 0;
	h2 {
		margin: 0;
		small {
			font-weight: normal;
			font-size: 1rem;
			color: ${({ theme }) => theme.colors.fc.dark2};
		}
	}
`;

const PriceCardBodyStyled = styled.div`
	width: 250px;
	margin: auto;
	sup {
		font-weight: normal;
		font-size: 1rem;
		color: ${({ theme }) => theme.colors.fc.dark2};
	}
`;

const PriceCardFooterStyled = styled.div`
	padding: 2rem 0;
	display: flex;
	justify-content: center;
`;

class PriceCard extends PureComponent {
	static Header = ({ title, subTitle, variant }) => (
		<PriceCardHeaderStyled>
			{variant === "recommend" && <RecommendBannerStyled>Recommended</RecommendBannerStyled>}
			<h2>
				{title}
				<br />
				<small>{subTitle}</small>
			</h2>
		</PriceCardHeaderStyled>
	);

	static Body = ({ price, description, thumbnail }) => (
		<PriceCardBodyStyled>
			<Image size="190px" src={thumbnail} />
			<h2>
				{price}
				<sup>$</sup>
			</h2>
			<p>{description}</p>
		</PriceCardBodyStyled>
	);

	render() {
		const { variant, children, plan } = this.props;
		return (
			<PriceCardWrapperStyled variant={variant}>
				{React.Children.map(children, child => React.cloneElement(child, { variant }))}
				<PriceCardFooterStyled>
					<Link href={`/designMySpace?plan=${plan}`} as={`/designMySpace/${plan}`}>
						<a href={`/designMySpace/${plan}`}>
							<Button
								variant={variant === "recommend" ? "primary" : "secondary"}
								fill={variant === "recommend" ? "solid" : "ghost"}
								shape="rounded"
								size="sm"
							>
								Select {plan}
							</Button>
						</a>
					</Link>
				</PriceCardFooterStyled>
			</PriceCardWrapperStyled>
		);
	}
}

PriceCard.defaultProps = {
	variant: "normal"
};

PriceCard.propTypes = {
	variant: PropTypes.string,
	plan: PropTypes.string.isRequired,
	children: PropTypes.node.isRequired
};

export default PriceCard;
