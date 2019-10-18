import BenefitList from "@components/BenefitList";
import Button from "@components/Button";
import Divider from "@components/Divider";
import Image from "@components/Image";
import SVGIcon from "@components/SVGIcon";
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
	background: ${({ theme }) => theme.colors.bg.light2};
	padding-bottom: 100px;
`;

const BaseCardStyled = styled.div`
	background: ${({ bg }) => bg};
	padding: 1rem;
	border-radius: 2px;
	min-height: 120px;
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

const CartStyled = styled(BaseCardStyled)`
	h4 {
		margin: 0.5rem 0;
		&.accent {
			color: ${({ theme }) => theme.colors.accent};
		}
	}
`;

const CartHeaderStyled = styled.div`
	border-top: 1px solid ${({ theme }) => theme.colors.bg.dark1};
	border-bottom: 1px solid ${({ theme }) => theme.colors.bg.dark1};
	margin: 1rem 0;
`;

const CartHeaderRowStyled = styled.div`
	display: flex;
	div {
		flex: 1;
		&:last-child {
			text-align: right;
		}
	}
`;

const ToggleWrapperStyled = styled.div`
	background: white;
	position: relative;
	display: flex;
	margin-bottom: 2rem;
	&:after {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		width: 50%;
		background: ${({ theme }) => theme.colors.mild.red};
		transition: all ease-in 0.25s;
	}
	&.freeTrial {
		&:after {
			left: 0;
		}
		button:first-child {
			font-weight: bold;
			color: ${({ theme }) => theme.colors.accent};
			border: 1px solid ${({ theme }) => theme.colors.accent};
		}
	}
	&.payNow {
		&:after {
			left: 50%;
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
		border: 1px solid ${({ theme }) => theme.colors.white};
	}
`;

const DummyCardStyled = styled(BaseCardStyled)`
	padding: 2rem;
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
									<ToggleWrapperStyled className={payFlow}>
										<Button fill="ghost" value="freeTrial" onClick={handleButtonToggle}>
											Free Trial
										</Button>
										<Button fill="ghost" value="payNow" onClick={handleButtonToggle}>
											Pay Now
										</Button>
									</ToggleWrapperStyled>
									<div>
										{payFlow === "payNow" && <Checkout />}
										{(complete || payFlow === "freeTrial") && (
											<DummyCardStyled bg="white">
												{complete && (
													<Link href={{ pathname: "/dashboard", query: {} }} as="/dashboard">
														<a href="/dashboard">
															<Button fill="ghost" shape="rounded" size="md">
																Go To Dashboard
															</Button>
														</a>
													</Link>
												)}
												{payFlow === "freeTrial" && (
													<Button
														variant="primary"
														shape="rounded"
														onClick={handleClick}
														submitInProgress={submitInProgress}
													>
														Place your order
													</Button>
												)}
											</DummyCardStyled>
										)}
									</div>
									<BaseCardStyled>
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
									</BaseCardStyled>
									{data && data.formData && (
										<div className="grid text-left">
											<div className="col-xs-12">
												<h3>Summary Of Your Design Preferences</h3>
												<div className="grid">
													{data.formData.map(item => (
														<div className="col-6" key={item.entry}>
															<BaseCardStyled bg="white">
																<QuestionStyled>{item.question}</QuestionStyled>
																<AnswerStyled>{item.answer || "Skipped"}</AnswerStyled>
															</BaseCardStyled>
														</div>
													))}
												</div>
											</div>
										</div>
									)}
								</div>
								<div className="col-4">
									<h3>
										<SVGIcon name="cart" height={10} />
									</h3>
									{payFlow === "payNow" && (
										<CartStyled bg="white">
											<h4>Your Savings</h4>
											<CartHeaderStyled>
												<CartHeaderRowStyled>
													<div>
														<h4 className="accent">Classic</h4>
													</div>
													<div>
														<h4>$49.00</h4>
													</div>
												</CartHeaderRowStyled>
												<CartHeaderRowStyled>
													<div>
														<h4>Total</h4>
													</div>
													<div>
														<h4>$49.00</h4>
													</div>
												</CartHeaderRowStyled>
											</CartHeaderStyled>

											<BenefitList>
												<BenefitList.Item icon="tick" nature="positive">
													Get two concepts in your style & Budget
												</BenefitList.Item>
												<BenefitList.Item icon="tick" nature="positive">
													See your home in 3D App
												</BenefitList.Item>
												<BenefitList.Item icon="tick" nature="positive">
													Give feedback & get revisions
												</BenefitList.Item>
												<BenefitList.Item icon="tick" nature="positive">
													Track project progress
												</BenefitList.Item>
												<BenefitList.Item icon="tick" nature="positive">
													Access your designs anywhere, anytime
												</BenefitList.Item>
												<BenefitList.Item icon="tick" nature="positive">
													Shop products with ease
												</BenefitList.Item>
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
												<BenefitList.Item icon="tick" nature="positive">
													Realistic 3D renders of your design
												</BenefitList.Item>
												<BenefitList.Item icon="tick" nature="positive">
													Turnaround time of 12 days
												</BenefitList.Item>
												<BenefitList.Item icon="tick" nature="positive">
													Shopping list of products
												</BenefitList.Item>
												<BenefitList.Item icon="cross" nature="neutral">
													See your home in 3D App
												</BenefitList.Item>
												<BenefitList.Item icon="cross" nature="neutral">
													Give feedback & get revisions
												</BenefitList.Item>
												<BenefitList.Item icon="cross" nature="neutral">
													Track project progress
												</BenefitList.Item>
												<BenefitList.Item icon="cross" nature="neutral">
													Access your designs anywhere, anytime
												</BenefitList.Item>
											</BenefitList>
											<Divider size="xs" />
											<h4 className="accent">Did you know?</h4>
											<p>
												Your are saving <strong>thousands of dollors</strong> on standard interior designer fees by
												choosing spacejoy.
											</p>
										</CartStyled>
									)}
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
	if (res.statusCode <= 300 && res.status === "success") {
		const { data } = res;
		return { data };
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
