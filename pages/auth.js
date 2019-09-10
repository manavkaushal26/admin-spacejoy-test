import Login from "@sections/Forms/LoginForm";
import SignupForm from "@sections/Forms/SignupForm";
import Layout from "@sections/Layout";
import Head from "next/head";
import PropTypes from "prop-types";
import React, { PureComponent } from "react";
import styled from "styled-components";

const AuthFormStyled = styled.div`
	text-align: center;
`;

class auth extends PureComponent {
	render() {
		const { isServer, flow, redirectUrl } = this.props;
		console.log("redirectUrl", redirectUrl);
		return (
			<Layout header="solid">
				<Head>
					<title>Auth {isServer}</title>
					<meta name="robots" content="noindex, nofollow" />
				</Head>
				<div className="container">
					<div className="grid justify-space-around">
						<div className="col-xs-4 col-md-4">
							<AuthFormStyled>
								{flow === "login" && <Login />}
								{flow === "signup" && <SignupForm />}
							</AuthFormStyled>
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
