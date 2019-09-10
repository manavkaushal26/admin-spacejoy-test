import Login from "@sections/Forms/LoginForm";
import SignupForm from "@sections/Forms/SignupForm";
import Layout from "@sections/Layout";
import Head from "next/head";
import PropTypes from "prop-types";
import React, { PureComponent } from "react";
import styled from "styled-components";

const AuthFormStyled = styled.div`
	min-height: 60vh;
	width: 30%;
	display: flex;
	margin: auto;
	align-items: center;
	@media (max-width: 768px) {
		width: 80%;
	}
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
