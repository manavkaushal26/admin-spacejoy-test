import BenefitList from "@components/BenefitList";
import Button from "@components/Button";
import Divider from "@components/Divider";
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

const CartStyled = styled(StripePaymentStyled)`
	h4 {
		margin: 0.5rem 0;
		&.accent {
			color: ${({ theme }) => theme.colors.accent};
		}
	}
`;

const ToggleWrapperStyled = styled.div`
	position: relative;
	display: flex;
	margin-bottom: 1rem;
	&:after {
		content: "";
		position: absolute;
		top: 5px;
		left: 5px;
		bottom: 5px;
		width: calc(50% - 10px);
		background: ${({ theme }) => theme.colors.mild.red};
		transition: all ease-in 0.1s;
	}
	&.freeTrial {
		&:after {
			left: 5px;
		}
		button:first-child {
			font-weight: bold;
			color: ${({ theme }) => theme.colors.accent};
			border: 1px solid ${({ theme }) => theme.colors.accent};
		}
	}
	&.payNow {
		&:after {
			left: calc(50% + 5px);
		}
		button:last-child {
			font-weight: bold;
			color: ${({ theme }) => theme.colors.accent};
			border: 1px solid ${({ theme }) => theme.colors.accent};
		}
	}
	button {
		flex: 1;
		z-index: 1;
		border: 1px solid ${({ theme }) => theme.colors.bg.light2};
	}
`;

function checkout({ isServer, data, authVerification }) {
	const [complete, setComplete] = useState(false);
	const [payFlow, setPayFlow] = useState("freeTrial");
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

	const handleButtonToggle = e => {
		setPayFlow(e.currentTarget.value);
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
						<div className="col-12 col-md-10">
							<SectionHeader title="Checkout" description="You are in good company" />
							<div className="grid text-left">
								<div className="col-8">
									<h3>Account Information</h3>
									<OfferStyled bg="white">j</OfferStyled>
									<StripePaymentStyled bg="white">
										<ToggleWrapperStyled className={payFlow}>
											<Button fill="ghost" value="freeTrial" onClick={handleButtonToggle}>
												Free Trial
											</Button>
											<Button fill="ghost" value="payNow" onClick={handleButtonToggle}>
												Pay Now
											</Button>
										</ToggleWrapperStyled>
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
								<div className="col-4">
									<h3>Cart</h3>
									{payFlow === "payNow" && (
										<CartStyled bg="white">
											<h4>Your Savings</h4>
											<Divider size="xs" />
											<h4 className="accent">Classic</h4>
											<h4>Total</h4>
											<Divider size="xs" />
											<BenefitList>
												<BenefitList.Active>Get two concepts in your style & Budget</BenefitList.Active>
												<BenefitList.Active>See your home in 3D App</BenefitList.Active>
												<BenefitList.Active>Give feedback & get revisions</BenefitList.Active>
												<BenefitList.Active>Track project progress</BenefitList.Active>
												<BenefitList.Active>Access your designs anywhere, anytime</BenefitList.Active>
												<BenefitList.Active>Shop products with ease</BenefitList.Active>
											</BenefitList>
											<Divider size="xs" />
											<h4 className="accent">Do you know?</h4>
											<p>
												Your are saving close to <strong>$4000</strong> on standard interior designer fees by choosing
												spacejoy.
											</p>
										</CartStyled>
									)}
									{payFlow === "freeTrial" && (
										<CartStyled bg="white">
											<h4>What Free Trial Includes</h4>
											<Divider size="xs" />
											<BenefitList>
												<BenefitList.Active>Get two concepts in your style & Budget</BenefitList.Active>
												<BenefitList.Active>Shop products with ease</BenefitList.Active>
												<BenefitList.InActive>See your home in 3D App</BenefitList.InActive>
												<BenefitList.InActive>Give feedback & get revisions</BenefitList.InActive>
												<BenefitList.InActive>Track project progress</BenefitList.InActive>
												<BenefitList.InActive>Access your designs anywhere, anytime</BenefitList.InActive>
											</BenefitList>
											<Divider size="xs" />
											<h4 className="accent">Do you know?</h4>
											<p>
												Your are saving close to <strong>$4000</strong> on standard interior designer fees by choosing
												spacejoy.
											</p>
										</CartStyled>
									)}
									<Divider size="xs" />
									<Link href={{ pathname: "/dashboard", query: {} }} as="/dashboard">
										<a href="/dashboard">
											{complete ? (
												<Button fill="ghost" size="md" full>
													Go To Dashboard
												</Button>
											) : (
												<Button
													full
													size="md"
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
								</div>
							</div>
							<div className="grid text-left">
								<div className="col-xs-12">
									<h3>Summary Of Your Design Preferences</h3>
									<div className="grid">
										{data &&
											data.formData &&
											data.formData.map(item => (
												<div className="col-4" key={item.entry}>
													<QAWrapperStyled bg="white">
														<QuestionStyled>{item.question}</QuestionStyled>
														<AnswerStyled>{item.answer || "Skipped"}</AnswerStyled>
													</QAWrapperStyled>
												</div>
											))}
									</div>
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
