import Link from "next/link";
import { withRouter } from "next/router";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const ActiveStyled = styled.a`
	color: ${({ theme }) => theme.colors.primary1};
	svg path {
		fill: ${({ theme }) => theme.colors.primary1};
	}
`;

const NormalStyled = styled.a`
	color: ${({ theme }) => theme.colors.fc.dark1};
	&:hover {
		color: ${({ theme }) => theme.colors.primary1};
		svg path {
			fill: ${({ theme }) => theme.colors.primary1};
		}
	}
`;

const ActiveLink = props => {
	const {
		children,
		router: { pathname },
		href,
		as
	} = props;
	const orgProps = { ...props };
	delete orgProps.router;
	return (
		<Link {...orgProps}>
			{pathname === href || pathname === href.pathname ? (
				<ActiveStyled href={as}>{children}</ActiveStyled>
			) : (
				<NormalStyled href={as}>{children}</NormalStyled>
			)}
		</Link>
	);
};

ActiveLink.propTypes = {
	children: PropTypes.node.isRequired,
	router: PropTypes.shape({
		pathname: PropTypes.string
	}).isRequired,
	href: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({})]).isRequired,
	as: PropTypes.string
};

ActiveLink.defaultProps = {
	as: ""
};

export default withRouter(ActiveLink);
