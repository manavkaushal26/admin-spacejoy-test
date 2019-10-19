import Card from "@components/Card";
import Image from "@components/Image";
import React from "react";
import styled from "styled-components";

const PaymentSupportStyled = styled.small`
	margin-left: 0.5rem;
	color: ${({ theme }) => theme.colors.fc.dark3};
`;

export default function TrustStrip() {
	return (
		<Card bg="transparent">
			<div className="grid">
				<div className="col-xs-4">
					<Image
						src="https://res.cloudinary.com/spacejoy/image/upload/v1571246147/web/percentage_ln88pb.svg"
						height="20px"
						width="20px"
						alt="Best Price Guarantee"
					/>
					<PaymentSupportStyled>Best Price Guarantee</PaymentSupportStyled>
				</div>
				<div className="col-xs-4">
					<Image
						src="https://res.cloudinary.com/spacejoy/image/upload/v1571246147/web/secure_s4touw.svg"
						height="20px"
						width="20px"
						alt="100% Secure Purchase"
					/>
					<PaymentSupportStyled>100% Secure Purchase</PaymentSupportStyled>
				</div>
				<div className="col-xs-4">
					<Image
						src="https://res.cloudinary.com/spacejoy/image/upload/v1571246147/web/money-back_q2pdgd.svg"
						height="20px"
						width="20px"
						alt="Money Back Guarantee"
					/>
					<PaymentSupportStyled>Money Back Guarantee</PaymentSupportStyled>
				</div>
			</div>
		</Card>
	);
}
