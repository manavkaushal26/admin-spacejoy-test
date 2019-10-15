import Button from "@components/Button";
import Image from "@components/Image";
import Link from "next/link";
import PropTypes from "prop-types";
import React, { PureComponent } from "react";
import styled from "styled-components";

const PriceCardWrapperStyled = styled.div`
	position: relative;
	overflow: hidden;
	border-radius: 2px;
	padding: 2rem;
	background-color: ${({ variant, theme }) =>
		variant === "recommend" ? theme.colors.mild.red : theme.colors.bg.light2};
`;

const RecommendBannerStyled = styled.small`
	color: ${({ theme }) => theme.colors.primary1};
	position: absolute;
	right: -1rem;
	text-transform: uppercase;
	transform: rotate(90deg);
	transform-origin: bottom;
`;

const PriceCardHeaderStyled = styled.div`
	padding: 2rem 0;
	h2 {
		margin: 0;
		& + small {
			font-size: 1rem;
			color: ${({ theme }) => theme.colors.fc.dark2};
		}
	}
`;

const PriceCardBodyStyled = styled.div`
	img {
		height: 150px;
	}
	p {
		text-align: left;
		height: 80px;
	}
`;

const PriceCardFooterStyled = styled.div`
	padding: 2rem 0;
`;

class PriceCard extends PureComponent {
	static Header = ({ title, subTitle, variant }) => (
		<PriceCardHeaderStyled>
			{variant === "recommend" && <RecommendBannerStyled>Recommended</RecommendBannerStyled>}
			<h2>{title}</h2>
			<small>{subTitle}</small>
		</PriceCardHeaderStyled>
	);

	static Body = ({ price, description, thumbnail }) => (
		<PriceCardBodyStyled>
			<Image src={thumbnail} height="150px" />
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
