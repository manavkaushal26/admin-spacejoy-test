import Layout from "@sections/Layout";
import { withAuthSync, withAuthVerification } from "@utils/auth";
import { company } from "@utils/config";
import IndexPageMeta from "@utils/meta";
import Head from "next/head";
import PropTypes from "prop-types";
import React from "react";

const dashboard = ({ isServer, authVerification }) => {
	return (
		<Layout isServer={isServer} authVerification={authVerification}>
			<Head>
				{IndexPageMeta}
				<title>Dashboard | {company.product}</title>
			</Head>
			<div>Logged in</div>
		</Layout>
	);
};

dashboard.defaultProps = {
	data: {},
	authVerification: {
		name: "",
		email: ""
	}
};

dashboard.propTypes = {
	isServer: PropTypes.bool.isRequired,
	authVerification: PropTypes.shape({
		name: PropTypes.string,
		email: PropTypes.string
	}),
	data: PropTypes.shape({
		projects: PropTypes.arrayOf(
			PropTypes.shape({
				name: PropTypes.string,
				id: PropTypes.string
			})
		)
	})
};

export default withAuthVerification(withAuthSync(dashboard));
