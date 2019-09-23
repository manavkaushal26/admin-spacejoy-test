import Image from "@components/Image";
import FAQCard from "@sections/Cards/faq";
import Layout from "@sections/Layout";
import { company } from "@utils/config";
import FaqData from "@utils/faqMock";
import IndexPageMeta from "@utils/meta";
import Head from "next/head";
import React, { PureComponent } from "react";
import styled from "styled-components";

const TopicStyled = styled.div`
	display: flex;
	border: 1px solid ${({ theme, active }) => (active ? theme.colors.primary1 : theme.colors.bg.dark1)};
	color: ${({ theme, active }) => (active ? theme.colors.primary1 : theme.colors.fc.dark1)};
	padding: 1rem;
	border-radius: 5px;
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
	}
`;

class faq extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			openId: 0,
			filteredData: FaqData,
			activeTag: "",
			filteredTag: ["Who are we?", "Account & Payment", "Customer Support", "Get Started", "Features & Services"]
		};
	}

	handleOpenId = openId => this.setState({ openId });

	handleFilter = filter => {
		const filteredData = FaqData.filter(item => item.tag === filter);
		this.setState({ filteredData, activeTag: filter });
	};

	render() {
		const { openId, filteredData, filteredTag, activeTag } = this.state;
		return (
			<Layout header="solid">
				<Head>
					{IndexPageMeta}
					<title>Pricing | {company.product}</title>
				</Head>
				<div className="container">
					<div className="grid">
						<div className="col-xs-12">
							<h1>Frequently Asked Questions</h1>
							<h3>Topics</h3>
							<div className="grid">
								{filteredTag &&
									filteredTag.map(item => (
										<div className="col-12 col-md-3" key={Math.random() * 10}>
											<TopicStyled active={item === activeTag} onClick={() => this.handleFilter(item)}>
												<Image
													size="xs"
													src={
														item === activeTag
															? "https://res.cloudinary.com/spacejoy/image/upload/v1568651563/shared/tick-circle-pink_twan2x.svg"
															: "https://res.cloudinary.com/spacejoy/image/upload/v1568651563/shared/tick-circle-black_tzrdza.svg"
													}
												/>
												<span>{item}</span>
											</TopicStyled>
										</div>
									))}
							</div>
							<div className="grid">
								<div className="col-xs-12 col-xs-6">
									<h3>FAQ&apos;s {activeTag ? ` - ${activeTag}` : `All`}</h3>
									{filteredData.map((item, index) => (
										<FAQCard
											key={Math.random() * 10}
											open={index === openId}
											handleOpenId={this.handleOpenId}
											quesId={index}
										>
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
}

export default faq;
