import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const QuizHeaderStyled = styled.div`
	margin: 4rem 0;
	h2 {
		margin: 0;
		& + span {
			color: ${({ theme }) => theme.colors.fc.dark2};
		}
	}
`;

function QuizHeader({ title, description }) {
	return (
		<QuizHeaderStyled>
			<h2>{title}</h2>
			<span>{description}</span>
		</QuizHeaderStyled>
	);
}

QuizHeader.defaultProps = {
	description: ""
};

QuizHeader.propTypes = {
	title: PropTypes.string.isRequired,
	description: PropTypes.string
};

export default QuizHeader;
