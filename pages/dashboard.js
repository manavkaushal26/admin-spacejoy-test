import BreadCrumb from "@components/BreadCrumb";
import Button from "@components/Button";
import Layout from "@sections/Layout";
import SectionHeader from "@sections/SectionHeader";
import { withAuthSync, withAuthVerification } from "@utils/auth";
import { company } from "@utils/config";
import fetcher from "@utils/fetcher";
import IndexPageMeta from "@utils/meta";
import Head from "next/head";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const endPoint = "/form/user";

const TypeFormLinkStyled = styled.div`
	margin-top: 2rem;
`;

const dashboard = ({ isServer, authVerification, data }) => {
	return (
		<Layout isServer={isServer} authVerification={authVerification}>
			<Head>
				{IndexPageMeta}
				<title>Dashboard | {company.product}</title>
			</Head>
			<BreadCrumb />
			<div className="container">
				<div className="grid">
					<div className="col-xs-6 text-center">
						<SectionHeader title={`Welcome ${authVerification.name}`} description="" />
						<div className="text-left">
							<h4>Thanks so much for signing up with {company.product}!</h4>
							<p>
								We are dedicated to helping you build out the perfect space{" "}
								{data && data.formData[1].answer ? ` for your${data.formData[1].answer}` : "."}
							</p>
							<p>We&apos;d love to set up a time for a phone call to meet and discuss the project. </p>
							<p>
								In the meantime, we&apos;ve compiled a handful of{" "}
								<a href="https://spacejoy.typeform.com/to/LewAOP" target="_blank" rel="noopener noreferrer">
									questions
								</a>{" "}
								to give us a better idea of your existing room and furniture, aesthetics, and how you want to use the
								space. Feel free to begin filling it out prior to our call.
							</p>
							<strong>
								Your designer will connect with you once you complete the questionnaire. Looking forward to speaking and
								starting to bring your vision to life.
							</strong>
							<TypeFormLinkStyled>
								<a href="https://spacejoy.typeform.com/to/LewAOP" target="_blank" rel="noopener noreferrer">
									<Button fill="ghost" size="sm">
										Start Questionnaire
									</Button>
								</a>
							</TypeFormLinkStyled>
						</div>
					</div>
				</div>
			</div>
		</Layout>
	);
};

dashboard.getInitialProps = async ctx => {
	const res = await fetcher({ ctx, endPoint, method: "GET" });
	if (res.statusCode <= 300) {
		if (res.status === "success") {
			const { data } = res;
			return { data };
		}
	}
	return {};
};

dashboard.defaultProps = {
	data: {},
	authVerification: {
		name: "",
		email: ""
	}
};

dashboard.propTypes = {
	isServer: PropTypes.bool.isRequired,
	authVerification: PropTypes.shape({
		name: PropTypes.string,
		email: PropTypes.string
	}),
	data: PropTypes.shape({
		formData: PropTypes.arrayOf(
			PropTypes.shape({
				entry: PropTypes.string,
				question: PropTypes.string,
				answer: PropTypes.string
			})
		),
		package: PropTypes.string,
		packageAmount: PropTypes.number
	})
};

export default withAuthVerification(withAuthSync(dashboard));
