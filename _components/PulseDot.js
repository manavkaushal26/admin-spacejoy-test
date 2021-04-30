import React from "react";
import styled, { keyframes } from "styled-components";

const pulse = keyframes`
	0% {
		opacity:1;
		transform: scale(0.5);
	}
	100% {
		opacity:0;
		transform: scale(1.5);
	}
`;

const PulseDotStyled = styled.span`
	display: inline-block;
	position: relative;
	background: ${({ theme }) => theme.colors.primary1};
	border-radius: 3px;
	height: 6px;
	width: 6px;
	top: -10px;
	&:before {
		content: "";
		position: absolute;
		background: ${({ theme }) => theme.colors.primary2};
		top: -7px;
		left: -7px;
		height: 20px;
		width: 20px;
		border-radius: 10px;
		transform: scale(0.5);
		opacity: 1;
		animation: ${pulse} 1s infinite;
		animation-fill-mode: forwards;
	}
`;

const PulseDot = () => <PulseDotStyled />;

export default React.memo(PulseDot);
