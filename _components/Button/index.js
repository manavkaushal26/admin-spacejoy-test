import SVGIcon from "@components/SVGIcon";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import { ButtonNormalStyled } from "./ButtonBaseStyle";

const ButtonStyled = styled(ButtonNormalStyled)`
	font-family: "AirbnbCerealBold";
	text-transform: uppercase;
	text-align: center;
	letter-spacing: 1px;
	background: ${({ theme, variant, fill }) => {
		if (fill === "ghost" || fill === "clean") {
			return "transparent";
		}
		switch (variant) {
			case "primary":
				return `linear-gradient(135deg,${theme.colors.primary1} 0%,${theme.colors.primary2} 100%)`;
			case "secondary":
				return theme.colors.primary2;
			case "facebook":
				return theme.colors.social.facebook;
			case "google":
				return theme.colors.social.google;
			default:
				return "transparent";
		}
	}};
	color: ${({ theme, fill }) => {
		if (fill === "ghost" || fill === "clean") {
			return theme.colors.fc.dark2;
		}
		return theme.colors.white;
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
				return "0.5rem 1rem";
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
				return "2px";
			case "circle":
				return "50%";
			default:
				return "0";
		}
	}};
	border: ${({ fill, theme }) =>
		fill === "solid" || fill === "clean" ? "none" : `1px solid ${theme.colors.fc.dark2}`};
	display: ${({ full }) => (full ? "block" : "inline-block")};
	width: ${({ full }) => (full ? "100%" : "auto")};
	transition: all ease-in 0.15s;
	&:hover {
		box-shadow: ${({ fill }) => (fill === "clean" ? "none" : "0px 5px 10px 0px rgba(0, 0, 0, 0.2)")};
	}
	&:disabled {
		background: ${({ theme }) => theme.colors.bg.light2};
		color: ${({ theme }) => theme.colors.fc.light2};
		border-color: ${({ theme }) => theme.colors.bg.light2};
		cursor: not-allowed;
		box-shadow: none;
	}
	div.true-center {
		display: flex;
		justify-content: center;
		align-items: center;
		svg {
			margin: 0 0.5rem;
			path: {
				fill: ${({ theme, variant, fill }) => {
					return fill !== "ghost" && fill !== "clean" && (variant === "primary" || variant === "secondary")
						? theme.colors.white
						: theme.colors.fc.dark2;
				}};
			}
		}
	}
`;

function Button(props) {
	const { children, raw, disabled, submitInProgress } = props;
	return (
		<>
			{raw ? (
				<ButtonNormalStyled {...props}>{children}</ButtonNormalStyled>
			) : (
				<ButtonStyled {...props} disabled={submitInProgress || disabled}>
					<div className='true-center'>
						{submitInProgress ? (
							<SVGIcon name='spinner' className='loading-spinner' height={17} width={17} />
						) : (
							children
						)}
					</div>
				</ButtonStyled>
			)}
		</>
	);
}

Button.defaultProps = {
	children: null,
	onClick: undefined,
	shape: "rounded",
	variant: "secondary",
	size: "md",
	type: "button",
	fill: "solid",
	full: false,
	raw: false,
	disabled: false,
	submitInProgress: false,
	action: "",
	value: "",
	label: "",
	event: "",
	data: {},
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
	submitInProgress: PropTypes.bool,
	action: PropTypes.string,
	label: PropTypes.string,
	event: PropTypes.string,
	value: PropTypes.string,
	data: PropTypes.shape({}),
};

export default Button;
