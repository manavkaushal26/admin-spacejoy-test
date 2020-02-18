import tickImg from "@static/images/tick.svg";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const CheckboxLabelStyled = styled.label`
	display: inline-flex;
	align-items: center;
	cursor: pointer;
`;

const CustomCheckboxStyled = styled.div`
	position: relative;
	width: 16px;
	height: 16px;
	left: -16px;
	background: white;
	border: 1px solid ${({ theme }) => theme.colors.bg.dark1};
	display: flex;
	justify-content: center;
	align-items: center;
	flex-shrink: 0;
	transition: all 0.1s;
	&:after {
		content: "";
		background: url(${tickImg}) no-repeat;
		position: absolute;
		height: 0;
		width: 0;
		top: 0;
		left: 0;
		background-size: 10px;
		background-position: 40% 40%;
	}
`;

const CheckboxStyled = styled.input.attrs({ type: "checkbox" })`
	/* display: none; */
	&:checked + ${CustomCheckboxStyled} {
		border-color: ${({ theme }) => theme.colors.fc.dark1};
		&:after {
			height: 16px;
			width: 16px;
		}
	}
`;

function Checkbox({ id, name, label, checked, required, onChange }) {
	return (
		<CheckboxLabelStyled htmlFor={id}>
			<CheckboxStyled
				className=""
				type="checkbox"
				id={id}
				name={name}
				checked={checked}
				required={required}
				onChange={onChange}
			/>
			<CustomCheckboxStyled />
			<span className="label">{label}</span>
		</CheckboxLabelStyled>
	);
}

Checkbox.propTypes = {
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	checked: PropTypes.bool.isRequired,
	required: PropTypes.bool.isRequired,
	onChange: PropTypes.func.isRequired,
};

export default Checkbox;
