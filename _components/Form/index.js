import PropTypes from "prop-types";
import React, { Component } from "react";

class FormBox extends Component {
	state = {};

	handleSubmit = event => {
		event.preventDefault();
	};

	handleChange = event => {
		const {
			target: { name, value }
		} = event;

		this.setState({ [name]: { value, error: "Error hai" } });
	};

	render() {
		const { children, description } = this.props;
		const { state } = this;
		return (
			<form aria-labelledby={description} onSubmit={this.handleSubmit}>
				{React.Children.map(children, child => {
					const { name } = child.props;
					return React.cloneElement(child, { data: state[name], onchange: this.handleChange });
				})}
			</form>
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
