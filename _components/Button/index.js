import SVGIcon from "@components/SVGIcon";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import ButtonBase from "./ButtonBaseStyle";

const ButtonStyled = styled(ButtonBase)`
	background: ${({ theme, variant, fill }) => {
		if (fill === "ghost" || fill === "clean") {
			return "transparent";
		}
		switch (variant) {
			case "primary":
				return `linear-gradient(135deg,${theme.colors.primary1} 0%,${theme.colors.primary2} 100%)`;
			case "secondary":
				return theme.colors.primary2;
			default:
				return "transparent";
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
				return "0.3rem 0.5rem";
			case "sm":
				return "0.5rem 0.75rem";
			case "md":
				return "0.75rem 2rem";
			case "lg":
				return "1rem 2.5rem";
			default:
				return "0.75rem 1rem";
		}
	}};
	height: ${({ size }) => {
		switch (size) {
			case "xs":
				return "25px";
			case "sm":
				return "32px";
			case "md":
				return "41px";
			case "lg":
				return "48px";
			default:
				return "41px";
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
	font-weight: ${({ size }) => (size === "lg" ? "bold" : "normal")};
	border: ${({ fill, theme }) =>
		fill === "solid" || fill === "clean" ? "none" : `1px solid ${theme.colors.fc.dark2}`};
	display: ${({ full }) => (full ? "block" : "inline-block")};
	width: ${({ full }) => (full ? "100%" : "auto")};
	transition: all ease-in 0.15s;
	&:hover {
		box-shadow: ${({ fill }) => (fill === "clean" ? "none" : "0 2px 5px 0px rgba(0, 0, 0, 0.15)")};
	}
	&:disabled {
		background: ${({ theme }) => theme.colors.bg.light2};
		color: ${({ theme }) => theme.colors.fc.light2};
		border-color: ${({ theme }) => theme.colors.bg.light2};
		cursor: not-allowed;
		box-shadow: none;
	}
`;

function Button(props) {
	const { children, onClick, raw, disabled, submitInProgress } = props;

	return (
		<>
			{raw ? (
				<ButtonBase {...props} onClick={onClick}>
					{children}
				</ButtonBase>
			) : (
				<ButtonStyled {...props} onClick={onClick} disabled={submitInProgress || disabled}>
					{submitInProgress ? <SVGIcon name="spinner" className="loading-spinner" height={15} width={15} /> : children}
				</ButtonStyled>
			)}
		</>
	);
}

Button.defaultProps = {
	children: null,
	onClick: () => {},
	shape: "flat",
	variant: "secondary",
	size: "md",
	type: "button",
	fill: "solid",
	full: false,
	raw: false,
	disabled: false,
	submitInProgress: false
};

Button.propTypes = {
	children: PropTypes.node,
	onClick: PropTypes.func,
	shape: PropTypes.string,
	variant: PropTypes.string,
	size: PropTypes.string,
	type: PropTypes.string,
	fill: PropTypes.string,
	full: PropTypes.bool,
	raw: PropTypes.bool,
	disabled: PropTypes.bool,
	submitInProgress: PropTypes.bool
};

export default React.memo(Button);
