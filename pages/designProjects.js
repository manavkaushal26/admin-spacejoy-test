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
import React, { PureComponent } from "react";
import InfiniteScroll from "react-infinite-scroller";
import styled from "styled-components";

const DesignTitleStyled = styled.h2`
	margin-top: 0;
`;

const endPoint = "/demodesigns";

class designProjects extends PureComponent {
	state = {
		data: [],
		pageCount: 0,
		hasMore: false
	};

	componentDidMount() {
		this.fetchData();
	}

	fetchData = () => {
		const { pageCount } = this.state;
		fetch(`${page.apiBaseUrl}${endPoint}${pageCount === 0 ? "" : ""}`)
			.then(response => response.json())
			.then(resData => {
				if (resData.status === "success") {
					if (resData.data.list.length >= 1) {
						this.setState(prevState => ({
							data: [...prevState.data, ...resData.data.list],
							pageCount: prevState.pageCount + 1
						}));
					} else {
						this.setState({ hasMore: false });
					}
				}
			});
	};

	render() {
		const { isServer } = this.props;
		const { pageCount, hasMore, data } = this.state;
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
					<InfiniteScroll
						pageStart={pageCount}
						loadMore={this.fetchData}
						hasMore={hasMore}
						loader={
							<div className="loader" key={0}>
								Loading ...
							</div>
						}
					>
						{data.map((item, index) => (
							<div key={item.designId + Math.random()}>
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
												{item.designDescription !== "None" && (
													<>
														<div className="text-center">
															<Image
																size="10px"
																src="https://res.cloudinary.com/spacejoy/image/upload/v1568717082/web/design-devider_kqs0bb.png"
															/>
														</div>
														<p>{item.designDescription}</p>
													</>
												)}
											</div>
											<div className="cols-xs-12 col-md-6">
												<ItemCard products={item.assets} />
											</div>
										</div>
									</div>
								</div>
								{data.length !== index + 1 && <Divider />}
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

designProjects.defaultProps = {};

designProjects.propTypes = {
	isServer: PropTypes.bool.isRequired
};

export default designProjects;
