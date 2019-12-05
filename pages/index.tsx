import HeroSection from "@sections/Home/HeroSection";
import Layout from "@sections/Layout";
import { withAuthVerification } from "@utils/auth";
import { company } from "@utils/config";
import IndexPageMeta from "@utils/meta";
import Head from "next/head";
import PropTypes from "prop-types";
import React from "react";


const index:React.FC<{isServer: boolean, authVerification: Object}> = ({ isServer, authVerification }) => {
	return (
		<Layout isServer={isServer} authVerification={authVerification}>
			<Head>
				{IndexPageMeta}
				<title>Admin Panel | {company.product}</title>
			</Head>
			<HeroSection />
		</Layout>
	);
}

index.defaultProps = {
	authVerification: {}
};

index.propTypes = {
	isServer: PropTypes.bool.isRequired,
	authVerification: PropTypes.shape({})
};

export default withAuthVerification(index);
