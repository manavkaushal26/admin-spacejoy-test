import CheckoutForm from "@sections/Forms/CheckoutForm";
import React from "react";
import { Elements, StripeProvider } from "react-stripe-elements";

function index() {
	return (
		<StripeProvider apiKey="pk_test_TYooMQauvdEDq54NiTphI7jx">
			<Elements>
				<CheckoutForm />
			</Elements>
		</StripeProvider>
	);
}

export default index;
