import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const SectionHeaderStyled = styled.div`
	margin: ${({ size }) => `${size}rem`} 0;
	@media (max-width: 576px) {
		margin: 1rem 0;
	}
`;
const SectionTitleStyled = styled.div`
	h1,
	h2,
	h3,
	h4,
	h5,
	h6 {
		margin: ${({ size }) => `0 0 ${size / 4}rem 0`};
	}
`;
const SectionDescriptionStyled = styled.div`
	p {
		margin: 0;
		font-size: 1.2rem;
	}
`;

function SectionHeader({ children, size, light, align }) {
	return (
		<SectionHeaderStyled size={size} light={light} className={`text-${align}`}>
			{React.Children.map(children, item => React.cloneElement(item, { size }))}
		</SectionHeaderStyled>
	);
}

SectionHeader.defaultProps = {
	children: null,
	size: 3,
	light: false,
	align: "left",
};

SectionHeader.propTypes = {
	children: PropTypes.node,
	size: PropTypes.number,
	light: PropTypes.bool,
	align: PropTypes.string,
};

SectionHeader.Title = function Title({ children, size }) {
	return <SectionTitleStyled size={size}>{children}</SectionTitleStyled>;
};

SectionHeader.Title.defaultProps = {
	children: null,
	size: 0,
};

SectionHeader.Title.propTypes = {
	children: PropTypes.node,
	size: PropTypes.number,
};

SectionHeader.Description = function Description({ children, mini }) {
	return <SectionDescriptionStyled mini={mini}>{children}</SectionDescriptionStyled>;
};

SectionHeader.Description.defaultProps = {
	children: null,
	mini: false,
};

SectionHeader.Description.propTypes = {
	children: PropTypes.node,
	mini: PropTypes.bool,
};

export default SectionHeader;
