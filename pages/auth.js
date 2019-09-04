import Layout from "@components/Layout";
import Head from "next/head";
import PropTypes from "prop-types";
import React, { PureComponent } from "react";

// import styled from "styled-components";

// const SummaryWrapperStyled = styled.div``;

class auth extends PureComponent {
	state = {};

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
						<div className="col-xs-12 col-md-8">
							<h3>
								Auth {flow}, {redirectUrl}
							</h3>
						</div>
						<div className="col-xs-12 col-md-4">Lo</div>
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
