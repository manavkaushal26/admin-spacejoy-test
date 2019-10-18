import BenefitList from "@components/BenefitList";
import BreadCrumb from "@components/BreadCrumb";
import PriceCard from "@sections/Cards/price";
import Layout from "@sections/Layout";
import { withAuthVerification } from "@utils/auth";
import { company } from "@utils/config";
import IndexPageMeta from "@utils/meta";
import PlansData from "@utils/planMock";
import Head from "next/head";
import PropTypes from "prop-types";
import React from "react";

function pricing({ isServer, authVerification }) {
	return (
		<Layout isServer={isServer} authVerification={authVerification}>
			<Head>
				{IndexPageMeta}
				<title>Pricing | {company.product}</title>
			</Head>
			<BreadCrumb />
			<div className="container">
				<div className="grid text-center">
					<div className="col-12 col-sm-12 col-md-10">
						<div className="col-12 ">
							<h1>Pricing</h1>
							<p>Custom made packages with your needs in mind.</p>
						</div>
						<div className="grid">
							{PlansData.map(plan => (
								<div className="col-12 col-sm-4" key={plan.name}>
									<PriceCard plan={plan.name} variant={plan.variant}>
										<PriceCard.Header title={plan.title} subTitle={plan.subTitle} />
										<PriceCard.Body price={plan.price} description={plan.description} thumbnail={plan.thumbnail}>
											<BenefitList>
												{plan.benefits.map(({ icon, nature, label }) => (
													<BenefitList.Item icon={icon} nature={nature} key={label}>
														{label}
													</BenefitList.Item>
												))}
											</BenefitList>
										</PriceCard.Body>
									</PriceCard>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</Layout>
	);
}

pricing.defaultProps = {
	authVerification: {}
};

pricing.propTypes = {
	isServer: PropTypes.bool.isRequired,
	authVerification: PropTypes.shape({})
};

export default withAuthVerification(pricing);
