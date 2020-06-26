import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const LabelStyled = styled.label`
	position: relative;
	cursor: pointer;
	line-height: 1.45rem;
	margin: 0.75rem 0;
	margin-bottom: ${({ selectionType }) => (selectionType ? "" : "2rem")};
	display: block;
	&:hover {
		span.label:after {
			transform: scale(3);
		}
	}
	span.label {
		position: relative;
		display: block;
		float: left;
		margin-right: 0.75rem;
		width: 20px;
		height: 20px;
		border: 2px solid ${({ theme }) => theme.colors.bg.dark1};
		border-radius: 100%;
		-webkit-tap-highlight-color: transparent;
		&:after {
			content: "";
			position: absolute;
			top: 3px;
			left: 3px;
			width: 10px;
			height: 10px;
			border-radius: 100%;
			background: ${({ theme }) => theme.colors.accent};
			transform: scale(0);
			transition: all 0.2s ease;
			opacity: 0.08;
			pointer-events: none;
		}
	}
`;

const RadioStyled = styled.input.attrs({ type: "radio" })`
	&:checked {
		& + span.label {
			border-color: ${({ theme }) => theme.colors.accent};
			&:after {
				transform: scale(1);
				transition: all 0.2s cubic-bezier(0.35, 0.9, 0.4, 0.9);
				opacity: 1;
			}
		}
	}
`;

function Radio({ id, name, value, label, checked, required, onChange, selectionType }) {
	return (
		<LabelStyled htmlFor={value} selectionType={selectionType} key={value} className='radio'>
			<RadioStyled
				className='hidden'
				type='radio'
				id={id}
				name={name}
				value={value}
				checked={checked}
				required={required}
				onChange={onChange}
			/>
			<span className='label' />
			{label}
		</LabelStyled>
	);
}

Radio.propTypes = {
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	checked: PropTypes.bool.isRequired,
	required: PropTypes.bool.isRequired,
	onChange: PropTypes.func.isRequired,
	selectionType: PropTypes.bool.isRequired,
};

export default Radio;
