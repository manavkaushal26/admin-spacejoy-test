import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import AuthHeader from "./AuthHeader";

const HeaderStyled = styled.div`
  padding: 1rem;
  box-shadow: 0 0 10px 0px rgba(0, 0, 0, 0.1);
`;

const TransparentHeaderStyled = styled(HeaderStyled)`
  color: ${({ theme }) => theme.colors.primary};
`;

const SolidHeaderStyled = styled(HeaderStyled)`
  color: white;
  background: ${({ theme }) => theme.colors.primary};
`;

const renderHeaderBody = () => {
  return "Header";
};

function Header({ variant }) {
  switch (variant) {
    case "transparent":
      return <TransparentHeaderStyled>{renderHeaderBody()}</TransparentHeaderStyled>;
    case "solid":
      return <SolidHeaderStyled>{renderHeaderBody()}</SolidHeaderStyled>;
    case "auth":
      return <AuthHeader />;
    default:
      return <SolidHeaderStyled />;
  }
}

Header.propTypes = {
  variant: PropTypes.string
};

Header.defaultProps = {
  variant: "solid"
};

export default Header;
