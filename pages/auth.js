import Login from "@sections/Forms/LoginForm";
import SignupForm from "@sections/Forms/SignupForm";
import Layout from "@sections/Layout";
import { company } from "@utils/config";
import IndexPageMeta from "@utils/meta";
import Head from "next/head";
import PropTypes from "prop-types";
import React, { PureComponent } from "react";

class auth extends PureComponent {
	render() {
		const { isServer, flow, redirectUrl } = this.props;

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
							<h1>{flow === "login" ? "Signin" : "Signup"}</h1>
							<p>Lorem ipsum dolor, sit amet consectetur adipisicing elit.{redirectUrl}</p>
						</div>
					</div>
					<div className="grid justify-space-around">
						<div className="col-xs-12 col-sm-8 col-md-4">
							{flow === "login" && <Login />}
							{flow === "signup" && <SignupForm />}
						</div>
					</div>
				</div>
			</Layout>
		);
	}
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
