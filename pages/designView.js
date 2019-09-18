import Carousel from "@components/Carousel";
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

const CarouselWrapper = styled.div`
	margin-bottom: 1rem;
`;

function designView({ isServer, list }) {
	return (
		<Layout header="solid" isServer={isServer}>
			<Head>
				{IndexPageMeta}
				<title>
					{list.designName} | {company.product}
				</title>
				<meta key="description" name="description" content={list.designDescription} />,
				<meta key="og-description" name="og:description" content={list.designDescription} />,
			</Head>
			<CarouselWrapper>
				<Carousel slidesToShow={2} slidesToScroll={2} autoplay>
					<Image src={list.designBanner[0]} />
					{list.designBanner.map(concept => (
						<Image src={concept} key={Math.random()} />
					))}
				</Carousel>
			</CarouselWrapper>
			<div className="container">
				<div className="grid">
					<div className="col-xs-12">
						<ItemCard products={list.assets} gridCount={3} designName={list.designName} designId={list.designId} />
					</div>
				</div>
			</div>
		</Layout>
	);
}

designView.getInitialProps = async ({ req, query: { designName, designId } }) => {
	const isServer = !!req;
	const endPoint = `/demodesigns?${designName}=${designId}`;
	const res = await fetch(page.apiBaseUrl + endPoint);
	const resData = await res.json();
	const { data } = resData;
	const list = data.list[0];
	return { isServer, list };
};

designView.defaultProps = {
	list: {
		designName: ""
	}
};

designView.propTypes = {
	isServer: PropTypes.bool.isRequired,
	list: PropTypes.shape({
		assets: PropTypes.arrayOf(
			PropTypes.shape({
				productId: PropTypes.string,
				productImage: PropTypes.string,
				productCost: PropTypes.number,
				productCurrency: PropTypes.string,
				productExternalUrl: PropTypes.string,
				productRetailer: PropTypes.string,
				productInventory: PropTypes.string,
				productName: PropTypes.string
			})
		),
		designBanner: PropTypes.arrayOf(PropTypes.string),
		designName: PropTypes.string.isRequired,
		designId: PropTypes.string.isRequired,
		designDescription: PropTypes.string
	})
};

export default designView;
