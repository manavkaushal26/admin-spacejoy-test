import React from "react";
import styled from "styled-components";

const getHeight = function getHeight(size) {
	switch (size) {
		case "sm":
			return "24px";
		case "md":
			return "32px";
		case "lg":
			return "40px";
		default:
			return "32px";
	}
};

const ButtonStyled = styled.button`
	line-height: 1.5;
	position: relative;
	display: inline-block;
	font-weight: 400;
	white-space: nowrap;
	text-align: center;
	background-image: none;
	border: 1px solid transparent;
	box-shadow: 0 2px 0 rgba(0, 0, 0, 0.015);
	cursor: pointer;
	transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
	user-select: none;
	touch-action: manipulation;
	-webkit-appearance: none;
	outline: none;
	height: ${({ size }) => getHeight(size)};
	padding: 0 15px;
	border-radius: 2px;
	color: rgba(0, 0, 0, 0.65);
	background-color: #fff;
	border-color: #d9d9d9;
	margin: 0 0.5rem;
	&:first-child {
		margin-left: 0;
	}
	&:last-child {
		margin-right: 0;
	}
	&:active {
		box-shadow: 0 0px 0 rgba(0, 0, 0, 0.015);
	}
	&:hover,
	&:focus {
		color: ${({ theme }) => theme.colors.primary};
		background-color: ${({ theme }) => theme.colors.white};
		border-color: ${({ theme }) => theme.colors.primary};
	}
`;

function Button(props) {
	return <ButtonStyled {...props} />;
}

export default Button;
