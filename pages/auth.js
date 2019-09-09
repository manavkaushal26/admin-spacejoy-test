import Login from "@sections/Footer/LoginForm";
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
		return (
			<Layout header="solid">
				<Head>
					<title>Auth {isServer}</title>
					<meta name="robots" content="noindex, nofollow" />
				</Head>
				<div className="container">
					<div className="grid justify-space-around">
						<div className="col-xs-4 col-md-4 ">
							<AuthFormStyled>
								<h3>
									Sign in to score great deals! {flow}, {redirectUrl}
								</h3>
								{flow === "login" && <Login />}
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
