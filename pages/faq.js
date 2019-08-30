import Image from "@components/Image";
import Layout from "@components/Layout";
import Head from "next/head";
import { withRouter } from "next/router";
import PropTypes from "prop-types";
import React from "react";

function faq({ stars, isServer }) {
	return (
		<Layout header="solid">
			<Head>
				<title>FAQ {isServer}</title>
			</Head>
			<div className="container">
				<Image src="https://storage.googleapis.com/isuite-artifacts/homeWeb2/FAQ/How%20it%20work%20Banner%20Desktop.jpg" />
				<div className="grid">
					<div className="col-xs-12">
						<h1>Frequently Asked Questions {stars}</h1>
					</div>
				</div>
			</div>
		</Layout>
	);
}

faq.getInitialProps = async ({ req }) => {
	const isServer = !!req;
	// const res = await fetch("https://api.github.com/repos/zeit/next.js");
	// const json = await res.json();
	return { stars: 500, isServer };
};

faq.propTypes = {
	isServer: PropTypes.bool.isRequired,
	stars: PropTypes.number.isRequired
};

export default withRouter(faq);
