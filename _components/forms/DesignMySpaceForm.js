import React from "react";
import styled from "styled-components";

const InputWrapperStyled = styled.div`
	position: relative;
	margin-bottom: 1rem;
	& {
		label,
		span,
		input:not([type="checkbox"]),
		input:not([type="radio"]) {
			display: block;
			margin: 0.25rem 0;
			width: 100%;
		}
		input:not([type="checkbox"]),
		input:not([type="radio"]) {
			background: white;
			border: 1px solid ${({ theme }) => theme.colors.bg.dark1};
			padding: 0.75rem 1rem;
			outline: none;
		}
	}
`;

function DesignMySpaceForm() {
	return (
		<form action="">
			<legend>
				<InputWrapperStyled>
					<label htmlFor="name">
						<span className="label-text">Name</span>
						<input type="text" name="name" className="input-field" id="name" />
						<span className="error">Enter a valid Name</span>
						<span className="hint">It will be use as unique ID.</span>
					</label>
				</InputWrapperStyled>
			</legend>
		</form>
	);
}

export default DesignMySpaceForm;
