import Card from "@components/Card";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const QuestionStyled = styled.div`
	color: ${({ theme }) => theme.colors.fc.dark1};
	margin-bottom: 1rem;
`;

const AnswerStyled = styled.div`
	color: ${({ theme }) => theme.colors.fc.dark3};
`;

function Summary({ data }) {
	return (
		<div className="grid text-left">
			<div className="col-xs-12">
				<h3>Summary Of Your Design Preferences</h3>
				<div className="grid">
					{data.formData.map(item => (
						<div className="col-xs-6" key={item.entry}>
							<Card bg="white">
								<QuestionStyled>{item.question}</QuestionStyled>
								<AnswerStyled>{item.answer || "Skipped"}</AnswerStyled>
							</Card>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

Summary.defaultProps = {
	data: {}
};

Summary.propTypes = {
	data: PropTypes.shape({
		status: PropTypes.string.isRequired,
		formData: PropTypes.arrayOf(
			PropTypes.shape({
				key: PropTypes.string,
				value: PropTypes.string
			})
		),
		package: PropTypes.string,
		packageAmount: PropTypes.number
	})
};

export default Summary;
