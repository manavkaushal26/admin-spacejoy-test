import React from "react";
import styled from "styled-components";

const InputField = styled.input`
	width: 100%;
	padding: 1rem;
	margin: 5px 0 22px 0;
	display: inline-block;
	border: none;
	background: white;
	border: 1px solid ${({ theme }) => theme.colors.bg.dark1};
	&:focus {
		background-color: #ddd;
		outline: none;
	}
`;

function DesignMySpaceForm() {
	return (
		<form action="">
			<div className="input-wrapper">
				<label htmlFor="roomtype">
					<span>Which room are you designing?</span>
					<select name="roomtype" id="roomtype">
						<option value="">Hi</option>
						<option value="">h1</option>
						<option value="">h1</option>
						<option value="">h1</option>
						<option value="">h1</option>
					</select>
				</label>
				<label htmlFor="wow">
					<span>wow</span>
					<input type="email" name="wow" id="wow" />
					<InputField name="wow" id="wow" />
				</label>
			</div>
		</form>
	);
}

export default DesignMySpaceForm;
