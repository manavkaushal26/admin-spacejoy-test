import BreadCrumb from "@components/BreadCrumb";
import Carousel from "@components/Carousel";
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

const HeadingStyled = styled.h3`
	margin-bottom: 3rem;
`;

const DesignDescriptionStyled = styled.div`
	position: relative;
	margin-top: 100px;
	padding: 2rem 1rem 1rem;
	border-radius: 5px;
	box-shadow: 0 0 10px 0px ${({ theme }) => theme.colors.mild.black};
	color: ${({ theme }) => theme.colors.fc.dark2};
`;

const ExpertAdviseStyled = styled.div`
	position: absolute;
	top: -70px;
	height: 70px;
	width: 200px;
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
						<strong>{data.designName}</strong>
					</div>
					<div className="col-12 col-xs-8">
						{data.designBanner && (
							<Carousel slidesToShow={1} slidesToScroll={1} autoplay>
								{data.designBanner.map(concept => (
									<Image
										width="100%"
										src={`https://api.spacejoy.com/api/file/download?url=${concept}`}
										key={Math.random()}
									/>
								))}
							</Carousel>
						)}

						<div className="grid">
							<div className="col-xs-12">
								{data.designDescription && data.designDescription !== "None" && (
									<DesignDescriptionStyled>
										{data.designDescription}
										<ExpertAdviseStyled>
											<Image
												src="https://res.cloudinary.com/spacejoy/image/upload/v1573124516/web/expert-advise_pfhf9r.svg"
												width="120px"
											/>
										</ExpertAdviseStyled>
									</DesignDescriptionStyled>
								)}
							</div>
						</div>
						<HeadingStyled>Your Shopping List</HeadingStyled>
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
							<div className="grid">
								{data.designBanner.map(concept => (
									<div className="col-6" key={Math.random()}>
										<Image width="100%" src={`https://api.spacejoy.com/api/file/download?url=${concept}`} />
									</div>
								))}
							</div>
							{data.state !== "finalized" && <ConceptToolBar did={did} pid={pid} />}
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
