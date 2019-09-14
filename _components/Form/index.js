import { login, redirectToLocation } from "@utils/auth";
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
		React.Children.map(props.children, ({ props: { name, value } }) => {
			stateObj[name] = {
				value: value || "",
				error: ""
			};
		});
		this.state = { ...stateObj, formStatus: "", address: {} };
	}

	handleSubmit = async event => {
		event.preventDefault();
		const { state } = this;
		const { destination, name, redirectUrl } = this.props;
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
				if (destination === "/forms") {
					return {
						data: {
							env: process.env.NODE_ENV,
							source: name,
							formdata: [
								{
									key: "firstName",
									value: state.userName.value
								},
								{
									key: "email",
									value: state.userEmail.value
								},
								{
									key: "mobile",
									value: state.userMobile.value
								},
								{
									key: "whichRoomAreYouDesigning",
									value: state.whichRoomAreYouDesigning.value
								},
								{
									key: "haveABudgetInMind",
									value: state.haveABudgetInMind.value
								},
								{
									key: "howDoesYourRoomLookToday",
									value: state.howDoesYourRoomLookToday.value
								},
								{
									key: "address",
									value: state.address.value
								}
							],
							user: {
								user_id: "some id 1",
								formName: "a b",
								formEmail: "abc@gmail.com",
								formPhone: 9999999
							}
						}
					};
				}
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
		const response = await fetch(page.apiBaseUrl + destination, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(reqBody(name))
		});
		if (response.status >= 200 && response.status <= 300) {
			const responseData = await response.json();
			this.setState({ formStatus: responseData.status });
			if (name === "login" || name === "signup") {
				const { token } = responseData;
				await login({ token, redirectUrl });
			}
			if (name === "designmyspace") {
				redirectToLocation(redirectUrl, response);
			}
		} else {
			this.setState({ formStatus: response.statusText });
		}
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

	handleAddressChange = value => this.setState({ address: { value } });

	render() {
		const { children, description } = this.props;
		const { state } = this;
		return (
			<FormWrapperStyled aria-labelledby={description} onSubmit={this.handleSubmit}>
				{state.formStatus && <FormStatusStyled>{state.formStatus}</FormStatusStyled>}
				{React.Children.map(children, child => {
					const { name } = child.props;
					return React.cloneElement(child, {
						data: state[name],
						onchange: this.handleChange,
						handleAddressChange: this.handleAddressChange
					});
				})}
			</FormWrapperStyled>
		);
	}
}

FormBox.defaultProps = {
	description: "",
	redirectUrl: ""
};

FormBox.propTypes = {
	children: PropTypes.node.isRequired,
	destination: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	description: PropTypes.string,
	redirectUrl: PropTypes.string
};

export default FormBox;
