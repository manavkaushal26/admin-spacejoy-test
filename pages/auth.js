import Login from "@sections/Forms/LoginForm";
import SignupForm from "@sections/Forms/SignupForm";
import Layout from "@sections/Layout";
import Head from "next/head";
import PropTypes from "prop-types";
import React, { PureComponent } from "react";
import styled from "styled-components";

const AuthFormStyled = styled.div`
	width: 30%;
	display: flex;
	margin: auto;
	padding: 2rem 0;
	align-items: center;
	@media (max-width: 768px) {
		width: 80%;
	}
`;

class auth extends PureComponent {
	render() {
		const { isServer, flow, redirectUrl } = this.props;

		return (
			<Layout header="solid">
				<Head>
					<title>Auth {isServer}</title>
					<meta name="robots" content="noindex, nofollow" />
				</Head>
				<div className="grid">
					<div className="col-xs-12 text-center">
						<h1>{flow === "login" ? "Signin" : "Signup"}</h1>
						<p>Lorem ipsum dolor, sit amet consectetur adipisicing elit.{redirectUrl}</p>
					</div>
				</div>
				<AuthFormStyled>
					{flow === "login" && <Login />}
					{flow === "signup" && <SignupForm />}
				</AuthFormStyled>
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
