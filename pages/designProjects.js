import Divider from "@components/Divider";
import Image from "@components/Image";
import Layout from "@components/Layout";
import Head from "next/head";
import { withRouter } from "next/router";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const DesignTitleStyled = styled.h2`
	margin-top: 0;
`;

function designProjects({ isServer }) {
	return (
		<Layout header="solid">
			<Head>
				<title>Design Projects {isServer}</title>
			</Head>

			<div className="container">
				<Image src="https://res.cloudinary.com/spacejoy/image/upload/v1566896729/web/design-page-banner.jpg" />
				<div className="grid">
					<div className="col-xs-12">
						<h1>Real Designs, With Real Products</h1>
					</div>
				</div>
				<div className="grid">
					<div className="col-xs-12">
						<DesignTitleStyled>Home Office</DesignTitleStyled>
						<div className="grid">
							<div className="col-xs-6">
								<Image src="https://api.homefuly.com/projects/5d4bbde1db029b18032e6076/rooms/5d53a74fe1c6ca40dbb4e45d/versions/5d5a4130cf48ed36d481fab5/designimages/1_c.png" />
							</div>
							<div className="col-xs-6">
								<p>
									This Mid-Century-Modern home office is designed to increase productivity. The clean and open design
									uses warm and neutral accents to achive an uncluttered look. The juxtaposition of different elements
									brings the room perfectly together.
								</p>
								<h3>Shop for products featured in this design</h3>
							</div>
						</div>
					</div>
				</div>
				<Divider>
					<span>OR</span>
				</Divider>
				<div className="grid">
					<div className="col-xs-12 no-pad-vertical">
						<DesignTitleStyled>Urban Boho</DesignTitleStyled>
						<div className="grid">
							<div className="col-xs-6">
								<Image src="https://api.homefuly.com/projects/5d5116716ec2df1947e6280c/rooms/5d568a73e1c6ca40dbb5413d/versions/5d568a76e1c6ca40dbb5413e/designimages/1_c.png" />
							</div>
							<div className="col-xs-6">
								<p>
									This bedroom is designed using Urban Boho decor style. The 3 main elements of the design bringing this
									room together are - The Dondra teak bed from CB2, side tables from Paynesgrey and the large piece of
									art from Living Spaces.
								</p>
								<h3>Shop for products featured in this design</h3>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Layout>
	);
}

designProjects.getInitialProps = async ({ req }) => {
	const isServer = !!req;
	// const res = await fetch("https://api.github.com/repos/zeit/next.js");
	// const json = await res.json();
	return { isServer };
};

designProjects.propTypes = {
	isServer: PropTypes.bool.isRequired
};

export default withRouter(designProjects);
