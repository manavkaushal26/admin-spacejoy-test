import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import Footer from "../Footer";
import Header from "../Header";

const MainStyled = styled.main`
	margin-top: 60px;
	min-height: 50vh;
`;

function Layout({ header, children }) {
	return (
		<>
			<Header variant={header} />
			<MainStyled>{children}</MainStyled>
			<Footer />
		</>
	);
}

Layout.propTypes = {
	children: PropTypes.node.isRequired,
	header: PropTypes.string
};

Layout.defaultProps = {
	header: "solid"
};

export default Layout;
