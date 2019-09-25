/* eslint-disable */

import CheckoutForm from "@sections/Forms/CheckoutForm";
import React, { Component } from "react";
import { Elements, StripeProvider } from "react-stripe-elements";

class index extends Component {
	render() {
		return (
			<StripeProvider apiKey="pk_test_TYooMQauvdEDq54NiTphI7jx">
				<div className="example">
					<h1>React Stripe Elements Example</h1>
					<Elements>
						<CheckoutForm />
					</Elements>
				</div>
			</StripeProvider>
		);
	}
}

export default index;
