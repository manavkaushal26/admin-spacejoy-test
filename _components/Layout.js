import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import Header from "./Header";

const LayoutStyled = styled.div`
  background: white;
`;

function Layout({ header, children }) {
  return (
    <LayoutStyled>
      <Header variant={header} />
      {children}
    </LayoutStyled>
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
