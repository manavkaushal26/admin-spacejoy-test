import Button from "@components/Button";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const FieldWrapperStyled = styled.div`
	label {
		display: block;
	}
`;
const ErrorTextStyled = styled.small`
	color: ${({ theme }) => theme.colors.primary};
	margin: 0.5rem 0rem 1.5rem 0;
	display: inline-block;
`;

const InputStyled = styled.input`
	background: transparent;
	padding: 1.25rem;
	width: 100%;
	border: 1px solid ${({ theme }) => theme.colors.bg.dark1};
`;

function Field({ data, onchange, name, type, label, placeholder, inline, required }) {
	return (
		<FieldWrapperStyled>
			{(type === "email" || type === "text") && (
				<label htmlFor={name}>
					<div className="grid">
						<div className={`col-xs-${inline ? 6 : 12}`}>
							<span>{label}</span>
						</div>
						<div className={`col-xs-${inline ? 6 : 12} col-bleed-y`}>
							<InputStyled
								type={type}
								id={name}
								name={name}
								value={data.value}
								placeholder={placeholder}
								required={required}
								onChange={onchange}
							/>
							<ErrorTextStyled>{data.error}</ErrorTextStyled>
						</div>
					</div>
				</label>
			)}
			{type === "submit" && (
				<div className="grid">
					<div className="col-xs-12">
						<Button>{label}</Button>
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
