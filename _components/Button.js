import React from "react";
import styled from "styled-components";

const getHeight = function getHeight(size) {
	switch (size) {
		case "sm":
			return "24px";
		case "md":
			return "40px";
		case "lg":
			return "50px";
		case "xl":
			return "70px";
		default:
			return "32px";
	}
};

const getColor = function getColor(type) {
	switch (type) {
		case "primary":
			return ({ theme }) => theme.colors.primary;
		case "secondary":
			return ({ theme }) => theme.colors.secondary;
		case "transparent":
			return "transparent";
		default:
			return "white";
	}
};

const getBorderColor = function getBorderColor(type) {
	switch (type) {
		case "primary":
			return ({ theme }) => theme.colors.primary;
		case "secondary":
			return ({ theme }) => theme.colors.secondary;
		case "transparent":
			return "transparent";
		default:
			return ({ theme }) => theme.colors.bg.dark1;
	}
};

const ButtonStyled = styled.button`
	color: ${({ theme, type }) => (type === "primary" ? "white" : theme.colors.fc.dark1)};
	width: ${({ full }) => (full ? "100%" : "")};
	height: ${({ size }) => getHeight(size)};
	line-height: 1.5;
	position: relative;
	display: inline-block;
	white-space: nowrap;
	text-align: center;
	cursor: pointer;
	user-select: none;
	touch-action: manipulation;
	-webkit-appearance: none;
	outline: none;
	padding: 0 15px;
	background-color: ${({ type }) => getColor(type)};
	border: 1px solid ${({ type }) => getBorderColor(type)};
	border-radius: 5px;
	box-shadow: 0 2px 0 rgba(0, 0, 0, 0.015);
	transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
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
