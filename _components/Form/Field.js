import Button from "@components/Button";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const FieldWrapperStyled = styled.div``;

function Field({ data, onchange, name, type, label, placeholder, inline, required }) {
	return (
		<FieldWrapperStyled>
			{(type === "email" || type === "text") && (
				<div className="grid">
					<label htmlFor={name}>
						<div className={`col-xs-${inline ? 6 : 12}`}>
							<span>{label}</span>
						</div>
						<div className={`col-xs-${inline ? 6 : 12}`}>
							<input
								type={type}
								id={name}
								name={name}
								value={data.value}
								placeholder={placeholder}
								required={required}
								onChange={onchange}
							/>
							<p>{data.error}</p>
						</div>
					</label>
				</div>
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
