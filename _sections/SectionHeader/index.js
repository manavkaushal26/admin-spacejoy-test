import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const SectionHeaderStyled = styled.div`
	margin: 3rem 0;
	text-align: left;
	h2 {
		margin: 0;
	}
	@media (max-width: 576px) {
		margin: 1rem 0;
	}
`;

function SectionHeader({ title, description }) {
	return (
		<SectionHeaderStyled>
			<h2>{title}</h2>
			<span>{description}</span>
		</SectionHeaderStyled>
	);
}

SectionHeader.defaultProps = {
	description: ""
};

SectionHeader.propTypes = {
	title: PropTypes.string.isRequired,
	description: PropTypes.string
};

export default SectionHeader;
