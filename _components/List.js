import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const ListStyled = styled.ul`
	padding: 0;
	margin: 0;
	li {
		list-style: none;
		padding: ${({ direction }) => (direction === "horizontal" ? "0.5rem" : "0.25rem 0")};
		display: ${({ direction }) => (direction === "horizontal" ? "inline-block" : "block")};
		&:first-child {
			padding-left: 0;
		}
		&:last-child {
			padding-right: 0;
		}
		a {
			color: ${({ theme }) => theme.colors.fc.dark1};
		}
	}
`;

function List({ direction, children }) {
	return <ListStyled direction={direction}>{children}</ListStyled>;
}

List.defaultProps = {
	direction: "",
};

List.propTypes = {
	direction: PropTypes.string,
	children: PropTypes.node.isRequired,
};

export default List;
