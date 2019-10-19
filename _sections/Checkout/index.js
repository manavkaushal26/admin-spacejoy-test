import CheckoutForm from "@sections/Forms/CheckoutForm";
import { page } from "@utils/config";
import PropTypes from "prop-types";
import React from "react";
import { Elements, StripeProvider } from "react-stripe-elements";

function index({ paymentType }) {
	return (
		<StripeProvider apiKey={page.stripe}>
			<Elements>
				<CheckoutForm paymentType={paymentType} />
			</Elements>
		</StripeProvider>
	);
}

index.defaultProps = {
	paymentType: ""
};

index.propTypes = {
	paymentType: PropTypes.string
};

export default index;
