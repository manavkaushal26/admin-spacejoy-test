import PropTypes from "prop-types";
import React from "react";
import Slider from "react-slick";
import styled from "styled-components";
import { ButtonBase } from "./Button/ButtonBaseStyle";
import SVGIcon from "./SVGIcon";

const BaseArrowsStyled = styled(ButtonBase)`
	position: absolute;
	top: 50%;
	margin-top: -16px;
	z-index: 1;
	padding: 0.5rem;
	background: ${({ theme }) => theme.colors.white};
`;

const NextStyled = styled(BaseArrowsStyled)`
	right: 0;
`;

const PrevStyled = styled(BaseArrowsStyled)`
	left: 0;
`;

const settings = {
	lazyLoad: "ondemand",
	dots: false,
	infinite: true,
	speed: 500,
	slidesToShow: 1,
	slidesToScroll: 1,
	autoplay: false,
	autoplaySpeed: 5000,
	pauseOnHover: true,
	nextArrow: (
		<NextStyled onClick={() => this.slider.slickNext()}>
			<SVGIcon name='right' />
		</NextStyled>
	),
	prevArrow: (
		<PrevStyled onClick={() => this.slider.slickPrev()}>
			<SVGIcon name='left' />
		</PrevStyled>
	),
	responsive: [
		{
			breakpoint: 580,
			settings: {
				slidesToShow: 1,
				slidesToScroll: 1,
			},
		},
	],
};

function Carousel({ children, ...props }) {
	return (
		<Slider {...settings} {...props} ref={slider => slider}>
			{children}
		</Slider>
	);
}

Carousel.defaultProps = {};

Carousel.propTypes = {
	children: PropTypes.node.isRequired,
};

export default Carousel;
