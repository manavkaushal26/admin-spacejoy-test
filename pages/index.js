import Brands from "@sections/Brands";
import DesignTeam from "@sections/Home/DesignTeam";
import GetReadyBanner from "@sections/Home/GetReadyBanner";
import HeroSection from "@sections/Home/HeroSection";
import HowSteps from "@sections/Home/HowSteps";
import HowWeDoIt from "@sections/Home/HowWeDoIt";
import TestimonialsLarge from "@sections/Home/TestimonialsLarge";
import TestimonialsShort from "@sections/Home/TestimonialsShort";
import Layout from "@sections/Layout";
import { withAuthVerification } from "@utils/auth";
import { company } from "@utils/config";
import IndexPageMeta from "@utils/meta";
import Head from "next/head";
import PropTypes from "prop-types";
import React from "react";

function index({ isServer, authVerification }) {
	return (
		<Layout isServer={isServer} authVerification={authVerification}>
			<Head>
				{IndexPageMeta}
				<title>Get 3D Designs of Your Space | {company.product}</title>
			</Head>
			<HeroSection />
			<Brands />
			<HowSteps />
			<TestimonialsShort />
			<HowWeDoIt />
			<DesignTeam />
			<TestimonialsLarge />
			<GetReadyBanner />
		</Layout>
	);
}

index.defaultProps = {
	authVerification: {
		name: "",
		email: ""
	}
};

index.propTypes = {
	isServer: PropTypes.bool.isRequired,
	authVerification: PropTypes.shape({
		name: PropTypes.string,
		email: PropTypes.string
	})
};

export default withAuthVerification(index);
