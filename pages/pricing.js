import BreadCrumb from "@components/BreadCrumb";
import PriceCard from "@sections/Cards/price";
import Layout from "@sections/Layout";
import { company } from "@utils/config";
import IndexPageMeta from "@utils/meta";
import PlansData from "@utils/planMock";
import Head from "next/head";
import React from "react";
import styled from "styled-components";

const PriceCardHolderStyled = styled.div`
	display: flex;
	width: 900px;
	margin: auto;
	padding: 2rem;
`;

function pricing() {
	return (
		<Layout>
			<Head>
				{IndexPageMeta}
				<title>Pricing | {company.product}</title>
			</Head>
			<BreadCrumb />
			<div className="container">
				<div className="grid">
					<div className="col-xs-12 text-center">
						<h1>Pricing</h1>
						<p>Custom made packages with your needs in mind.</p>
					</div>
				</div>
				<PriceCardHolderStyled>
					{PlansData.map(plan => (
						<PriceCard plan={plan.name} key={plan.name} variant={plan.variant}>
							<PriceCard.Header title={plan.title} subTitle={plan.subTitle} />
							<PriceCard.Body price={plan.price} description={plan.description} thumbnail={plan.thumbnail} />
						</PriceCard>
					))}
				</PriceCardHolderStyled>
			</div>
		</Layout>
	);
}

export default pricing;
