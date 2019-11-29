import { cloudinary } from "@utils/config";
import PropTypes from "prop-types";
import React from "react";
import { LazyLoadImage, trackWindowScroll } from "react-lazy-load-image-component";

interface ImageProps {
	src: string;
	height: string;
	width: string;
	alt: string;
	shape: string;
	noLazy: boolean;
}

function Image({ src, height, width, alt, shape, nolazy, scrollPosition, ...props }) {
	const source =
		src.includes("storage.googleapis.com") || src.includes("api.homefuly.com")
			? src
			: `${cloudinary.baseDeliveryURL}/image/upload/${src}`;
	return (
		<LazyLoadImage
			{...props}
			src={source}
			alt={alt}
			width={width}
			height={height}
			scrollPosition={scrollPosition}
			visibleByDefault={nolazy}
			className={shape}
		/>
	);
}

Image.defaultProps = {
	alt: "spacejoy",
	width: "auto",
	height: "auto",
	shape: "",
	nolazy: false,
	scrollPosition: {}
};

Image.propTypes = {
	src: PropTypes.string.isRequired,
	alt: PropTypes.string,
	width: PropTypes.string,
	height: PropTypes.string,
	shape: PropTypes.string,
	nolazy: PropTypes.bool,
	scrollPosition: PropTypes.shape({})
};

export default React.memo(trackWindowScroll(Image));
