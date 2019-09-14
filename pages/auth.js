import Login from "@sections/Forms/LoginForm";
import SignupForm from "@sections/Forms/SignupForm";
import Layout from "@sections/Layout";
import { company } from "@utils/config";
import IndexPageMeta from "@utils/meta";
import Head from "next/head";
import PropTypes from "prop-types";
import React from "react";

function auth({ isServer, flow, redirectUrl }) {
	return (
		<Layout header="solid" isServer={isServer}>
			<Head>
				{IndexPageMeta}
				<title>
					{flow} | {company.product}
				</title>
			</Head>
			<div className="container">
				<div className="grid">
					<div className="col-xs-12 text-center">
						<h1>{flow}</h1>
						<p>Lorem ipsum dolor, sit amet consectetur adipisicing elit.</p>
					</div>
				</div>
				<div className="grid justify-space-around">
					<div className="col-xs-12 col-sm-8 col-md-4">
						{flow === "login" && <Login redirectUrl={redirectUrl} />}
						{flow === "signup" && <SignupForm redirectUrl={redirectUrl} />}
					</div>
				</div>
			</div>
		</Layout>
	);
}

auth.getInitialProps = async ({ req, query: { flow, redirectUrl } }) => {
	const isServer = !!req;
	return { isServer, flow, redirectUrl };
};

auth.defaultProps = {
	flow: "",
	redirectUrl: ""
};

auth.propTypes = {
	isServer: PropTypes.bool.isRequired,
	flow: PropTypes.string,
	redirectUrl: PropTypes.string
};

export default auth;
