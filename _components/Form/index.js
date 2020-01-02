import fetcher from "@utils/fetcher";
import PropTypes from "prop-types";
import React, { PureComponent } from "react";
import styled from "styled-components";
import { login, redirectToLocation } from "../../_utils/auth";
import { ValidateEmail, ValidateMobile } from "./Validation";

const ErrorText = "error";
const SuccessText = "success";

const FormStatusStyled = styled.div`
	margin: 1rem 0 2rem 0;
	strong {
		text-transform: uppercase;
	}
`;

const FormWrapperStyled = styled.form`
	width: 100%;
	text-align: left;
	padding: ${({ status }) => (status !== "" ? "1rem" : "0rem")};
	border-radius: 2px;
	&.error {
		background-color: ${({ theme }) => theme.colors.mild.red};
		color: ${({ theme }) => theme.colors.red};
	}
	&.success {
		background-color: ${({ theme }) => theme.colors.mild.green};
		color: ${({ theme }) => theme.colors.green};
	}
`;

class FormBox extends PureComponent {
	constructor(props) {
		super(props);
		const stateObj = {};
		React.Children.map(props.children, ({ props: { name, value, type } }) => {
			stateObj[name] = {
				value: type === "checkbox" ? false : value || "",
				error: ""
			};
		});
		this.state = { ...stateObj, formStatus: "", formMessage: "", submitInProgress: false, address: {} };
	}

	handleSubmit = async event => {
		event.preventDefault();
		const { state } = this;
		const { destination, name, redirectUrl } = this.props;
		this.setState({ formStatus: "", formMessage: "", submitInProgress: true });
		function reqBody() {
			if (name === "signup") {
				return {
					data: {
						email: state.userEmail.value,
						password: state.userPassword.value,
						firstName: state.userName.value,
						lastName: "",
						phone: state.userMobile.value,
						tnc: state.userCommutePermissionGranted.value,
						privacyPolicy: state.userCommutePermissionGranted.value
					}
				};
			}
			if (name === "login") {
				return {
					email: state.userEmail.value,
					password: state.userPassword.value
				};
			}
			if (name === "forgotPassword") {
				return {
					data: {
						email: state.userEmail.value
					}
				};
			}
			if (name === "resetPassword") {
				return {
					data: {
						token: state.resetToken.value,
						password: state.userPassword.value
					}
				};
			}
			if (name === "designmyspace") {
				if (destination === "/form") {
					return {
						data: {
							name,
							environment: process.env.NODE_ENV,
							formData: [
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
									key: "package",
									value: state.selectedPlan.value
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
							userId: "",
							userEmail: state.userEmail.value
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
		const response = await fetcher({ endPoint: destination, method: "POST", body: reqBody(name) });
		if (response.statusCode <= 300) {
			if (name === "login" || name === "signup") {
				const {
					token,
					user: { role }
				} = response.data;
				login({ token, role, redirectUrl });
			} else if (redirectUrl && redirectUrl !== "") {
				redirectToLocation({ pathname: redirectUrl, url: redirectUrl });
			}
		}
		this.setState({
			formStatus: response.statusCode <= 300 ? SuccessText : ErrorText,
			formMessage: response.message,
			submitInProgress: false
		});
	};

	handleChange = event => {
		const { target } = event;
		const { name, value, type, checked } = target;
		switch (type) {
			case "hidden":
				return value
					? this.setState({ [name]: { value } })
					: this.setState({ [name]: { value, error: target.getAttribute("data-error") } });
			case "email":
				return value && ValidateEmail(value)
					? this.setState({ [name]: { value } })
					: this.setState({ [name]: { value, error: target.getAttribute("data-error") } });
			case "text":
				return value
					? this.setState({ [name]: { value } })
					: this.setState({ [name]: { value, error: target.getAttribute("data-error") } });
			case "tel":
				return value && ValidateMobile(value)
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
			case "checkbox":
				return checked
					? this.setState({ [name]: { value: checked } })
					: this.setState({ [name]: { value: checked, error: target.getAttribute("data-error") } });
			default:
				return this.setState({ [name]: { value, error: ErrorText } });
		}
	};

	handleAddressChange = value => this.setState({ address: { value } });

	render() {
		const { children, description } = this.props;
		const { state } = this;
		return (
			<FormWrapperStyled aria-labelledby={description} onSubmit={this.handleSubmit} className={state.formStatus}>
				{state.formStatus && (
					<FormStatusStyled>
						<strong>{state.formStatus}</strong> {state.formMessage && `- ${state.formMessage}`}
					</FormStatusStyled>
				)}
				{React.Children.map(children, child => {
					const { name, type } = child.props;
					return type !== "button" && type !== "submit"
						? React.cloneElement(child, {
								data: state[name],
								onchange: this.handleChange,
								handleAddressChange: this.handleAddressChange
						  })
						: React.cloneElement(child, {
								data: state[name],
								submitInProgress: state.submitInProgress
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
