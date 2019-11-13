import Button from "@components/Button";
import Checkbox from "@components/Checkbox";
import Radio from "@components/Radio";
import PropTypes from "prop-types";
import React from "react";
import PlacesAutocomplete from "reactjs-places-autocomplete";
import styled from "styled-components";

const AutoCompleteStyled = styled.div`
	background: white;
	position: relative;
	top: -2rem;
	&.loading {
		background: ${({ theme }) => theme.colors.bg.dark2};
	}
`;

const SuggestionStyled = styled.div`
	cursor: pointer;
	padding: 0.5rem 1rem;
	border-top: 1px solid ${({ theme }) => theme.colors.bg.dark2};
	border-left: 1px solid ${({ theme }) => theme.colors.bg.dark2};
	border-right: 1px solid ${({ theme }) => theme.colors.bg.dark2};
	&:last-child {
		border-bottom: 1px solid ${({ theme }) => theme.colors.bg.dark2};
	}
`;

const FieldWrapperStyled = styled.div`
	color: ${({ hasError, theme }) => (hasError ? theme.colors.red : theme.colors.fc.dark1)};
`;

const LabelStyled = styled.label`
	margin-bottom: ${({ selectionType }) => (selectionType ? "" : "1.5rem")};
	display: block;
	span.styled {
		display: inline-block;
		margin: 0.25rem ${({ selectionType }) => (selectionType ? "0.75rem" : "0")};
	}
`;

const RadioWrapperStyled = styled.div`
	margin-bottom: ${({ selectionType }) => (selectionType ? "" : "2rem")};
`;

const CheckboxWrapperStyled = styled.div`
	margin-bottom: ${({ selectionType }) => (selectionType ? "" : "2rem")};
`;

const ErrorTextStyled = styled.small`
	color: ${({ theme }) => theme.colors.red};
	margin: 0.5rem 0rem;
	display: inline-block;
`;

const HintTextStyled = styled.small`
	color: ${({ theme }) => theme.colors.fc.dark3};
	margin: 0.5rem 0rem;
	display: inline-block;
`;

const InputStyled = styled.input`
	-webkit-appearance: none;
	outline: none;
	border-radius: 2px;
	background: ${({ hasError }) => (hasError ? "rgba(240, 90, 70, 0.1)" : "white")};
	padding: 0.75rem;
	width: 100%;
	box-sizing: border-box;
	font-size: 1rem;
	border: 1px solid ${({ hasError, theme }) => (hasError ? theme.colors.red : theme.colors.bg.dark1)};
`;

function Field({
	data,
	readonly,
	onchange,
	handleAddressChange,
	name,
	type,
	label,
	options,
	placeholder,
	error,
	hint,
	inline,
	required,
	submitInProgress
}) {
	return (
		<FieldWrapperStyled hasError={data.error}>
			{(type === "email" || type === "text" || type === "password" || type === "tel") && (
				<LabelStyled htmlFor={name}>
					<div className="grid">
						<div className={`col-xs-${inline ? 6 : 12} col-bleed-y`}>
							<span className="styled">
								{label}
								<sup>{required ? "*" : ""}</sup>
							</span>
						</div>
						<div className={`col-xs-${inline ? 6 : 12} col-bleed-y`}>
							<InputStyled
								readonly={readonly}
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
							{hint && data.value === "" && !data.error && <HintTextStyled>{hint}</HintTextStyled>}
						</div>
					</div>
				</LabelStyled>
			)}
			{type === "addressAutoSuggest" && (
				<PlacesAutocomplete
					readonly={readonly}
					value={data.value || ""}
					name={name}
					id={name}
					onChange={handleAddressChange}
					onSelect={handleAddressChange}
				>
					{({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
						<>
							<LabelStyled htmlFor="address">
								<span className="styled">{label}</span>
								<InputStyled
									autoComplete="false"
									{...getInputProps({
										name: "address",
										id: "address",
										placeholder: "Search Places ...",
										className: "input-field"
									})}
								/>
							</LabelStyled>
							<AutoCompleteStyled className={loading ? "loading" : ""}>
								{suggestions.map(suggestion => (
									<SuggestionStyled
										key={suggestion.description.length}
										{...getSuggestionItemProps(suggestion)}
										active={suggestion.active}
									>
										{suggestion.description}
									</SuggestionStyled>
								))}
							</AutoCompleteStyled>
						</>
					)}
				</PlacesAutocomplete>
			)}
			{type === "radio" && (
				<RadioWrapperStyled>
					<div className="grid">
						<div className={`col-xs-${inline ? 6 : 12} col-bleed-y`}>
							<span>
								{label}
								<sup>{required ? "*" : ""}</sup>
							</span>
						</div>
						<div className={`col-xs-${inline ? 6 : 12} col-bleed-y`}>
							{options.map(radio => (
								<Radio
									readonly={readonly}
									id={radio.value}
									name={name}
									label={radio.label}
									value={radio.value}
									key={radio.value}
									checked={data.value === radio.value}
									required={required}
									onChange={onchange}
									selectionType
								/>
							))}
							{data.error && <ErrorTextStyled>{data.error}</ErrorTextStyled>}
						</div>
					</div>
				</RadioWrapperStyled>
			)}
			{type === "checkbox" && (
				<CheckboxWrapperStyled>
					<div className="grid">
						<div className={`col-xs-${inline ? 6 : 12} col-bleed-y`}>
							<Checkbox
								readonly={readonly}
								id={name}
								name={name}
								label={label}
								checked={data.value}
								required={required}
								onChange={onchange}
								hasError={data.error}
								data-error={error}
							/>
							{data.error && <ErrorTextStyled>{data.error}</ErrorTextStyled>}
						</div>
					</div>
				</CheckboxWrapperStyled>
			)}
			{type === "submit" && (
				<div className="grid">
					<div className="col-xs-12">
						<Button type="submit" shape="rounded" size="md" full variant="primary" submitInProgress={submitInProgress}>
							{label}
						</Button>
					</div>
				</div>
			)}
		</FieldWrapperStyled>
	);
}

Field.defaultProps = {
	data: {
		value: "",
		error: ""
	},
	options: [],
	onchange: () => {},
	handleAddressChange: () => {},
	placeholder: "",
	error: "",
	hint: "",
	inline: false,
	required: false,
	readonly: false,
	submitInProgress: false
};

Field.propTypes = {
	data: PropTypes.shape({
		value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
		error: PropTypes.string
	}),
	onchange: PropTypes.func,
	handleAddressChange: PropTypes.func,
	name: PropTypes.string.isRequired,
	type: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	options: PropTypes.arrayOf(PropTypes.shape({})),
	placeholder: PropTypes.string,
	error: PropTypes.string,
	hint: PropTypes.string,
	inline: PropTypes.bool,
	required: PropTypes.bool,
	readonly: PropTypes.bool,
	submitInProgress: PropTypes.bool
};

export default Field;
