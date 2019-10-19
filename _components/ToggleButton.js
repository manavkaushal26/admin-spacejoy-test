import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const ToggleWrapperStyled = styled.div`
	background: white;
	position: relative;
	display: flex;
	margin-bottom: 2rem;
	&:after {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		width: 50%;
		background: ${({ theme }) => theme.colors.mild.red};
		transition: all ease-in 0.25s;
	}
	&.freeTrial {
		&:after {
			left: 0;
		}
		button:first-child {
			font-weight: bold;
			color: ${({ theme }) => theme.colors.accent};
			border: 1px solid ${({ theme }) => theme.colors.accent};
		}
	}
	&.payNow {
		&:after {
			left: 50%;
		}
		button:last-child {
			font-weight: bold;
			color: ${({ theme }) => theme.colors.accent};
			border: 1px solid ${({ theme }) => theme.colors.accent};
		}
	}
	button {
		flex: 1;
		z-index: 1;
		border: 1px solid ${({ theme }) => theme.colors.white};
	}
`;

function ToggleButton({ children, className }) {
	return <ToggleWrapperStyled className={className}>{children}</ToggleWrapperStyled>;
}
ToggleButton.defaultProps = {
	children: null,
	className: ""
};

ToggleButton.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string
};

export default ToggleButton;
