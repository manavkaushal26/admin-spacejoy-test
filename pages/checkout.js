import Layout from "@sections/Layout";
import IndexPageMeta from "@utils/meta";
import dynamic from "next/dynamic";
import Head from "next/head";
import PropTypes from "prop-types";
import React from "react";

const Checkout = dynamic(() => import("@sections/Checkout"), { ssr: false });

function checkout({ isServer }) {
	return (
		<Layout isServer={isServer}>
			<Head>
				{IndexPageMeta}
				<title>Checkout</title>
			</Head>
			<div className="container">
				<div className="grid text-center">
					<div className="col-12">
						<h3>Payment</h3>
						<Checkout />
					</div>
				</div>
			</div>
		</Layout>
	);
}

checkout.getInitialProps = async ({ req, query: { flow, redirectUrl } }) => {
	const isServer = !!req;
	// const res = await fetcher({ endPoint: "" });
	return { isServer, flow, redirectUrl };
};

checkout.defaultProps = {};

checkout.propTypes = {
	isServer: PropTypes.bool.isRequired
};

checkout.propTypes = {};

export default checkout;
