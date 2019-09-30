/* eslint-disable */

import Button from "@components/Button";
import theme from "@theme/index";
import fetcher from "@utils/fetcher";
import React, { Component } from "react";
import { CardElement, injectStripe } from "react-stripe-elements";

const endPoint = "/payment";

const cardStyle = {
	base: {
		iconColor: theme.colors.fc.dark1,
		color: theme.colors.fc.dark1,
		fontWeight: "normal",
		fontFamily: "Open Sans, Segoe UI, sans-serif",
		fontSize: "14px",
		fontSmoothing: "antialiased"
	},
	invalid: {
		iconColor: theme.colors.red,
		color: theme.colors.red
	}
};

class CheckoutForm extends Component {
	constructor(props) {
		super(props);
		this.state = { complete: false };
		this.submit = this.submit.bind(this);
	}

	submit = async () => {
		await this.props.stripe
			.createToken({ name: "Name" })
			.then(async res => {
				if (res) {
					const response = await fetcher({
						endPoint,
						method: "POST",
						body: {
							data: {
								paymentToken: res.token.id
							}
						}
					});
					if (response.ok) this.setState({ complete: true });
				}
			})
			.catch(e => console.log("e", e));
	};

	render() {
		if (this.state.complete) return <h1>Purchase Complete</h1>;
		return (
			<div className="checkout">
				<p>Would you like to complete the purchase?</p>
				<CardElement style={cardStyle} />
				<br />
				<br />
				<Button variant="primary" size="sm" shape="rounded" onClick={this.submit}>
					Purchase
				</Button>
			</div>
		);
	}
}

export default injectStripe(CheckoutForm);
