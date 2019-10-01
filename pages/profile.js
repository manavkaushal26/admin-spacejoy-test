import Layout from "@sections/Layout";
import { withAuthSync, withAuthVerification } from "@utils/auth";
import { company } from "@utils/config";
import IndexPageMeta from "@utils/meta";
import Head from "next/head";
import PropTypes from "prop-types";
import React from "react";

const profile = ({ isServer, authVerification }) => {
	return (
		<Layout isServer={isServer} authVerification={authVerification}>
			<Head>
				{IndexPageMeta}
				<title>Profile | {company.product}</title>
			</Head>
			<div className="container">
				<div className="grid">
					<div className="col-xs-12 text-center">Welcome {authVerification.name}</div>
				</div>
			</div>
		</Layout>
	);
};

profile.defaultProps = {
	authVerification: {
		name: "",
		email: ""
	}
};

profile.propTypes = {
	isServer: PropTypes.bool.isRequired,
	authVerification: PropTypes.shape({
		name: PropTypes.string,
		email: PropTypes.string
	})
};

export default withAuthVerification(withAuthSync(profile));
