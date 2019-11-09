import Brands from "@sections/Brands";
import {
	DesignTeam,
	ExploreDesigns,
	GetReadyBanner,
	HeroSection,
	HowSteps,
	HowWeDoIt,
	TestimonialsLarge,
	TestimonialsShort,
	ThreeDView
} from "@sections/Home";
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
			<ThreeDView />
			<DesignTeam />
			<ExploreDesigns />
			<TestimonialsLarge />
			<GetReadyBanner />
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
