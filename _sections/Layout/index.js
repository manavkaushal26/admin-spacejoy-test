import GlobalStyle from "@theme/globalStyle";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import Footer from "../Footer";
import Header from "../Header";

const dev = process.env.NODE_ENV !== "production";

const MainStyled = styled.main`
	margin-top: 60px;
	min-height: 50vh;
	position: relative;
	&.client-server-identifier {
		&:after {
			content: "";
			position: fixed;
			z-index: 100;
			top: 50vh;
			left: 0;
			margin-top: -2.5rem;
			height: 5rem;
			width: 5px;
			background: ${({ isServer }) => (isServer ? "red" : "green")};
		}
	}
`;

function Layout({ isServer, authVerification, children }) {
	return (
		<>
			<GlobalStyle />
			<Header authVerification={authVerification} />
			<MainStyled isServer={isServer} className={dev ? "client-server-identifier" : ""}>
				{children}
			</MainStyled>
			<Footer />
		</>
	);
}

Layout.defaultProps = {
	isServer: undefined,
	authVerification: {}
};

Layout.propTypes = {
	children: PropTypes.node.isRequired,
	isServer: PropTypes.bool,
	authVerification: PropTypes.shape({})
};

export default Layout;
