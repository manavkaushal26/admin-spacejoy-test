import Layout from "@components/Layout";
import Head from "next/head";
import { withRouter } from "next/router";
import PropTypes from "prop-types";
import React from "react";

function design({ isServer }) {
	return (
		<Layout header="solid">
			<Head>
				<title>My page title {isServer}</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" key="viewport" />
			</Head>
			<div className="container">
				<div className="grid">
					<div className="col-xs-12">
						<h1>design</h1>
					</div>
				</div>
			</div>
		</Layout>
	);
}

design.getInitialProps = async ({ req }) => {
	const isServer = !!req;
	// const res = await fetch("https://api.github.com/repos/zeit/next.js");
	// const json = await res.json();
	return { isServer };
};

design.propTypes = {
	isServer: PropTypes.bool.isRequired
};

export default withRouter(design);
