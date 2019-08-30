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
						<PriceCard>
							<PriceCard.Header title="Consultation" subTitle="Advice & Inspiration" />
							<PriceCard.Body
								price="19"
								description="Need a new layout in 3D of your current space with the existing furniture & upgrade advice on key pieces"
								thumbnail="https://storage.googleapis.com/isuite-artifacts/homeWeb2/spacejoy/Examples_Starter1.jpg"
							/>
						</PriceCard>
						<PriceCard variant="recommend">
							<PriceCard.Header title="Classic" subTitle="We Recommend This" />
							<PriceCard.Body
								price="49"
								description="Need a designer to design your space in 3D with furniture customized to match your style, budget and layout"
								thumbnail="https://storage.googleapis.com/isuite-artifacts/homeWeb2/spacejoy/Examples_Classic1.jpg"
							/>
						</PriceCard>
						<PriceCard>
							<PriceCard.Header title="Premium" subTitle="On a Time-Crunch" />
							<PriceCard.Body
								price="99"
								description="Need unlimited access to our designer to design your room in 3D in a shorter period of time and a stylist to manage orders"
								thumbnail="https://storage.googleapis.com/isuite-artifacts/homeWeb2/spacejoy/Examples_Premium2.jpg"
							/>
						</PriceCard>
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
