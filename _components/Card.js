import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const BaseCardStyled = styled.div`
	background: ${({ bg }) => bg};
	padding: 1rem;
	border-radius: 2px;
`;

function Card({ children, bg }) {
	return <BaseCardStyled bg={bg}>{children}</BaseCardStyled>;
}

Card.defaultProps = {
	children: null,
	bg: "white"
};

Card.propTypes = {
	children: PropTypes.node,
	bg: PropTypes.string
};

export default Card;
