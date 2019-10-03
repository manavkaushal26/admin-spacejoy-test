import SVGIcon from "@components/SVGIcon";
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
	padding: 0.5rem;
	border-radius: 2px;
	align-items: center;
	&:hover {
		box-shadow: 0 0 10px 0px rgba(0, 0, 0, 0.1);
	}
	span {
		margin-left: 0.5rem;
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
			<Layout>
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
										<div className="col-auto" key={Math.random() * 10}>
											<TopicStyled active={item === activeTag} onClick={() => this.handleFilter(item)}>
												<SVGIcon name="tick" height={15} width={20} fill={item === activeTag ? "#e84393" : "#aeaeae"} />
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
