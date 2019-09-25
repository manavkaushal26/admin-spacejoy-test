import Layout from "@sections/Layout";
import IndexPageMeta from "@utils/meta";
import dynamic from "next/dynamic";
import Head from "next/head";
import React from "react";

const Checkout = dynamic(() => import("@sections/Checkout"), { ssr: false });

function checkout() {
	return (
		<Layout>
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

checkout.propTypes = {};

export default checkout;
