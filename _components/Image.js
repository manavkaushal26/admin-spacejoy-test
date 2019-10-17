import PropTypes from "prop-types";
import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import styled from "styled-components";

const ImageStyled = styled.img`
	vertical-align: bottom;
`;

function Image({ src, height, width, alt, circle, nolazy, ...props }) {
	return nolazy ? (
		<ImageStyled {...props} src={src} alt={alt} width={width} height={height} className={circle ? "circle" : ""} />
	) : (
		<LazyLoadImage {...props} src={src} alt={alt} width={width} height={height} className={circle ? "circle" : ""} />
	);
}

Image.defaultProps = {
	alt: "spacejoy",
	width: "auto",
	height: "auto",
	circle: false,
	nolazy: false
};

Image.propTypes = {
	src: PropTypes.string.isRequired,
	alt: PropTypes.string,
	width: PropTypes.string,
	height: PropTypes.string,
	circle: PropTypes.bool,
	nolazy: PropTypes.bool
};

export default Image;
