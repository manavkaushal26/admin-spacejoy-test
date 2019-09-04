import { withRouter } from "next/router";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const ActiveStyled = styled.a`
	font-weight: bold;
	color: ${({ theme }) => theme.colors.primary};
	&:hover {
		color: ${({ theme }) => theme.colors.primary};
	}
`;

const NormalStyled = styled.a`
	color: ${({ theme }) => theme.colors.fc.dark1};
	&:hover {
		color: ${({ theme }) => theme.colors.primary};
	}
`;

const ActiveLink = ({ children, router, href }) => {
	const handleClick = e => {
		e.preventDefault();
		router.push(href);
	};
	return router.pathname === href ? (
		<ActiveStyled href={href} onClick={handleClick}>
			{children}
		</ActiveStyled>
	) : (
		<NormalStyled href={href} onClick={handleClick}>
			{children}
		</NormalStyled>
	);
};

ActiveLink.propTypes = {
	children: PropTypes.node.isRequired,
	router: PropTypes.shape({
		pathname: PropTypes.string,
		push: PropTypes.func
	}).isRequired,
	href: PropTypes.string.isRequired
};

ActiveLink.defaultProps = {};

export default withRouter(ActiveLink);
