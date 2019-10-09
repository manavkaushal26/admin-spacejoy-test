import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const ImageStyled = styled.img`
	vertical-align: bottom;
	height: ${({ size }) => {
		switch (size) {
			case "xs":
				return "20px";
			case "sm":
				return "30px";
			case "md":
				return "40px";
			case "full":
				return "auto";
			default:
				return size;
		}
	}};
	border-radius: ${({ circle }) => (circle ? "50%" : "0")};
`;

function Image({ src, size, alt, circle, ...props }) {
	return <ImageStyled circle={circle} src={src} size={size} alt={alt} {...props} />;
}

Image.defaultProps = {
	size: "full",
	alt: "spacejoy",
	circle: false
};

Image.propTypes = {
	src: PropTypes.string.isRequired,
	size: PropTypes.string,
	alt: PropTypes.string,
	circle: PropTypes.bool
};

export default Image;
