import PropTypes from "prop-types";
import React from "react";
import Slider from "react-slick";

// function SampleNextArrow(props) {
// 	const { className, style, onClick } = props;
// 	return <div className={className} style={{ ...style, display: "block", background: "red" }} onClick={onClick} />;
// }

// function SamplePrevArrow(props) {
// 	const { className, style, onClick } = props;
// 	return <div className={className} style={{ ...style, display: "block", background: "green" }} onClick={onClick} />;
// }

const settings = {
	dots: true,
	infinite: true,
	speed: 500,
	slidesToShow: 4,
	slidesToScroll: 4
	// nextArrow: <SampleNextArrow />,
	// prevArrow: <SamplePrevArrow />
};

function Carousel({ children }) {
	return <Slider {...settings}>{children}</Slider>;
}

Carousel.propTypes = {
	children: PropTypes.node.isRequired
};

export default Carousel;
