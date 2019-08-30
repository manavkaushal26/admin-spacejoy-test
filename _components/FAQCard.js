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
	padding: 0.5rem 0;
	overflow: hidden;
	&.open ${QuestionStyled} {
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

	state = {
		expand: false
	};

	handleClick = () =>
		this.setState(prevState => {
			return { expand: !prevState.expand };
		});

	render() {
		const { children } = this.props;
		const { expand } = this.state;
		return (
			<FAQWrapper className={expand ? "open" : "close"}>
				<QuestionStyled role="button" tabIndex="0" onClick={this.handleClick} onKeyPress={this.handleClick}>
					{children[0]}
				</QuestionStyled>
				<AnswerStyled>{children[1]}</AnswerStyled>
			</FAQWrapper>
		);
	}
}

FAQCard.propTypes = {
	children: PropTypes.node.isRequired
};

export default FAQCard;
