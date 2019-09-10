import Button from "@components/Button";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const FieldWrapperStyled = styled.div`
	color: ${({ hasError, theme }) => (hasError ? theme.colors.primary : theme.colors.fc.dark1)};
	label {
		display: block;
		margin-bottom: 1rem;
		span {
			display: block;
		}
	}
`;
const ErrorTextStyled = styled.small`
	color: ${({ theme }) => theme.colors.primary};
	margin: 0.5rem 0rem;
	display: inline-block;
`;

const InputStyled = styled.input`
	outline: none;
	background: transparent;
	padding: 1.25rem;
	width: 100%;
	box-sizing: border-box;
	color: ${({ hasError, theme }) => (hasError ? theme.colors.primary : theme.colors.fc.dark1)};
	border: 1px solid ${({ hasError, theme }) => (hasError ? theme.colors.primary : theme.colors.bg.dark1)};
`;

function Field({ data, onchange, name, type, label, placeholder, inline, required }) {
	return (
		<FieldWrapperStyled hasError={data.error}>
			{(type === "email" || type === "text") && (
				<label htmlFor={name}>
					<div className="grid">
						<div className={`col-xs-${inline ? 6 : 12} col-bleed-y`}>
							<span>{label}</span>
						</div>
						<div className={`col-xs-${inline ? 6 : 12}`}>
							<InputStyled
								type={type}
								id={name}
								name={name}
								value={data.value}
								placeholder={placeholder}
								required={required}
								onChange={onchange}
								hasError={data.error}
							/>
							{data.error && <ErrorTextStyled>{data.error}</ErrorTextStyled>}
						</div>
					</div>
				</label>
			)}
			{type === "submit" && (
				<div className="grid">
					<div className="col-xs-12 col-bleed-y">
						<Button size="lg">{label}</Button>
					</div>
				</div>
			)}
		</FieldWrapperStyled>
	);
}

Field.defaultProps = {
	data: {},
	onchange: () => {},
	placeholder: "",
	inline: false,
	required: false
};

Field.propTypes = {
	data: PropTypes.shape({
		value: PropTypes.string,
		error: PropTypes.string
	}),
	onchange: PropTypes.func,
	name: PropTypes.string.isRequired,
	type: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	placeholder: PropTypes.string,
	inline: PropTypes.bool,
	required: PropTypes.bool
};

export default Field;
