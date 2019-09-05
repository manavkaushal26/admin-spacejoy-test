import Link from "next/link";
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

const ActiveLink = props => {
	const {
		children,
		router: { pathname },
		href
	} = props;
	const orgProps = { ...props };
	delete orgProps.router;
	return (
		<Link {...orgProps}>
			{pathname === href ? (
				<ActiveStyled href={href}>{children}</ActiveStyled>
			) : (
				<NormalStyled href={href}>{children}</NormalStyled>
			)}
		</Link>
	);
};

ActiveLink.propTypes = {
	children: PropTypes.node.isRequired,
	router: PropTypes.shape({
		pathname: PropTypes.string
	}).isRequired,
	href: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({})]).isRequired
};

ActiveLink.defaultProps = {};

export default withRouter(ActiveLink);
