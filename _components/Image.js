import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const ImageStyled = styled.img`
	background: "pink";
`;

function Image({ src }) {
	return <ImageStyled src={src} />;
}

Image.propTypes = {
	src: PropTypes.string.isRequired
};

export default Image;
