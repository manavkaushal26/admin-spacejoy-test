import Divider from "@components/Divider";
import FAQCard from "@components/FAQCard";
import Image from "@components/Image";
import Layout from "@components/Layout";
import FaqData from "@utils/faqMock";
import Head from "next/head";
import { withRouter } from "next/router";
import PropTypes from "prop-types";
import React, { useState } from "react";
import styled from "styled-components";

const TopicStyled = styled.div`
	display: flex;
	border: 1px solid ${({ theme }) => theme.colors.fc.dark3};
	padding: 1rem;
	border-radius: 2px;
	transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
	&:hover {
		box-shadow: 0 0 10px 0px rgba(0, 0, 0, 0.1);
	}
	img {
		margin-right: 1rem;
	}
	span {
		&:nth-child(2) {
			flex: 2;
		}
		&:last-child {
			flex: 1;
			text-align: right;
		}
	}
`;

function faq({ isServer }) {
	const [openId, setOpenId] = useState(0);
	const handleOpenId = id => setOpenId(id);
	return (
		<Layout header="solid">
			<Head>
				<title>FAQ {isServer}</title>
			</Head>
			<div className="container">
				<Image size="354px" src="https://res.cloudinary.com/spacejoy/image/upload/v1567248692/web/faq_dgczvi.jpg" />
				<div className="grid">
					<div className="col-xs-12">
						<h1>Frequently Asked Questions</h1>
						<h3>Topics</h3>
						<div className="grid">
							<div className="col-xs-12 col-md-3 ">
								<TopicStyled>
									<Image size="xs" src="https://image.flaticon.com/icons/svg/907/907830.svg" />
									<span>Who are we?</span>
									<span>92</span>
								</TopicStyled>
							</div>
							<div className="col-xs-12 col-md-3 ">
								<TopicStyled>
									<Image size="xs" src="https://image.flaticon.com/icons/svg/907/907830.svg" />
									<span>Features & Services</span>
									<span>92</span>
								</TopicStyled>
							</div>
							<div className="col-xs-12 col-md-3 ">
								<TopicStyled>
									<Image size="xs" src="https://image.flaticon.com/icons/svg/907/907830.svg" />
									<span>Get Started</span>
									<span>92</span>
								</TopicStyled>
							</div>
							<div className="col-xs-12 col-md-3 ">
								<TopicStyled>
									<Image size="xs" src="https://image.flaticon.com/icons/svg/907/907830.svg" />
									<span>Account & Payment</span>
									<span>92</span>
								</TopicStyled>
							</div>
							<div className="col-xs-12 col-md-3 ">
								<TopicStyled>
									<Image size="xs" src="https://image.flaticon.com/icons/svg/907/907830.svg" />
									<span>Account & Payment</span>
									<span>92</span>
								</TopicStyled>
							</div>
							<div className="col-xs-12 col-md-3 ">
								<TopicStyled>
									<Image size="xs" src="https://image.flaticon.com/icons/svg/907/907830.svg" />
									<span>Customer Support</span>
									<span>92</span>
								</TopicStyled>
							</div>
						</div>
						<Divider />
						<div className="grid">
							<div className="col-xs-12 col-xs-6">
								<h3>All FAQ&apos;s</h3>
								{FaqData.map((item, index) => (
									<FAQCard open={index === openId} handleOpenId={handleOpenId} quesId={index}>
										<FAQCard.Question>{item.question}</FAQCard.Question>
										<FAQCard.Answer>{item.answer}</FAQCard.Answer>
									</FAQCard>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</Layout>
	);
}

faq.getInitialProps = async ({ req }) => {
	const isServer = !!req;
	// const res = await fetch("https://api.github.com/repos/zeit/next.js");
	// const json = await res.json();
	return { isServer };
};

faq.propTypes = {
	isServer: PropTypes.bool.isRequired
};

export default withRouter(faq);
