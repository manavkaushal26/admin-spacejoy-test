import HeroSection from "@sections/Home/HeroSection";
import Layout from "@sections/Layout";
import { withAuthVerification } from "@utils/auth";
import { company } from "@utils/config";
import IndexPageMeta from "@utils/meta";
import Head from "next/head";
import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { useRouter } from "next/router";

const index: React.FC<{ isServer: boolean; authVerification: Object }> = ({ isServer, authVerification }) => {
	const Router = useRouter();
	useEffect(() => {
		Router.push("/auth/login");
	}, []);

	return (
		<Layout isServer={isServer} authVerification={authVerification}>
			<Head>
				{IndexPageMeta}
				<title>Admin Panel | {company.product}</title>
			</Head>
			<HeroSection authVerification={authVerification} />
		</Layout>
	);
};

index.defaultProps = {
	authVerification: {}
};

index.propTypes = {
	isServer: PropTypes.bool.isRequired,
	authVerification: PropTypes.shape({})
};

export default withAuthVerification(index);
