import PropTypes from "prop-types";
import React, { PureComponent } from "react";
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
	border-radius: 2px;
	padding: 1rem;
	&.open {
		border-bottom: none;
		box-shadow: 0 0 10px 0px rgba(0, 0, 0, 0.1);
	}
	&.open ${QuestionStyled} {
		color: ${({ theme }) => theme.colors.primary};
		font-weight: bold;
		margin-bottom: 1rem;
	}
	&.open ${AnswerStyled} {
		display: block;
	}
`;

class FAQCard extends PureComponent {
	static Question = ({ children }) => children;

	static Answer = ({ children }) => children;

	handleClick = () => {
		const { handleOpenId, quesId } = this.props;
		handleOpenId(quesId);
	};

	render() {
		const { children, open } = this.props;
		return (
			<FAQWrapper className={open ? "open" : "close"}>
				<QuestionStyled role="button" tabIndex="0" onClick={this.handleClick} onKeyPress={this.handleClick}>
					{children[0]}
				</QuestionStyled>
				<AnswerStyled>{children[1]}</AnswerStyled>
			</FAQWrapper>
		);
	}
}

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
