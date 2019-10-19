import Button from "@components/Button";
import Card from "@components/Card";
import fetcher from "@utils/fetcher";
import dynamic from "next/dynamic";
import PropTypes from "prop-types";
import React, { useState } from "react";

const Checkout = dynamic(() => import("@sections/Checkout"), { ssr: false });

function Active({ paymentType }) {
	const [submitInProgress, setSubmitInProgress] = useState(false);

	const handleClick = async () => {
		setSubmitInProgress(true);
		const endPointPayment = "/order/payment";
		const response = await fetcher({
			endPoint: endPointPayment,
			method: "POST",
			body: {
				data: {
					token: null,
					dev: process.env.NODE_ENV !== "production"
				}
			}
		});
		if (response.statusCode <= 300) {
			setSubmitInProgress(false);
		} else {
			setSubmitInProgress(false);
		}
	};

	return (
		<div>
			{paymentType === "freeTrial" ? (
				<Card bg="white">
					<Button variant="primary" shape="rounded" onClick={handleClick} submitInProgress={submitInProgress}>
						Place your order
					</Button>
				</Card>
			) : (
				<Card bg="white">
					<Checkout />
				</Card>
			)}
		</div>
	);
}

Active.defaultProps = {
	paymentType: ""
};

Active.propTypes = {
	paymentType: PropTypes.string
};

export default Active;
