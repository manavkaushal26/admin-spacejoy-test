import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const TitleStyled = styled.h2`
	margin-bottom: 2rem;
	font-size: 2rem;
	& + p {
		margin: auto;
		width: 50%;
		color: ${({ theme }) => theme.colors.fc.dark2};
	}
`;

function SectionHeader({ title, description }) {
	return (
		<div className="grid text-center">
			<div className="col-12">
				<TitleStyled>{title}</TitleStyled>
				<p>{description}</p>
			</div>
		</div>
	);
}

SectionHeader.defaultProps = {
	title: "",
	description: ""
};

SectionHeader.propTypes = {
	title: PropTypes.string,
	description: PropTypes.string
};

export default SectionHeader;
