import { PushEvent } from "@utils/analyticsLogger";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import ButtonBase from "./ButtonBaseStyle";

const ButtonStyled = styled(ButtonBase)`
	background: ${({ theme, variant, fill }) => {
		if (fill === "ghost") {
			return "transparent";
		}
		switch (variant) {
			case "primary":
				return `linear-gradient(135deg,${theme.colors.primary1} 0%,${theme.colors.primary2} 100%)`;
			case "secondary":
				return theme.colors.primary2;
			default:
				return theme.colors.white;
		}
	}};
	color: ${({ theme, variant, fill }) => {
		return fill !== "ghost" && (variant === "primary" || variant === "secondary")
			? theme.colors.white
			: theme.colors.fc.dark2;
	}};
	font-size: ${({ size }) => {
		switch (size) {
			case "xs":
				return "0.75rem";
			case "sm":
				return "0.85rem";
			case "md":
				return "1rem";
			case "lg":
				return "1rem";
			default:
				return "1rem";
		}
	}};
	padding: ${({ size }) => {
		switch (size) {
			case "xs":
				return "0.25rem 0.5rem";
			case "sm":
				return "0.5rem 0.75rem";
			case "md":
				return "0.75rem 1rem";
			case "lg":
				return "1rem 2.5rem";
			default:
				return "0.75rem 1rem";
		}
	}};
	border-radius: ${({ shape }) => {
		switch (shape) {
			case "flat":
				return "0";
			case "rounded":
				return "3px";
			case "circle":
				return "50%";
			default:
				return "0";
		}
	}};
	font-weight: ${({ variant }) => (variant === "primary" ? "bold" : "normal")};
	text-shadow: ${({ variant }) => (variant === "primary" ? "1px 1px 1px rgba(0, 0, 0, 0.05);" : "none")};
	border: ${({ fill, theme }) => (fill === "solid" ? "none" : `1px solid ${theme.colors.bg.dark2}`)};
	display: ${({ full }) => (full ? "block" : "inline-block")};
	width: ${({ full }) => (full ? "100%" : "auto")};
`;

function index(props) {
	const { children, onClick, type, raw } = props;
	const onClickWithGA = e => {
		onClick(e);
		PushEvent("category", "action", "label", 10, { data: type });
	};
	return (
		<>
			{raw ? (
				<ButtonBase {...props} onClick={e => onClickWithGA(e)}>
					{children}
				</ButtonBase>
			) : (
				<ButtonStyled {...props} onClick={e => onClickWithGA(e)}>
					{children}
				</ButtonStyled>
			)}
		</>
	);
}

index.defaultProps = {
	children: null,
	onClick: () => {},
	shape: "flat",
	variant: "secondary",
	size: "md",
	type: "button",
	fill: "solid",
	full: false,
	raw: false
};

index.propTypes = {
	children: PropTypes.node,
	onClick: PropTypes.func,
	shape: PropTypes.string,
	variant: PropTypes.string,
	size: PropTypes.string,
	type: PropTypes.string,
	fill: PropTypes.string,
	full: PropTypes.bool,
	raw: PropTypes.bool
};

export default index;
