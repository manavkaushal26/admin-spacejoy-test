import { login } from "@utils/auth";
import { page } from "@utils/config";
import PropTypes from "prop-types";
import React, { Component } from "react";
import styled from "styled-components";
import { ValidateEmail } from "./Validation";

const FormWrapperStyled = styled.form`
	width: 100%;
`;

const FormStatusStyled = styled.div`
	background: ${({ theme }) => theme.colors.primary};
	color: white;
	margin-bottom: 1rem;
	padding: 0.5rem 1rem;
	border-radius: 5px;
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
		this.state = { ...stateObj, formStatus: "" };
	}

	handleSubmit = async event => {
		console.log("submittin");
		event.preventDefault();
		const { state } = this;
		const { destination, name } = this.props;
		function reqBody() {
			if (name === "signup") {
				return {
					email: state.userEmail.value,
					password: state.userPassword.value,
					firstName: state.userName.value,
					lastName: "",
					region: "",
					role: "customer"
				};
			}
			if (name === "login") {
				return {
					email: state.userEmail.value,
					password: state.userPassword.value
				};
			}
			if (name === "designmyspace") {
				return {
					firstName: state.userName.value,
					email: state.userEmail.value,
					mobile: state.userMobile.value,
					whichRoomAreYouDesigning: state.whichRoomAreYouDesigning.value,
					haveABudgetInMind: state.haveABudgetInMind.value,
					howDoesYourRoomLookToday: state.howDoesYourRoomLookToday.value
				};
			}
			return {};
		}
		try {
			const response = await fetch(page.apiBaseUrl + destination, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(reqBody(name))
			});
			if (response.status >= 200 && response.status <= 300) {
				const { token } = await response.json();
				this.setState({ formStatus: "" });
				await login({ token });
			} else {
				this.setState({ formStatus: response.statusText });
			}
		} catch (error) {
			const { response } = error;
			console.log("response", response);
		}
	};

	handleChange = event => {
		const { target } = event;
		console.log("target", target);

		const { name, value, type } = target;
		console.log(name, value, type);
		switch (type) {
			case "email":
				return value && ValidateEmail(value)
					? this.setState({ [name]: { value } })
					: this.setState({ [name]: { value, error: target.getAttribute("data-error") } });
			case "text":
				return value
					? this.setState({ [name]: { value } })
					: this.setState({ [name]: { value, error: target.getAttribute("data-error") } });
			case "tel":
				return value
					? this.setState({ [name]: { value } })
					: this.setState({ [name]: { value, error: target.getAttribute("data-error") } });
			case "password":
				return value
					? this.setState({ [name]: { value } })
					: this.setState({ [name]: { value, error: target.getAttribute("data-error") } });
			case "radio":
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
				{state.formStatus && <FormStatusStyled>{state.formStatus}</FormStatusStyled>}
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
	destination: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	description: PropTypes.string
};

export default FormBox;