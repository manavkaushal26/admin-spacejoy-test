import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import Header from "./Header";

const MainStyled = styled.div`
	background: white;
	margin-top: 55px;
`;

function Layout({ header, children }) {
	return (
		<>
			<Header variant={header} />
			<MainStyled>{children}</MainStyled>
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
