import React from "react";
import styled from "styled-components";

const InputWrapperStyled = styled.div`
	position: relative;
	margin-bottom: 1rem;
	label,
	input[type="text"] {
		display: block;
		margin: 0.25rem 0;
		width: 100%;
		box-sizing: border-box;
		color: ${({ error, theme }) => (error ? theme.colors.primary : "inherit")};
	}
	input[type="text"] {
		background: ${({ error }) => (error ? "rgba(240, 90, 70, 0.1)" : "white")};
		color: ${({ error, theme }) => (error ? theme.colors.primary : "inherit")};
		border: 1px solid ${({ error, theme }) => (error ? theme.colors.primary : theme.colors.bg.dark1)};
		padding: 0.75rem 1rem;
		outline: none;
	}
	input[type="radio"] {
		margin-right: 1rem;
	}
	label > span:first-child {
		font-weight: bold;
	}
`;

function Input() {
	return (
		<InputWrapperStyled>
			<label htmlFor="name">
				<span className="label-text">Plan Type</span>
				<input
					type="text"
					name="plan"
					className="input-field"
					id="plan"
					value={plan}
					onChange={this.handleInputChange}
				/>
			</label>
		</InputWrapperStyled>
	);
}

export default Input;
