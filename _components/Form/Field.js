import Button from "@components/Button";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const FieldWrapperStyled = styled.div`
	color: ${({ hasError, theme }) => (hasError ? theme.colors.primary : theme.colors.fc.dark1)};
`;

const LabelStyled = styled.label`
	display: block;
	margin-bottom: ${({ selectionType }) => (selectionType ? "" : "2rem")};
	span {
		display: inline-block;
		margin: 0.5rem ${({ selectionType }) => (selectionType ? "1rem" : "0")};
	}
`;

const DummyLabelStyled = styled.div`
	margin-bottom: ${({ selectionType }) => (selectionType ? "" : "2rem")};
`;

const ErrorTextStyled = styled.small`
	color: ${({ theme }) => theme.colors.primary};
	margin: 0.5rem 0rem;
	display: inline-block;
`;

const HintTextStyled = styled.small`
	color: ${({ theme }) => theme.colors.fc.dark3};
	margin: 0.5rem 0rem;
	display: inline-block;
`;

const InputStyled = styled.input`
	outline: none;
	border-radius: 5px;
	background: ${({ hasError }) => (hasError ? "rgba(240, 90, 70, 0.1)" : "white")};
	padding: 1.25rem;
	width: 100%;
	box-sizing: border-box;
	border: 1px solid ${({ hasError, theme }) => (hasError ? theme.colors.primary : theme.colors.bg.dark1)};
`;

const RadioStyled = styled.input`
	margin-right: 1rem;
`;

function Field({ data, onchange, name, type, label, options, placeholder, error, hint, inline, required }) {
	return (
		<FieldWrapperStyled hasError={data.error}>
			{(type === "email" || type === "text" || type === "password" || type === "tel") && (
				<LabelStyled htmlFor={name}>
					<div className="grid">
						<div className={`col-xs-${inline ? 6 : 12} col-bleed-y`}>
							<span>
								{label}
								<sup>{required ? "*" : ""}</sup>
							</span>
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
								hasError={data.error}
								data-error={error}
								data-hint={hint}
							/>
							{data.error && <ErrorTextStyled>{data.error}</ErrorTextStyled>}
							{data.error && <HintTextStyled>{hint}</HintTextStyled>}
						</div>
					</div>
				</LabelStyled>
			)}
			{type === "radio" && (
				<DummyLabelStyled>
					<div className="grid">
						<div className={`col-xs-${inline ? 6 : 12} col-bleed-y`}>
							<span>
								{label}
								<sup>{required ? "*" : ""}</sup>
							</span>
						</div>
						<div className={`col-xs-${inline ? 6 : 12} col-bleed-y`}>
							{options.map(radio => (
								<LabelStyled htmlFor={radio.value} selectionType key={radio.value}>
									<RadioStyled
										type="radio"
										id={radio.value}
										name={name}
										value={radio.value}
										checked={data.value === radio.value}
										required={required}
										onChange={onchange}
									/>
									<span>{radio.value}</span>
								</LabelStyled>
							))}
							{data.error && <ErrorTextStyled>{data.error}</ErrorTextStyled>}
							{data.error && <HintTextStyled>{hint}</HintTextStyled>}
						</div>
					</div>
				</DummyLabelStyled>
			)}
			{type === "submit" && (
				<div className="grid">
					<div className="col-xs-12">
						<Button size="lg" full type="primary">
							{label}
						</Button>
					</div>
				</div>
			)}
		</FieldWrapperStyled>
	);
}

Field.defaultProps = {
	data: {},
	options: [],
	onchange: () => {},
	placeholder: "",
	error: "",
	hint: "",
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
	options: PropTypes.arrayOf(PropTypes.shape({})),
	placeholder: PropTypes.string,
	error: PropTypes.string,
	hint: PropTypes.string,
	inline: PropTypes.bool,
	required: PropTypes.bool
};

export default Field;
