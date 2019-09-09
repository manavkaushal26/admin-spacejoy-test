import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const FieldWrapperStyled = styled.div``;

function Field({ value, onchange, name, type, label, placeholder, inline, required }) {
	return (
		<FieldWrapperStyled>
			<div className="grid">
				<label htmlFor={name}>
					{!inline && (
						<div className="col-xs-12">
							<span>{label}</span>
							<input
								type={type}
								id={name}
								name={name}
								value={value}
								placeholder={placeholder}
								required={required}
								onChange={onchange}
							/>
						</div>
					)}
					{inline && (
						<>
							<div className="col-xs-6">
								<span>{label}</span>
							</div>
							<div className="col-xs-6">
								<input
									type={type}
									id={name}
									name={name}
									value={value}
									placeholder={placeholder}
									required={required}
									onChange={onchange}
								/>
							</div>
						</>
					)}
				</label>
			</div>
		</FieldWrapperStyled>
	);
}

Field.defaultProps = {
	value: "",
	onchange: () => {},
	placeholder: "",
	inline: false,
	required: false
};

Field.propTypes = {
	value: PropTypes.string,
	onchange: PropTypes.func,
	name: PropTypes.string.isRequired,
	type: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	placeholder: PropTypes.string,
	inline: PropTypes.bool,
	required: PropTypes.bool
};

export default Field;
