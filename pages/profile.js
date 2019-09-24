import { AuthContext } from "@context/AuthStorage";
import Layout from "@sections/Layout";
import { withAuthSync } from "@utils/auth";
import { company } from "@utils/config";
import IndexPageMeta from "@utils/meta";
import Head from "next/head";
import PropTypes from "prop-types";
import React from "react";

const profile = ({ token }) => {
	return (
		<Layout>
			<Head>
				{IndexPageMeta}
				<title>Profile | {company.product}</title>
			</Head>
			<div className="container">
				<div className="grid">
					<div className="col-xs-12 text-center">
						<AuthContext.Consumer>
							{value => (
								<button type="button" onClick={value.updateState}>
									{JSON.stringify(value.state.isAuthorized)}
								</button>
							)}
						</AuthContext.Consumer>
						{token}
					</div>
				</div>
			</div>
		</Layout>
	);
};

profile.defaultProps = {
	token: ""
};

profile.propTypes = {
	token: PropTypes.string
};

export default withAuthSync(profile);
