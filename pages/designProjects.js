import Carousel from "@components/Carousel";
import Divider from "@components/Divider";
import Image from "@components/Image";
import ItemCard from "@sections/Cards/item";
import Layout from "@sections/Layout";
import { company, page } from "@utils/config";
import IndexPageMeta from "@utils/meta";
import fetch from "isomorphic-unfetch";
import Head from "next/head";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const DesignTitleStyled = styled.h2`
	margin-top: 0;
`;

function designProjects({ isServer, data }) {
	return (
		<Layout header="solid" isServer={isServer}>
			<Head>
				{IndexPageMeta}
				<title>Design Projects | {company.product}</title>
			</Head>
			<div className="container">
				<Image src="https://res.cloudinary.com/spacejoy/image/upload/v1566896729/web/design-page-banner.jpg" />
				<div className="grid">
					<div className="col-xs-12">
						<h1>Real Designs, With Real Products</h1>
					</div>
				</div>
				{data &&
					data.list.map((item, index) => (
						<div key={item.designId}>
							<div className="grid">
								<div className="col-xs-12">
									<DesignTitleStyled>{item.designName}</DesignTitleStyled>
									<div className="grid">
										<div className="cols-xs-12 col-md-6">
											<Carousel slidesToShow={1} slidesToScroll={1}>
												{item.designBanner.map(banner => (
													<Image key={Math.random()} src={banner} />
												))}
											</Carousel>
											<div className="text-center">
												<Image
													size="10px"
													src="https://res.cloudinary.com/spacejoy/image/upload/v1568717082/web/design-devider_kqs0bb.png"
												/>
											</div>
											<p>{item.designDescription}</p>
										</div>
										<div className="cols-xs-12 col-md-6">
											<ItemCard products={item.assets} />
										</div>
									</div>
								</div>
							</div>
							{data.list.length !== index + 1 && (
								<Divider>
									<span>OR</span>
								</Divider>
							)}
						</div>
					))}
			</div>
		</Layout>
	);
}

designProjects.getInitialProps = async ({ req }) => {
	const isServer = !!req;
	const endPoint = "/demodesigns";
	const res = await fetch(page.apiBaseUrl + endPoint);
	const resData = await res.json();
	const { data } = resData;
	return { isServer, data };
};

designProjects.defaultProps = {
	data: {}
};

designProjects.propTypes = {
	isServer: PropTypes.bool.isRequired,
	data: PropTypes.shape({
		list: PropTypes.array
	})
};

export default designProjects;
