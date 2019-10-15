import PropTypes from "prop-types";
import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

function Image({ src, height, width, alt, circle, ...props }) {
	return (
		<LazyLoadImage {...props} src={src} alt={alt} width={width} height={height} className={circle ? "circle" : ""} />
	);
}

Image.defaultProps = {
	alt: "spacejoy",
	width: "auto",
	height: "auto",
	circle: false
};

Image.propTypes = {
	src: PropTypes.string.isRequired,
	alt: PropTypes.string,
	width: PropTypes.string,
	height: PropTypes.string,
	circle: PropTypes.bool
};

export default Image;
