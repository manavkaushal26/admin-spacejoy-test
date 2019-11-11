import BenefitList from "@components/BenefitList";
import BreadCrumb from "@components/BreadCrumb";
import UpgradePlans from "@mocks/UpgradePlans";
import PriceCard from "@sections/Cards/price";
import Layout from "@sections/Layout";
import SectionHeader from "@sections/SectionHeader";
import { withAuthVerification } from "@utils/auth";
import { company } from "@utils/config";
import IndexPageMeta from "@utils/meta";
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
					<div className="col-lg-10">
						<SectionHeader title="Pricing" description="Custom made packages with your needs in mind." />
						<div className="grid">
							{UpgradePlans.map(plan => (
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
						<div className="grid text-left">
							<div className="col-12">
								<br /> <h4>What is Deal-Hunter?</h4>
								<small>
									<sup>*</sup>We&apos;ll find you the best deals on products featured in your design <br /> Get at least
									12% off on your entire shopping list <br /> Always looking to save your precious dollars!
								</small>
							</div>
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
