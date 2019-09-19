import PropTypes from "prop-types";
import React from "react";
import Slider from "react-slick";
import styled from "styled-components";
import ButtonBase from "./Button/ButtonBaseStyle";

const Arrows = {
	left: "https://res.cloudinary.com/spacejoy/image/upload/c_scale,h_30/v1567694806/shared/left-dark_youtzq.svg",
	right: "https://res.cloudinary.com/spacejoy/image/upload/c_scale,h_30/v1567694807/shared/right-dark_sxnqtv.svg"
};

const BaseArrowsStyled = styled(ButtonBase)`
	position: absolute;
	padding: 1rem;
	top: 50%;
	margin-top: -16px;
	z-index: 1;
`;

const NextStyled = styled(BaseArrowsStyled)`
	background: white url(${Arrows.right}) center no-repeat;
	background-size: 20px;
	right: 0;
`;

const PrevStyled = styled(BaseArrowsStyled)`
	background: white url(${Arrows.left}) center no-repeat;
	background-size: 20px;
	left: 0;
`;

function prev() {
	this.slider.slickPrev();
}

function next() {
	this.slider.slickNext();
}

function NextArrow({ onClick }) {
	return <NextStyled primary onClick={onClick} />;
}

NextArrow.propTypes = {
	onClick: PropTypes.func.isRequired
};

function PrevArrow({ onClick }) {
	return <PrevStyled primary onClick={onClick} />;
}

PrevArrow.propTypes = {
	onClick: PropTypes.func.isRequired
};

const settings = {
	dots: false,
	infinite: true,
	speed: 500,
	slidesToShow: 1,
	slidesToScroll: 1,
	autoplay: false,
	autoplaySpeed: 5000,
	pauseOnHover: true,
	nextArrow: <NextArrow onClick={prev} />,
	prevArrow: <PrevArrow onClick={next} />,
	responsive: [
		{
			breakpoint: 480,
			settings: {
				slidesToShow: 1,
				slidesToScroll: 1
			}
		}
	]
};

function Carousel({ children, slidesToShow, slidesToScroll, autoplay }) {
	return (
		<Slider
			ref={slider => slider}
			{...settings}
			slidesToShow={slidesToShow}
			slidesToScroll={slidesToScroll}
			autoplay={autoplay}
		>
			{children}
		</Slider>
	);
}

Carousel.defaultProps = {
	slidesToShow: 1,
	slidesToScroll: 1,
	autoplay: false
};

Carousel.propTypes = {
	children: PropTypes.node.isRequired,
	slidesToShow: PropTypes.number,
	slidesToScroll: PropTypes.number,
	autoplay: PropTypes.bool
};

export default Carousel;
