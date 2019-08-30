import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const CarouselWrapperStyled = styled.div`
	margin: 2rem 0;
`;

function Carousel({ children }) {
	return <CarouselWrapperStyled>{children}</CarouselWrapperStyled>;
}

Carousel.propTypes = {
	children: PropTypes.element.isRequired
};

export default Carousel;
