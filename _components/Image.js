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
`;

function Image({ src, size }) {
	return <ImageStyled src={src} size={size} />;
}

Image.defaultProps = {
	size: "full"
};

Image.propTypes = {
	src: PropTypes.string.isRequired,
	size: PropTypes.string
};

export default Image;
