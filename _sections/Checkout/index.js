import CheckoutForm from "@sections/Forms/CheckoutForm";
import { page } from "@utils/config";
import React from "react";
import { Elements, StripeProvider } from "react-stripe-elements";

function index() {
	return (
		<StripeProvider apiKey={page.stripe}>
			<Elements>
				<CheckoutForm />
			</Elements>
		</StripeProvider>
	);
}

export default index;
