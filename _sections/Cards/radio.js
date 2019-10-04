import Button from "@components/Button";
import SVGIcon from "@components/SVGIcon";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const RadioCardStyled = styled(Button)`
	height: 185px;
	border-radius: 2px;
	background: ${({ isActive, bg, theme, image }) =>
		` ${isActive ? bg : theme.colors.bg.light2} url(${image}) no-repeat`};
	background-size: cover;
	background-position: bottom;
	border: 1px solid transparent;
	width: 100%;
	padding: 0;
	color: ${({ theme }) => theme.colors.fc.dark2};
	transition: all linear 100ms;
	&:hover {
		box-shadow: 0 0 10px 0px rgba(0, 0, 0, 0.1);
		border: 1px solid ${({ theme }) => theme.colors.fc.dark3};
		color: ${({ theme }) => theme.colors.fc.dark1};
	}
	&.active {
		font-weight: bold;
		border: 1px solid ${({ theme }) => theme.colors.primary1};
		color: ${({ theme }) => theme.colors.primary1};
		svg {
			background-color: ${({ theme }) => theme.colors.primary1};
			path {
				fill: white;
			}
		}
	}
	span {
		pointer-events: none;
		position: absolute;
		top: 1.25rem;
		left: 1.25rem;
		svg {
			border: 1px solid ${({ theme }) => theme.colors.primary1};
			height: 20px;
			width: 20px;
			border-radius: 10px;
			padding: 2px;
			margin-right: 0.5rem;
			path {
				fill: transparent;
			}
		}
	}
`;

function RadioCard({ image, value, onClick, checked, bg }) {
	return (
		<RadioCardStyled
			type="button"
			value={value}
			raw
			onClick={onClick}
			isActive={checked}
			className={checked ? "active" : "inactive"}
			image={image}
			bg={bg}
		>
			<span>
				<SVGIcon name="tick" /> {value}
			</span>
		</RadioCardStyled>
	);
}

RadioCard.defaultProps = {
	image: "",
	bg: ""
};

RadioCard.propTypes = {
	image: PropTypes.string,
	value: PropTypes.string.isRequired,
	onClick: PropTypes.func.isRequired,
	checked: PropTypes.bool.isRequired,
	bg: PropTypes.string
};

export default RadioCard;
