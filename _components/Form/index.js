import PropTypes from "prop-types";
import React, { Component } from "react";
import styled from "styled-components";
import { ValidateEmail } from "./Validation";

const FormWrapperStyled = styled.form`
	width: 100%;
`;
class FormBox extends Component {
	constructor(props) {
		super(props);
		const stateObj = {};
		React.Children.map(props.children, child => {
			stateObj[child.props.name] = {
				value: "",
				error: ""
			};
		});
		this.state = stateObj;
	}

	handleSubmit = event => {
		event.preventDefault();
	};

	handleChange = event => {
		const { target } = event;
		const { name, value, type } = target;
		switch (type) {
			case "email":
				return value && ValidateEmail(value)
					? this.setState({ [name]: { value } })
					: this.setState({ [name]: { value, error: target.getAttribute("data-error") } });
			case "text":
				return value
					? this.setState({ [name]: { value } })
					: this.setState({ [name]: { value, error: target.getAttribute("data-error") } });
			case "password":
				return value
					? this.setState({ [name]: { value } })
					: this.setState({ [name]: { value, error: target.getAttribute("data-error") } });
			default:
				return this.setState({ [name]: { value, error: "Error" } });
		}
	};

	render() {
		const { children, description } = this.props;
		const { state } = this;
		return (
			<FormWrapperStyled aria-labelledby={description} onSubmit={this.handleSubmit}>
				{React.Children.map(children, child => {
					const { name } = child.props;
					return React.cloneElement(child, { data: state[name], onchange: this.handleChange });
				})}
			</FormWrapperStyled>
		);
	}
}

FormBox.defaultProps = {
	description: ""
};

FormBox.propTypes = {
	children: PropTypes.node.isRequired,
	description: PropTypes.string
};

export default FormBox;
