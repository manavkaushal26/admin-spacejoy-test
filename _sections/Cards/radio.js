import Button from "@components/Button";
import SVGIcon from "@components/SVGIcon";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const RadioCardStyled = styled(Button)`
	height: 185px;
	border-radius: 2px;
	background: ${({ theme, image }) => `${theme.colors.bg.light2} url(${image}) no-repeat`};
	background-size: cover;
	background-position: bottom;
	border: 1px solid ${({ theme, isActive }) => (isActive ? theme.colors.primary1 : "transparent")};
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
			transform: scale(1);
			opacity: 1;
			path {
				fill: ${({ theme }) => theme.colors.primary1};
			}
		}
	}
	span {
		position: absolute;
		top: 2rem;
		left: 2rem;
		svg {
			pointer-events: none;
			transition: all cubic-bezier(0.68, -0.55, 0.27, 1.55) 400ms;
			transform: scale(0);
			opacity: 0;
		}
	}
`;

function RadioCard({ image, value, onClick, checked }) {
	return (
		<RadioCardStyled
			type="button"
			value={value}
			raw
			onClick={onClick}
			className={checked ? "active" : "inactive"}
			image={image}
		>
			<span>
				<SVGIcon name="tick" height={13} width={20} /> {value}
			</span>
		</RadioCardStyled>
	);
}

RadioCard.defaultProps = {
	image: ""
};

RadioCard.propTypes = {
	image: PropTypes.string,
	value: PropTypes.string.isRequired,
	onClick: PropTypes.func.isRequired,
	checked: PropTypes.bool.isRequired
};

export default RadioCard;
