import Button from "@components/Button";
import ToggleButton from "@components/ToggleButton";
import Cart from "@sections/Checkout/Cart";
import Closed from "@sections/Checkout/Closed";
import Inactive from "@sections/Checkout/Inactive";
import Summary from "@sections/Checkout/Summary";
import TrustStrip from "@sections/Checkout/TrustStrip";
import Layout from "@sections/Layout";
import SectionHeader from "@sections/SectionHeader";
import { withAuthSync, withAuthVerification } from "@utils/auth";
import fetcher from "@utils/fetcher";
import IndexPageMeta from "@utils/meta";
import dynamic from "next/dynamic";
import Head from "next/head";
import PropTypes from "prop-types";
import React, { useState } from "react";
import styled from "styled-components";

const Checkout = dynamic(() => import("@sections/Checkout"), { ssr: false });

const endPoint = "/form/user";

const CheckoutPageStyled = styled.div`
	background: ${({ theme }) => theme.colors.bg.light2};
	padding-bottom: 100px;
`;

function checkout({ isServer, data, authVerification }) {
	const [paymentType, setPaymentType] = useState("freeTrial");

	const handleButtonToggle = e => {
		setPaymentType(e.currentTarget.value);
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

							{data.status === "active" && (
								<div className="grid text-left">
									<div className="col-xs-8 ">
										<ToggleButton className={paymentType}>
											<Button
												fill="ghost"
												value="freeTrial"
												onClick={handleButtonToggle}
												action="Checkout Free Trial (tab)"
												label={`${authVerification.name} > ${authVerification.email}`}
												event="Freetrial Checkout"
												data={{ User: authVerification.name, Email: authVerification.email, Package: "Delight" }}
											>
												Free Trial
											</Button>
											<Button
												fill="ghost"
												value="payNow"
												onClick={handleButtonToggle}
												action="Checkout Payment (tab)"
												label={`${authVerification.name} > ${authVerification.email} > bliss`}
												event="Payment Checkout"
												data={{ User: authVerification.name, Email: authVerification.email, Package: "bliss" }}
											>
												Pay Now
											</Button>
										</ToggleButton>
										<Checkout paymentType={paymentType} authVerification={authVerification} />
										<TrustStrip />
										<Summary data={data} />
									</div>
									<div className="col-xs-4">
										<Cart paymentType={paymentType} />
									</div>
								</div>
							)}
							{data.status === "closed" && <Closed />}
							{data.status === "inactive" && <Inactive />}
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
		status: PropTypes.string.isRequired,
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
