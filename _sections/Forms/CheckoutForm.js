/* eslint-disable */

import Button from "@components/Button";
import theme from "@theme/index";
import fetcher from "@utils/fetcher";
import React, { Component } from "react";
import { CardCVCElement, CardExpiryElement, CardNumberElement, injectStripe } from "react-stripe-elements";
import styled from "styled-components";

const CheckoutFormStyled = styled.div`
	border: 1px solid ${({ theme }) => theme.colors.bg.dark1};
	border-radius: 5px;
	padding: 1rem 2rem;
	label {
		display: block;
		margin: 1.5rem 0;
	}
`;

const endPoint = "/payment";

const createOptions = () => {
	return {
		style: {
			base: {
				iconColor: theme.colors.fc.dark1,
				color: theme.colors.fc.dark1,
				fontSize: "14px",
				color: "#424770",
				letterSpacing: "0.025em",
				fontWeight: "normal",
				fontFamily: "Open Sans, Segoe UI, sans-serif",
				fontSmoothing: "antialiased",
				padding: "14px",
				"::placeholder": {
					color: "#aab7c4"
				}
			},
			invalid: {
				iconColor: theme.colors.red,
				color: theme.colors.red
			}
		}
	};
};

class CheckoutForm extends Component {
	constructor(props) {
		super(props);
		this.state = { complete: false };
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit = ev => {
		ev.preventDefault();
		if (this.props.stripe) {
			this.props.stripe.createToken({ name: "Name" }).then(async payload => {
				const response = await fetcher({
					endPoint,
					method: "POST",
					body: {
						data: {
							paymentToken: payload.token.id
						}
					}
				});
				if (response.statusCode <= 300) this.setState({ complete: true });
			});
		} else {
			console.log("Stripe.js hasn't loaded yet.");
		}
	};

	handleBlur = () => {
		console.log("[blur]");
	};

	handleChange = change => {
		console.log("[change]", change);
	};

	handleClick = () => {
		console.log("[click]");
	};

	handleFocus = () => {
		console.log("[focus]");
	};

	handleReady = () => {
		console.log("[ready]");
	};

	render() {
		if (this.state.complete) return <h1>Purchase Complete</h1>;
		return (
			<CheckoutFormStyled>
				<form onSubmit={this.handleSubmit}>
					<label>
						Card number
						<CardNumberElement
							onBlur={this.handleBlur}
							onChange={this.handleChange}
							onFocus={this.handleFocus}
							onReady={this.handleReady}
							{...createOptions()}
						/>
					</label>
					<label>
						Expiration date
						<CardExpiryElement
							onBlur={this.handleBlur}
							onChange={this.handleChange}
							onFocus={this.handleFocus}
							onReady={this.handleReady}
							{...createOptions()}
						/>
					</label>
					<label>
						CVC
						<CardCVCElement
							onBlur={this.handleBlur}
							onChange={this.handleChange}
							onFocus={this.handleFocus}
							onReady={this.handleReady}
							{...createOptions()}
						/>
					</label>
					<Button variant="primary" size="sm" fill="ghost" shape="rounded">
						Pay Now
					</Button>
				</form>
			</CheckoutFormStyled>
		);
	}
}

export default injectStripe(CheckoutForm);
