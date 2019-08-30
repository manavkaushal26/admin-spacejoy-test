import Layout from "@components/Layout";
import PriceCard from "@components/PriceCard";
import Head from "next/head";
import PropTypes from "prop-types";
import React, { PureComponent } from "react";
import styled from "styled-components";

const PriceCardHolderStyled = styled.div`
	display: flex;
	width: 900px;
	margin: auto;
	padding: 2rem;
`;
class pricing extends PureComponent {
	render() {
		const { isServer } = this.props;
		return (
			<Layout header="solid">
				<Head>
					<title>Pricing {isServer}</title>
				</Head>
				<div className="container">
					<div className="grid">
						<div className="col-xs-12 text-center">
							<h1>Pricing</h1>
							<p>Custom made packages with your needs in mind.</p>
						</div>
					</div>
					<PriceCardHolderStyled>
						<PriceCard />
						<PriceCard variant="recommend" />
						<PriceCard />
					</PriceCardHolderStyled>
				</div>
			</Layout>
		);
	}
}

pricing.getInitialProps = async ({ req }) => {
	const isServer = !!req;
	return { isServer };
};

pricing.propTypes = {
	isServer: PropTypes.bool.isRequired
};
export default pricing;
