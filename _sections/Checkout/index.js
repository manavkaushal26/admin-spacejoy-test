import CheckoutForm from "@sections/Forms/CheckoutForm";
import { page } from "@utils/config";
import PropTypes from "prop-types";
import React from "react";
import { Elements, StripeProvider } from "react-stripe-elements";

function index({ paymentType, authVerification }) {
	return (
		<StripeProvider apiKey={page.stripe}>
			<Elements>
				<CheckoutForm paymentType={paymentType} authVerification={authVerification} />
			</Elements>
		</StripeProvider>
	);
}

index.defaultProps = {
	paymentType: "",
	authVerification: {
		name: "",
		email: ""
	}
};

index.propTypes = {
	paymentType: PropTypes.string,
	authVerification: PropTypes.shape({
		name: PropTypes.string,
		email: PropTypes.string
	})
};

export default index;
