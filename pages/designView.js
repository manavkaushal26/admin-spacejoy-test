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

const DesignDescriptionStyled = styled.div`
	margin-bottom: 4rem;
	color: ${({ theme }) => theme.colors.fc.dark2};
`;

function designView({ isServer, data, designName, designId }) {
	return (
		<Layout isServer={isServer}>
			<Head>
				{IndexPageMeta}
				<title>
					{data.designName} | {company.product}
				</title>
				<meta key="description" name="description" content={data.designDescription} />,
				<meta key="og-description" name="og:description" content={data.designDescription} />,
			</Head>
			<CarouselWrapper>
				{data.designBanner && (
					<Carousel slidesToShow={2} slidesToScroll={1} autoplay>
						{data.designBanner.map(concept => (
							<Image src={concept} key={Math.random()} />
						))}
					</Carousel>
				)}
			</CarouselWrapper>
			<div className="container">
				<div className="grid">
					<div className="col-xs-12">
						<h1>{data.designName}</h1>
						{data.designDescription && data.designDescription !== "None" && (
							<DesignDescriptionStyled>{data.designDescription}</DesignDescriptionStyled>
						)}
						<ItemCard products={data.assets} gridCount={3} designName={designName} designId={designId} size="200" />
					</div>
				</div>
			</div>
		</Layout>
	);
}

designView.getInitialProps = async ({ req, query: { designName, designId } }) => {
	const isServer = !!req;
	const endPoint = `/demodesign/${designId}`;
	const res = await fetch(page.apiBaseUrl + endPoint);
	const resData = await res.json();
	if (resData.status === "success") {
		const { data } = resData;
		return { isServer, designName, designId, data };
	}
	return {
		isServer
	};
};

designView.defaultProps = {
	data: {},
	designName: "",
	designId: ""
};

designView.propTypes = {
	isServer: PropTypes.bool.isRequired,
	designName: PropTypes.string,
	designId: PropTypes.string,
	data: PropTypes.shape({
		designName: PropTypes.string,
		designId: PropTypes.string,
		designDescription: PropTypes.string,
		designBanner: PropTypes.arrayOf(PropTypes.string),
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
		)
	})
};

export default designView;
