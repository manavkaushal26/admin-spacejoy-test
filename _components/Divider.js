import Image from "@components/Image";
import dividerImg from "@static/images/divider.svg";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const DividerStyled = styled.div`
	height: 1px;
	margin: 2rem 0;
	background: ${({ theme }) => theme.colors.bg.light2};
`;

function Divider({ fancy, size }) {
	return fancy ? <Image width={size} src={dividerImg} alt="divider" /> : <DividerStyled />;
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
