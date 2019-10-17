import Button from "@components/Button";
import Image from "@components/Image";
import Layout from "@sections/Layout";
import SectionHeader from "@sections/SectionHeader";
import { withAuthSync, withAuthVerification } from "@utils/auth";
import fetcher from "@utils/fetcher";
import IndexPageMeta from "@utils/meta";
import dynamic from "next/dynamic";
import Head from "next/head";
import Link from "next/link";
import PropTypes from "prop-types";
import React, { useState } from "react";
import styled from "styled-components";

const Checkout = dynamic(() => import("@sections/Checkout"), { ssr: false });

const endPoint = "/form/user";

const CheckoutPageStyled = styled.div`
	background: ${({ theme }) => theme.colors.bg.light1};
`;

const StripePaymentStyled = styled.div`
	background: ${({ bg }) => bg};
	padding: 1rem;
	border-radius: 2px;
	border: 1px solid ${({ theme, bg }) => (bg ? theme.colors.bg.light2 : "transparent")};
`;

const QAWrapperStyled = styled(StripePaymentStyled)`
	transition: all liner 0.2s;
	margin-bottom: 1rem;
	&:hover {
		border: 1px solid transparent;
		box-shadow: 0 0 20px 0px ${({ theme }) => theme.colors.mild.black};
	}
`;

const OfferStyled = styled(StripePaymentStyled)`
	transition: all liner 0.2s;
	margin-bottom: 1rem;
`;

const PaymentSupportStyled = styled.small`
	margin-left: 0.5rem;
	color: ${({ theme }) => theme.colors.fc.dark3};
`;

const QuestionStyled = styled.div`
	color: ${({ theme }) => theme.colors.fc.dark1};
	margin-bottom: 1rem;
`;

const AnswerStyled = styled.div`
	color: ${({ theme }) => theme.colors.fc.dark3};
`;

function checkout({ isServer, data, authVerification }) {
	const [complete, setComplete] = useState(false);
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
			setComplete(true);
			setSubmitInProgress(false);
		} else {
			setComplete(false);
			setSubmitInProgress(false);
		}
	};

	return (
		<Layout isServer={isServer} authVerification={authVerification}>
			<Head>
				{IndexPageMeta}
				<title>Checkout</title>
			</Head>
			<CheckoutPageStyled>
				<div className="container">
					<div className="grid text-center">
						<div className="col-12 col-lg-10">
							<SectionHeader
								title="Checkout / Order Confirmation"
								description="You can modify selected preferences at anytime. "
							/>
							<div className="grid text-left">
								<div className="col-md-7">
									<h3>Payment</h3>
									<OfferStyled bg="white">
										<h3>Introductory offer</h3>
										<p>
											Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut ratione a commodi repellendus ea
											magnam voluptates placeat beatae cumque? Amet explicabo ipsa cum voluptatibus iste totam eum,
											asperiores omnis aliquam?
										</p>
										<Link href={{ pathname: "/dashboard", query: {} }} as="/dashboard">
											<a href="/dashboard">
												{complete ? (
													<Button fill="ghost" size="sm">
														Go To Dashboard
													</Button>
												) : (
													<Button
														variant="primary"
														shape="rounded"
														onClick={handleClick}
														submitInProgress={submitInProgress}
													>
														Start Your Project Now
													</Button>
												)}
											</a>
										</Link>
									</OfferStyled>
									<StripePaymentStyled bg="white">
										<Checkout />
									</StripePaymentStyled>
									<StripePaymentStyled>
										<div className="grid">
											<div className="col-4">
												<Image
													src="https://res.cloudinary.com/spacejoy/image/upload/v1571246147/web/percentage_ln88pb.svg"
													height="20px"
													width="20px"
													alt="Best Price Guarantee"
												/>
												<PaymentSupportStyled>Best Price Guarantee</PaymentSupportStyled>
											</div>
											<div className="col-4">
												<Image
													src="https://res.cloudinary.com/spacejoy/image/upload/v1571246147/web/secure_s4touw.svg"
													height="20px"
													width="20px"
													alt="100% Secure Purchase"
												/>
												<PaymentSupportStyled>100% Secure Purchase</PaymentSupportStyled>
											</div>
											<div className="col-4">
												<Image
													src="https://res.cloudinary.com/spacejoy/image/upload/v1571246147/web/money-back_q2pdgd.svg"
													height="20px"
													width="20px"
													alt="Money Back Guarantee"
												/>
												<PaymentSupportStyled>Money Back Guarantee</PaymentSupportStyled>
											</div>
										</div>
									</StripePaymentStyled>
								</div>
								<div className="col-md-5">
									<h3>Summary Of Your Design Preferences</h3>
									{data &&
										data.formData &&
										data.formData.map(item => (
											<QAWrapperStyled bg="white" key={item.entry}>
												<QuestionStyled>{item.question}</QuestionStyled>
												<AnswerStyled>{item.answer || "Skipped"}</AnswerStyled>
											</QAWrapperStyled>
										))}
								</div>
							</div>
						</div>
					</div>
				</div>
			</CheckoutPageStyled>
		</Layout>
	);
}

checkout.getInitialProps = async ctx => {
	const res = await fetcher({ ctx, endPoint, method: "GET" });
	if (res.statusCode <= 300) {
		if (res.status === "success") {
			const { data } = res;
			return { data };
		}
	}
	return {};
};

checkout.defaultProps = {
	data: {},
	authVerification: {
		name: "",
		email: ""
	}
};

checkout.propTypes = {
	isServer: PropTypes.bool.isRequired,
	authVerification: PropTypes.shape({
		name: PropTypes.string,
		email: PropTypes.string
	}),
	data: PropTypes.shape({
		formData: PropTypes.arrayOf(
			PropTypes.shape({
				key: PropTypes.string,
				value: PropTypes.string
			})
		),
		package: PropTypes.string,
		packageAmount: PropTypes.number
	})
};

export default withAuthVerification(withAuthSync(checkout));
