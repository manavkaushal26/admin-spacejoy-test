import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const HoardingStyled = styled.div`
	padding-bottom: 1rem;
	color: ${({ theme }) => theme.colors.red};
`;

function Hoarding({ type, msg }) {
	return (
		<HoardingStyled>
			<strong>{type === "error" ? "Error" : "Info"}!</strong> <span>{msg}</span>
		</HoardingStyled>
	);
}

Hoarding.defaultProps = {
	type: "",
	msg: ""
};

Hoarding.propTypes = {
	type: PropTypes.string,
	msg: PropTypes.string
};

export default Hoarding;
