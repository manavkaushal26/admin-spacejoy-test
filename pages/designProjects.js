import Carousel from "@components/Carousel";
import Divider from "@components/Divider";
import Image from "@components/Image";
import ItemCard from "@sections/Cards/item";
import CTA from "@sections/Home/homeUtil";
import Layout from "@sections/Layout";
import { withAuthVerification } from "@utils/auth";
import { cloudinary, company } from "@utils/config";
import { removeSpaces } from "@utils/helper";
import IndexPageMeta from "@utils/meta";
import fetch from "isomorphic-unfetch";
import Head from "next/head";
import Link from "next/link";
import PropTypes from "prop-types";
import React, { PureComponent } from "react";
import InfiniteScroll from "react-infinite-scroller";
import styled from "styled-components";

const DesignTitleStyled = styled.h3`
	padding-bottom: 1rem;
`;

const InfiniteLoaderStyled = styled.div`
	text-align: center;
	padding: 1rem;
	margin: 1rem;
	background: ${({ theme }) => theme.colors.bg.light2};
`;

const DimmerDemoDesignStyled = styled.div`
	display: flex;
	flex-direction: row;
	margin-bottom: 2rem;
	div {
		height: 200px;
		width: 100%;
		background-color: ${({ theme }) => theme.colors.bg.light1};
		margin-right: 2rem;
		justify-content: space-between;
		flex: 1;
		&:first-child {
			flex: 2;
		}
		&:last-child {
			margin-right: 0;
		}
	}
`;

class designProjects extends PureComponent {
	state = {
		data: [],
		pageCount: 0,
		hasMore: false
	};

	componentDidMount() {
		this.fetchData();
	}

	fetchData = async () => {
		const { pageCount } = this.state;
		const dataFeed = `?skip=${pageCount * 10}&limit=10`;
		const res = await fetch(`//api.homefuly.com/api/demodesigns${dataFeed}`);
		const resData = await res.json();
		if (resData.status === "success") {
			if (resData.data.count >= 1) {
				this.setState(prevState => ({
					data: [...prevState.data, ...resData.data.list],
					pageCount: prevState.pageCount + 1,
					hasMore: true
				}));
			} else {
				this.setState({ hasMore: false });
			}
		}
	};

	render() {
		const { isServer, authVerification } = this.props;
		const { hasMore, data } = this.state;
		return (
			<Layout isServer={isServer} authVerification={authVerification}>
				<Head>
					{IndexPageMeta}
					<title>Design Projects | {company.product}</title>
				</Head>
				<div className="container">
					<Image
						width="100%"
						src={`${cloudinary.baseDeliveryURL}/image/upload/v1566896729/web/design-page-banner.jpg`}
						nolazy
					/>
					<div className="grid">
						<div className="col-xs-12">
							<h1>Real Designs, With Real Products</h1>
						</div>
					</div>
					{data.length === 0 && (
						<>
							<DimmerDemoDesignStyled>
								<div />
								<div />
								<div />
							</DimmerDemoDesignStyled>
							<DimmerDemoDesignStyled>
								<div />
								<div />
								<div />
							</DimmerDemoDesignStyled>
						</>
					)}
					<InfiniteScroll
						pageStart={1}
						loadMore={this.fetchData}
						hasMore={hasMore}
						loader={
							<InfiniteLoaderStyled className="loader" key={0}>
								Loading Designs...
							</InfiniteLoaderStyled>
						}
					>
						{data.map((item, index) => (
							<div key={item.designId + Math.random()}>
								<div className="grid">
									<div className="col-xs-12">
										<DesignTitleStyled>{item.designName}</DesignTitleStyled>
										<div className="grid">
											<div className="cols-xs-12 col-md-6 col-bleed-y">
												<Link
													href={{
														pathname: "/designView",
														query: { designName: removeSpaces(item.designName), designId: item.designId }
													}}
													as={`/designView/${removeSpaces(item.designName)}/${item.designId}`}
												>
													<a href={`/designView/${removeSpaces(item.designName)}/${item.designId}`}>
														<Carousel slidesToShow={1} slidesToScroll={1}>
															{item.designBanner.map(banner => (
																<Image key={Math.random()} src={banner} />
															))}
														</Carousel>
													</a>
												</Link>
												{item.designDescription !== "None" && (
													<>
														<div className="text-center">
															<Divider fancy size="20px" />
														</div>
														<p>{item.designDescription}</p>
													</>
												)}
											</div>
											<div className="cols-xs-12 col-md-6">
												<ItemCard
													products={item.assets}
													gridCount={6}
													designName={item.designName}
													designId={item.designId}
													showLoadMore
												/>
											</div>
										</div>
									</div>
								</div>
								{data.length !== index + 1 && <Divider />}
								{index !== 0 && index % 4 === 0 && (
									<div className="text-center">
										<CTA
											variant="primary"
											size="lg"
											action="StartFreeTrial"
											label="DesignProjects"
											event="StartFreeTrial"
											data={{ sectionName: `DesignProjects${index}` }}
										/>
										<Divider />
									</div>
								)}
							</div>
						))}
					</InfiniteScroll>
				</div>
			</Layout>
		);
	}
}

designProjects.getInitialProps = async ({ req }) => {
	const isServer = !!req;
	return { isServer };
};

designProjects.defaultProps = {
	authVerification: {}
};

designProjects.propTypes = {
	isServer: PropTypes.bool.isRequired,
	authVerification: PropTypes.shape({})
};

export default withAuthVerification(designProjects);
