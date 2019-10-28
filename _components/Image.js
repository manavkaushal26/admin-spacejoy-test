import PropTypes from "prop-types";
import React from "react";
import { LazyLoadImage, trackWindowScroll } from "react-lazy-load-image-component";

function Image({ src, height, width, alt, circle, nolazy, scrollPosition, ...props }) {
	return (
		<LazyLoadImage
			{...props}
			src={src}
			alt={alt}
			width={width}
			height={height}
			scrollPosition={scrollPosition}
			visibleByDefault={nolazy}
			className={circle ? "circle" : ""}
		/>
	);
}

Image.defaultProps = {
	alt: "spacejoy",
	width: "auto",
	height: "auto",
	circle: false,
	nolazy: false,
	scrollPosition: {}
};

Image.propTypes = {
	src: PropTypes.string.isRequired,
	alt: PropTypes.string,
	width: PropTypes.string,
	height: PropTypes.string,
	circle: PropTypes.bool,
	nolazy: PropTypes.bool,
	scrollPosition: PropTypes.shape({})
};

export default trackWindowScroll(Image);
