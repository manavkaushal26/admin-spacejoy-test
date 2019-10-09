import Button from "@components/Button";
import Image from "@components/Image";
import Brands from "@sections/Brands";
import DesignTeam from "@sections/Home/DesignTeam";
import HeroSection from "@sections/Home/HeroSection";
import HowSteps from "@sections/Home/HowSteps";
import HowWeDoIt from "@sections/Home/HowWeDoIt";
import Testimonials from "@sections/Home/Testimonials";
import Layout from "@sections/Layout";
import { withAuthVerification } from "@utils/auth";
import { company } from "@utils/config";
import IndexPageMeta from "@utils/meta";
import Head from "next/head";
import Router from "next/router";
import PropTypes from "prop-types";
import React from "react";
import ReactCompareImage from "react-compare-image";
import styled from "styled-components";

const SectionWrapperStyled = styled.section`
	padding: 100px 0;
	p {
		color: ${({ theme }) => theme.colors.fc.dark2};
	}
`;

function goToDesignMySpace() {
	Router.push("/designMySpace");
}

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
			<Testimonials />
			<HowWeDoIt />
			<DesignTeam />

			<SectionWrapperStyled style={{ backgroundImage: "white" }}>
				<div className="container">
					<div className="grid">
						<div className="col-xs-12 col-sm-4">
							<div className="grid">
								<div className="col-4  col-md-3">
									<Image
										size="100px"
										src="https://res.cloudinary.com/spacejoy/image/upload/v1568876294/web/customer3_z2vvn2.jpg"
									/>
								</div>
								<div className="col-8  col-md-9 col-bleed-y">
									<p>
										Living Room for <strong> Erika Lee </strong>
									</p>
									<p> Denver, Colorado </p>
								</div>
							</div>
							<p>
								Our designer from Spacejoy immediately caught on to our vision and delivered. The execution was
								flawless. We couldn’t be happier with how amazing our home looks right now.
							</p>
							<p>Ready to transform your home scape?</p>
							<Button variant="secondary" shape="rounded" size="lg" onClick={goToDesignMySpace}>
								DESIGN MY SPACE
							</Button>
						</div>
						<div className="col-xs-12 col-sm-8">
							<ReactCompareImage
								leftImageLabel="Before"
								leftImage="https://res.cloudinary.com/spacejoy/image/upload/c_scale,w_605/v1568876295/web/Design_2_before_igjbzg.jpg"
								rightImageLabel="After"
								rightImage="https://res.cloudinary.com/spacejoy/image/upload/c_scale,w_605/v1568876295/web/Design_2_after_m2grcx.jpg"
							/>
						</div>
					</div>
				</div>
			</SectionWrapperStyled>
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
