import leftArrow from "@static/images/left.svg";
import rightArrow from "@static/images/right.svg";
import PropTypes from "prop-types";
import React from "react";
import Slider from "react-slick";
import styled from "styled-components";
import ButtonBase from "./Button/ButtonBaseStyle";

const BaseArrowsStyled = styled(ButtonBase)`
	position: absolute;
	padding: 1rem;
	top: 50%;
	margin-top: -16px;
	z-index: 1;
`;

const NextStyled = styled(BaseArrowsStyled)`
	background: white url(${rightArrow}) center no-repeat;
	background-size: 20px;
	right: 0;
`;

const PrevStyled = styled(BaseArrowsStyled)`
	background: white url(${leftArrow}) center no-repeat;
	background-size: 20px;
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
	nextArrow: <NextStyled onClick={() => this.slider.slickNext()} />,
	prevArrow: <PrevStyled onClick={() => this.slider.slickPrev()} />,
	responsive: [
		{
			breakpoint: 480,
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
