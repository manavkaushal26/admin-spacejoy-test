import parse from "html-react-parser";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const AnswerStyled = styled.div`
	display: none;
`;

const QuestionStyled = styled.div`
	outline: none;
	cursor: pointer;
`;

const FAQWrapper = styled.div`
	border-bottom: 1px solid ${({ theme }) => theme.colors.bg.light2};
	padding: 1rem 0;
	overflow: hidden;
	&.open {
		padding: 2rem;
		border-bottom: none;
		border-radius: 5px;
		overflow: hidden;
		box-shadow: 0 0 10px 0px ${({ theme }) => theme.colors.mild.black};
	}
	&.open ${QuestionStyled} {
		color: ${({ theme }) => theme.colors.primary1};
		font-weight: bold;
		margin-bottom: 1rem;
	}
	&.open ${AnswerStyled} {
		display: block;
	}
`;

function FAQCard({ children, open, handleOpenId, quesId }) {
	const handleClick = () => {
		handleOpenId(quesId);
	};
	return (
		<FAQWrapper className={open ? "open" : "close"}>
			<QuestionStyled role="button" tabIndex="0" onClick={handleClick} onKeyPress={handleClick}>
				<strong>Q. </strong>
				{children[0]}
			</QuestionStyled>
			<AnswerStyled>{parse(`${children[1].props.children}`)}</AnswerStyled>
		</FAQWrapper>
	);
}

FAQCard.Question = ({ children }) => children;

FAQCard.Answer = ({ children }) => children;

FAQCard.defaultProps = {
	open: false
};

FAQCard.propTypes = {
	open: PropTypes.bool,
	quesId: PropTypes.number.isRequired,
	handleOpenId: PropTypes.func.isRequired,
	children: PropTypes.node.isRequired
};

export default FAQCard;
