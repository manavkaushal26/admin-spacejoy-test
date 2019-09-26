/* eslint-disable */

import fetcher from "@utils/fetcher";
import React, { Component } from "react";
import { CardElement, injectStripe } from "react-stripe-elements";

const endPoint = "/charge";

class CheckoutForm extends Component {
	constructor(props) {
		super(props);
		this.state = { complete: false };
		this.submit = this.submit.bind(this);
	}

	submit = async () => {
		await this.props.stripe.createToken({ name: "Name" }).then(async res => {
			if (res) {
				const response = await fetcher({ endPoint, method: "POST", body: res.token.id });
				if (response.ok) this.setState({ complete: true });
			}
		});
	};

	render() {
		if (this.state.complete) return <h1>Purchase Complete</h1>;
		return (
			<div className="checkout">
				<p>Would you like to complete the purchase?</p>
				<CardElement />
				<button onClick={this.submit}>Purchase</button>
			</div>
		);
	}
}

export default injectStripe(CheckoutForm);
