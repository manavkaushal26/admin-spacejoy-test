import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const BaseCardStyled = styled.div`
	position: relative;
	height: ${({ full }) => (full ? "100%" : "auto")};
	background: ${({ theme, bg }) => (bg === "" ? theme.colors.white : theme.colors.mild[bg])};
	padding: ${({ noPad }) => (noPad ? "0" : "2rem")};
	margin: ${({ noMargin }) => (noMargin ? "0" : "0.5rem")};
	border-radius: ${({ rounded }) => `${rounded}px`};
	box-shadow: ${({ noShadow }) => (noShadow ? "none" : "0px 1px 3px rgba(0, 0, 0, 0.06)")};
	&.left-space {
		border-left: 1rem solid white;
	}
	&.right-space {
		border-right: 1rem solid white;
	}
	&.with-fold {
		&:after {
			content: "";
			position: absolute;
			top: 0;
			right: 0;
			background: ${({ theme, bg }) => (bg === "" ? theme.colors.white : theme.colors[bg])};
			border-left: 20px solid ${({ theme, bg }) => theme.colors[bg]};
			border-right: 20px solid ${({ theme }) => theme.colors.white};
			border-top: 20px solid ${({ theme }) => theme.colors.white};
			border-bottom: 20px solid ${({ theme, bg }) => theme.colors[bg]};
		}
		&:before {
			content: "";
			position: absolute;
			top: 38px;
			right: 0px;
			background: ${({ theme }) => theme.colors.bg.dark1};
			height: 4px;
			width: 40px;
			transform: rotate(6deg);
		}
	}
	& > {
		h1,
		h2,
		h3,
		h4,
		h5,
		h6 {
			text-transform: capitalize;
			margin-top: 0;
		}
	}
	@media (max-width: 576px) {
		&.left-space {
			border-left: 0rem solid white;
		}
		&.right-space {
			border-right: 0rem solid white;
		}
	}
	& + {
		div.card.chain {
			margin-top: 2.25rem;
		}
	}
`;

function Card({ children, bg, full, noPad, noMargin, noShadow, className, rounded, withFold, style }) {
	return (
		<BaseCardStyled
			bg={bg}
			full={full}
			noPad={noPad}
			noMargin={noMargin}
			noShadow={noShadow}
			className={`card ${withFold ? "with-fold" : ""} ${className}`}
			style={style}
			rounded={rounded}
		>
			{children}
		</BaseCardStyled>
	);
}

Card.defaultProps = {
	children: null,
	bg: "",
	full: false,
	noPad: false,
	noMargin: false,
	noShadow: false,
	withFold: false,
	className: "",
	style: {},
	rounded: 2,
};

Card.propTypes = {
	children: PropTypes.node,
	bg: PropTypes.string,
	full: PropTypes.bool,
	noPad: PropTypes.bool,
	noMargin: PropTypes.bool,
	noShadow: PropTypes.bool,
	withFold: PropTypes.bool,
	className: PropTypes.string,
	rounded: PropTypes.number,
	style: PropTypes.shape({}),
};

export default Card;
