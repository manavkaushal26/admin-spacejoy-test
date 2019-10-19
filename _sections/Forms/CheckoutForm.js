import Button from "@components/Button";
import Card from "@components/Card";
import Hoarding from "@sections/Checkout/Hoarding";
import Success from "@sections/Checkout/Success";
import themeConst from "@theme/index";
import fetcher from "@utils/fetcher";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { CardElement, injectStripe } from "react-stripe-elements";

const endPoint = "/order/payment";

const style = {
	base: {
		iconColor: themeConst.colors.fc.dark1,
		color: themeConst.colors.fc.dark1,
		fontSize: "14px",
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
		iconColor: themeConst.colors.red,
		color: themeConst.colors.red
	}
};

function CheckoutForm({ stripe, paymentType }) {
	const [submitInProgress, setSubmitInProgress] = useState(false);
	const [orderPlaced, setOrderPlaced] = useState(false);
	const [pageError, setPageError] = useState("");

	const handlePay = async token => {
		setSubmitInProgress(true);
		const response = await fetcher({
			endPoint,
			method: "POST",
			body: {
				data: {
					token,
					dev: process.env.NODE_ENV !== "production"
				}
			}
		});
		if (response.statusCode <= 300) {
			setSubmitInProgress(false);
			setOrderPlaced(true);
		} else {
			console.log("response", response);
			setSubmitInProgress(false);
			setOrderPlaced(false);
			setPageError(response.message);
		}
	};

	const handleSubmit = e => {
		e.preventDefault();
		if (stripe) {
			stripe.createToken({ name: "Name" }).then(({ error, token }) => {
				if (error) {
					setPageError(error.message);
					return;
				}
				handlePay(token.id);
			});
		} else {
			// eslint-disable-next-line no-console
			console.log("Stripe.js hasn't loaded yet.");
		}
	};

	if (orderPlaced) return <Success />;
	return (
		<Card bg="white">
			{pageError && <Hoarding type="error" msg={pageError} />}
			{paymentType === "freeTrial" ? (
				<Button variant="primary" shape="rounded" onClick={() => handlePay(null)} submitInProgress={submitInProgress}>
					Place your order
				</Button>
			) : (
				<form onSubmit={handleSubmit}>
					<CardElement style={style} />
					<br />
					<Button type="submit" variant="primary" shape="rounded">
						Place your order
					</Button>
				</form>
			)}
		</Card>
	);
}

CheckoutForm.defaultProps = {
	paymentType: "",
	stripe: {}
};

CheckoutForm.propTypes = {
	paymentType: PropTypes.string,
	stripe: PropTypes.shape({
		createToken: PropTypes.func
	})
};

export default injectStripe(CheckoutForm);
