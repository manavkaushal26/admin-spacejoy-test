import Button from "@components/Button";
import Image from "@components/Image";
import SVGIcon from "@components/SVGIcon";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const RadioCardBase = styled(Button)`
	border-radius: 2px;
	width: 100%;
	padding: 0;
	transition: all linear 100ms;
	color: ${({ theme }) => theme.colors.fc.dark1};
	&:hover {
		box-shadow: 0 0 10px 0px ${({ theme }) => theme.colors.mild.black};
		border: 1px solid ${({ theme }) => theme.colors.mild.black};
	}
	&.active {
		font-weight: bold;
		box-shadow: 0 0 10px 0px ${({ theme }) => theme.colors.mild.black};
		border: 1px solid ${({ theme }) => theme.colors.mild.black};
		color: ${({ theme }) => theme.colors.accent};
		span.radio-dummy svg {
			background-color: ${({ theme }) => theme.colors.accent};
			path {
				fill: white;
			}
		}
	}
	span.radio-dummy {
		pointer-events: none;
		position: absolute;
		top: 1.25rem;
		left: 1.25rem;
		svg {
			border: 1px solid ${({ theme }) => theme.colors.accent};
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

const RadioCardStyledV1 = styled(RadioCardBase)`
	height: 185px;
	background: ${({ isActive, bg, theme, image }) =>
		` ${isActive ? bg : theme.colors.bg.light2} url(${image}) no-repeat`};
	background-size: contain;
	background-position: 100% 100%;
	border: 1px solid transparent;
	color: ${({ theme }) => theme.colors.fc.dark2};
	@media (max-width: 576px) {
		height: 100px;
	}
`;

const RadioCardStyledV2 = styled(RadioCardBase)`
	height: 120px;
	border: 1px solid ${({ theme }) => theme.colors.bg.dark2};
	color: ${({ theme }) => theme.colors.fc.dark2};
	background: ${({ theme }) => theme.colors.white};
	.continent {
		padding: 0 1rem;
		text-transform: none;
		height: 80%;
		display: flex;
		justify-content: space-between;
		flex-direction: column;
		white-space: normal;
		span {
			font-size: 0.95rem;
		}
		img {
			margin: auto;
		}
	}
`;

function RadioCard({ version, image, value, onClick, checked, bg }) {
	return (
		<>
			{version === 1 && (
				<RadioCardStyledV1
					raw
					type="button"
					value={value}
					onClick={onClick}
					isActive={checked}
					className={checked ? "active" : "inactive"}
					image={image}
					bg={bg}
				>
					<span className="radio-dummy">
						<SVGIcon name="tick" /> {value}
					</span>
				</RadioCardStyledV1>
			)}
			{version === 2 && (
				<RadioCardStyledV2
					raw
					type="button"
					value={value}
					onClick={onClick}
					isActive={checked}
					className={checked ? "active" : "inactive"}
					image={image}
					bg={bg}
				>
					<span className="radio-dummy">
						<SVGIcon name="tick" />
					</span>
					<div className="continent">
						<Image src={image} height="50px" width="auto" />
						<span>{value}</span>
					</div>
				</RadioCardStyledV2>
			)}
		</>
	);
}

RadioCard.defaultProps = {
	image: "",
	bg: "",
	version: 1
};

RadioCard.propTypes = {
	version: PropTypes.number,
	image: PropTypes.string,
	value: PropTypes.string.isRequired,
	onClick: PropTypes.func.isRequired,
	checked: PropTypes.bool.isRequired,
	bg: PropTypes.string
};

export default RadioCard;
