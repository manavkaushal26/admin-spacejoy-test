import Button from "@components/Button";
import SVGIcon from "@components/SVGIcon";
import themeConst from "@theme/index";
import fetcher from "@utils/fetcher";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { CardElement, injectStripe } from "react-stripe-elements";
import styled from "styled-components";

const CheckoutFormStyled = styled.div`
	background: ${({ theme }) => theme.colors.white};
	padding: 2rem;
	small.error {
		display: block;
		margin-top: 1rem;
		color: ${({ theme }) => theme.colors.red};
	}
	button {
		margin-top: 2rem;
	}
`;

const PaymentSuccessStyled = styled.div`
	text-align: center;
	height: 200px;
	color: ${({ theme }) => theme.colors.green};
	background: ${({ theme }) => theme.colors.mild.green};
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	svg {
		path {
			fill: ${({ theme }) => theme.colors.green};
		}
	}
`;

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

function CheckoutForm({ stripe }) {
	const [complete, setComplete] = useState(false);
	const [cardError, setCardError] = useState("");

	const handleSubmit = e => {
		e.preventDefault();
		if (stripe) {
			stripe.createToken({ name: "Name" }).then(async ({ error, token }) => {
				if (error) {
					setCardError(error.message);
					return;
				}
				const response = await fetcher({
					endPoint,
					method: "POST",
					body: {
						data: {
							token: token.id,
							dev: process.env.NODE_ENV !== "production"
						}
					}
				});
				if (response.statusCode <= 300) {
					setComplete(true);
				} else {
					setComplete(false);
				}
			});
		} else {
			console.log("Stripe.js hasn't loaded yet.");
		}
	};

	if (complete)
		return (
			<PaymentSuccessStyled>
				<SVGIcon name="tick" height={45} width={45} />
				<h3>Order placed successfully</h3>
			</PaymentSuccessStyled>
		);
	return (
		<CheckoutFormStyled>
			<form onSubmit={handleSubmit}>
				<CardElement style={style} />
				{cardError && <small className="error">{cardError}</small>}
				<Button type="submit" variant="primary" shape="rounded">
					Place your order
				</Button>
			</form>
		</CheckoutFormStyled>
	);
}

CheckoutForm.defaultProps = {
	stripe: {}
};

CheckoutForm.propTypes = {
	stripe: PropTypes.shape({
		createToken: PropTypes.func
	})
};

export default injectStripe(CheckoutForm);
