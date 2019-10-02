import Image from "@components/Image";
import dividerImg from "@static/images/divider.svg";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const DividerStyled = styled.div`
	margin: 2rem 0;
	height: 1px;
	background: ${({ theme }) => theme.colors.bg.dark1};
`;

function Divider({ fancy, size }) {
	return fancy ? <Image size={size} src={dividerImg} alt="divider" /> : <DividerStyled />;
}

Divider.propTypes = {
	size: PropTypes.string,
	fancy: PropTypes.bool
};
Divider.defaultProps = {
	size: "md",
	fancy: false
};
export default Divider;
