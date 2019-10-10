import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const TitleStyled = styled.h2`
	color: ${({ theme, light }) => (light ? theme.colors.white : theme.colors.fc.dark1)};
	margin-bottom: 2rem;
	font-size: 2rem;
	& + p {
		margin: 0 auto 2rem auto;
		width: 50%;
		color: ${({ theme, light }) => (light ? theme.colors.white : theme.colors.fc.dark2)};
	}
`;

function SectionHeader({ title, description, light }) {
	return (
		<div className="grid text-center">
			<div className="col-12">
				<TitleStyled light={light}>{title}</TitleStyled>
				{description && <p>{description}</p>}
			</div>
		</div>
	);
}

SectionHeader.defaultProps = {
	title: "",
	description: "",
	light: false
};

SectionHeader.propTypes = {
	title: PropTypes.string,
	description: PropTypes.string,
	light: PropTypes.bool
};

export default SectionHeader;
