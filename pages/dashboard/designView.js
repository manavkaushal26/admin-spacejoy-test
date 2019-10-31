import BreadCrumb from "@components/BreadCrumb";
import Carousel from "@components/Carousel";
import Divider from "@components/Divider";
import Image from "@components/Image";
import ItemCard from "@sections/Cards/item";
import ConceptToolBar from "@sections/Dashboard/ConceptToolBar";
import Thanks from "@sections/Dashboard/Thanks";
import Layout from "@sections/Layout";
import { withAuthSync, withAuthVerification } from "@utils/auth";
import { company } from "@utils/config";
import fetcher from "@utils/fetcher";
import IndexPageMeta from "@utils/meta";
import Head from "next/head";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const CarouselWrapper = styled.div`
	margin-bottom: 1rem;
`;

const DesignDescriptionStyled = styled.p`
	color: ${({ theme }) => theme.colors.fc.dark2};
`;

function designView({ isServer, authVerification, data, pid, did }) {
	return (
		<Layout isServer={isServer} authVerification={authVerification}>
			<Head>
				{IndexPageMeta}
				<title>
					{data.designName} | {company.product}
				</title>
				<meta key="description" name="description" content={data.designDescription} />,
				<meta key="og-description" name="og:description" property="og:description" content={data.designDescription} />,
			</Head>
			<BreadCrumb />
			<div className="container">
				<div className="grid">
					<div className="col-12">
						<strong>{data.designName}</strong> - {data.designId}
					</div>
					<div className="col-12 col-xs-8">
						<CarouselWrapper>
							{data.designBanner && (
								<Carousel slidesToShow={1} slidesToScroll={1} autoplay>
									{data.designBanner.map(concept => (
										<Image src={`https://api.spacejoy.com/api/file/download?url=${concept}`} key={Math.random()} />
									))}
								</Carousel>
							)}
						</CarouselWrapper>
						{data.state !== "finalized" && <ConceptToolBar did={did} pid={pid} />}
						{data.designDescription && data.designDescription !== "None" && (
							<DesignDescriptionStyled>{data.designDescription}</DesignDescriptionStyled>
						)}
						<h3>Your Shopping List</h3>
						<Divider />
						<ItemCard
							products={data.assets}
							gridCount={4}
							designName={data.designName}
							designId={data.designId}
							size="200"
							secure
						/>
					</div>
					{data.state !== "finalized" && (
						<div className="col-12 col-xs-4">
							<Thanks />
						</div>
					)}
				</div>
			</div>
		</Layout>
	);
}

designView.getInitialProps = async ctx => {
	const {
		query: { pid, did }
	} = ctx;
	const isServer = !!ctx.req;
	const endPoint = `/user/dashboard/project/${pid}/design/${did}`;
	const res = await fetcher({ ctx, endPoint, method: "GET" });
	if (res.statusCode <= 300) {
		const { data } = res;
		return { isServer, pid, did, data };
	}
	return {
		isServer
	};
};

designView.defaultProps = {
	data: {
		designName: "",
		designId: "",
		state: ""
	},
	authVerification: {
		name: "",
		email: ""
	}
};

designView.propTypes = {
	isServer: PropTypes.bool.isRequired,
	did: PropTypes.string.isRequired,
	pid: PropTypes.string.isRequired,
	authVerification: PropTypes.shape({
		name: PropTypes.string,
		email: PropTypes.string
	}),
	data: PropTypes.shape({
		state: PropTypes.string,
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

export default withAuthVerification(withAuthSync(designView));
