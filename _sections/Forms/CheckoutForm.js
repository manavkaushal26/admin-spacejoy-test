/* eslint-disable */

import Button from "@components/Button";
import Divider from "@components/Divider";
import Image from "@components/Image";
import theme from "@theme/index";
import fetcher from "@utils/fetcher";
import React, { Component } from "react";
import { CardCVCElement, CardExpiryElement, CardNumberElement, injectStripe } from "react-stripe-elements";
import styled from "styled-components";

const CheckoutFormStyled = styled.div`
	background: ${({ theme, hasError }) => (hasError ? theme.colors.mild.red : theme.colors.white)};
	border: 1px solid ${({ theme }) => theme.colors.bg.dark1};
	border-radius: 5px;
	padding: 1rem 2rem;
	label {
		display: block;
		margin: 1.5rem 0;
		small.error {
			margin-left: 1rem;
			color: ${({ theme }) => theme.colors.red};
		}
	}
`;

const PoweredByStyled = styled.div`
	position: relative;
	text-align: right;
	top: -8px;
	small {
		color: ${({ theme }) => theme.colors.fc.dark3};
		display: block;
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
		this.state = {
			paymentStatus: false,
			complete: false,
			cardError: "",
			cardNumber: false,
			cardCvc: false,
			cardExpiry: false,
			submitInProgress: false
		};
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit = ev => {
		ev.preventDefault();
		this.setState({ submitInProgress: true });
		if (this.props.stripe) {
			this.props.stripe.createToken({ name: "Name" }).then(async payload => {
				console.log("payload", payload);
				if (payload.error) {
					this.setState({ cardError: payload.error.message });
					return;
				}
				const response = await fetcher({
					endPoint,
					method: "POST",
					body: {
						data: {
							paymentToken: payload.token.id
						}
					}
				});
				if (response.statusCode <= 300) {
					this.setState({ complete: true, paymentStatus: true });
					this.setState({ submitInProgress: false });
				} else {
					this.setState({ complete: false, paymentStatus: false });
					this.setState({ submitInProgress: false });
				}
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
		this.setState({ [change.elementType]: !change.empty });
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
		const { cardError, cardNumber, cardCvc, cardExpiry, complete, submitInProgress } = this.state;
		if (complete) return <h1>Purchase Complete</h1>;
		return (
			<CheckoutFormStyled hasError={!!cardError}>
				<form onSubmit={this.handleSubmit}>
					<label>
						Card number {cardError && <small className="error"> - {cardError}</small>}
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
					<Divider />
					<div className="container-fluid">
						<div className="grid">
							<div className="col-6">
								<Button
									type="submit"
									variant="primary"
									size="sm"
									fill="ghost"
									shape="rounded"
									disabled={!(cardNumber && cardCvc && cardExpiry)}
									submitInProgress={submitInProgress}
								>
									Pay Now
								</Button>
							</div>
							<div className="col-6">
								<PoweredByStyled>
									<small>Powered by Stripe</small>
									<Image
										src="https://res.cloudinary.com/spacejoy/image/upload/v1571244676/shared/stripe_zcmrda.svg"
										alt="powered by stripe"
										width="62px"
										height="25px"
									/>
								</PoweredByStyled>
							</div>
						</div>
					</div>
				</form>
			</CheckoutFormStyled>
		);
	}
}

export default injectStripe(CheckoutForm);
