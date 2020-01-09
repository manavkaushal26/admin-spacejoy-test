import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const SectionHeaderStyled = styled.div`
	margin: ${({ size }) => `${size > 3 ? 3 : size}rem`} 0;
	text-align: ${({ align }) => align};
	color: ${({ theme, light }) => (light ? theme.colors.white : theme.colors.fc.dark1)};
	h1,
	h2,
	h3,
	h4,
	h5,
	h6 {
		margin: 0.35rem 0;
		line-height: ${({ mini }) => (mini ? "1.1rem" : "auto")};
		& + {
			span,
			small {
				color: ${({ theme, light }) => (light ? theme.colors.fc.light2 : theme.colors.fc.dark2)};
			}
		}
	}
	@media (max-width: 576px) {
		margin: 1rem 0;
	}
`;

function SectionHeader({ title, description, size, hgroup, align, mini, light }) {
	return (
		<SectionHeaderStyled size={size} mini={mini} light={light} align={align}>
			{hgroup === 1 && <h1>{title}</h1>}
			{hgroup === 2 && <h2>{title}</h2>}
			{hgroup === 3 && <h3>{title}</h3>}
			{hgroup === 4 && <h4>{title}</h4>}
			{hgroup === 5 && <h5>{title}</h5>}
			{hgroup === 6 && <h6>{title}</h6>}
			{description && (mini ? <small>{description}</small> : <span>{description}</span>)}
		</SectionHeaderStyled>
	);
}

SectionHeader.defaultProps = {
	description: "",
	size: 3,
	hgroup: 2,
	mini: false,
	light: false,
	align: "left",
};

SectionHeader.propTypes = {
	title: PropTypes.string.isRequired,
	description: PropTypes.string,
	size: PropTypes.number,
	hgroup: PropTypes.number,
	mini: PropTypes.bool,
	light: PropTypes.bool,
	align: PropTypes.string,
};

export default SectionHeader;
