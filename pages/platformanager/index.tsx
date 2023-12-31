import { ArrowLeftOutlined } from "@ant-design/icons";
import { Role } from "@customTypes/userType";
import { MaxHeightDiv } from "@sections/Dashboard/styled";
import PageLayout from "@sections/Layout";
import useAuth, { ProtectRoute, redirectToLocation } from "@utils/authContext";
import { company } from "@utils/config";
import IndexPageMeta from "@utils/meta";
import { Card, Col, Input, notification, Row, Typography } from "antd";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import styled from "styled-components";

const { Title, Text } = Typography;

export const LoudPaddingDiv = styled.div`
	padding: 2rem 1.15rem;
	@media only screen and (max-width: 1200px) {
		padding: 2rem 1.15rem;
	}
	max-width: 1200px;
	margin: auto;
`;

const MetaCards = [
	{
		name: "Collections",
		description: "Manage Design Collections",
		action: "redirect",
		to: "/platformanager/collectionsmeta",
		url: "/platformanager/collectionsmeta",
		query: {},
		allowedRoles: [Role.Admin, Role.Owner, Role.BlogAuthor, Role.BlogAdmin, Role.Analyst],
	},
	{
		name: "Package Manager",
		description: "Manage Price packages",
		action: "redirect",
		to: "/platformanager/pricemanager",
		url: "/platformanager/pricemanager",
		query: {},
		allowedRoles: [Role.Admin, Role.Owner],
	},
	{
		name: "Coupon Manager",
		description: "Manage Coupons",
		action: "redirect",
		to: "/platformanager/couponmanager",
		url: "/platformanager/couponmanager",
		query: {},
		allowedRoles: [Role.Admin, Role.Owner],
	},
	{
		name: "User Manager",
		description: "Manage Users in platform",
		action: "redirect",
		to: "/platformanager/usermanagement",
		url: "/platformanager/usermanagement",
		query: {},
		allowedRoles: [Role.Admin, Role.Owner, Role["Account Manager"]],
	},
	{
		name: "Site Config",
		description: "Update customer portal banners",
		action: "redirect",
		to: "/platformanager/siteconfig",
		url: "/platformanager/siteconfig",
		query: {},
		allowedRoles: [Role.Admin, Role.Owner],
	},
	{
		name: "New Site Config",
		description: "Update new website banners",
		action: "redirect",
		to: "/platformanager/newsiteconfig",
		url: "/platformanager/newsiteconfig",
		query: {},
		allowedRoles: [Role.Admin, Role.Owner],
	},
	{
		name: "Sitemap Manager",
		description: "Manage Sitemap in platform",
		action: "redirect",
		to: "/platformanager/sitemapmanager",
		url: "/platformanager/sitemapmanager",
		query: {},
		allowedRoles: [Role.Admin, Role.Owner, Role["Account Manager"]],
	},
];

const Platformanager: NextPage = () => {
	const Router = useRouter();
	const [searchText, setSearchText] = useState("");
	const { user: authVerification } = useAuth();

	const onSearchChange = (e): void => {
		const {
			target: { value },
		} = e;
		setSearchText(value.toLowerCase());
	};

	const onClick = ({ action, to, query, url }): void => {
		if (action === "redirect") {
			Router.push({ pathname: to, query }, url);
		} else if (action === "notComplete") {
			notification.warn({ message: "Feature not complete yet" });
		}
	};

	return (
		<PageLayout pageName='Platform Manager'>
			<Head>
				<title>Platform Manager | {company.product}</title>
				{IndexPageMeta}
			</Head>
			<MaxHeightDiv>
				<LoudPaddingDiv>
					<Row gutter={[16, 16]}>
						<Col span={24}>
							<Title level={3}>
								<Row gutter={[8, 8]}>
									<Col>
										<ArrowLeftOutlined onClick={() => redirectToLocation({ pathname: "/launchpad" })} />
									</Col>
									<Col>Platform Manager</Col>
								</Row>
							</Title>
						</Col>
						<Col span={24}>
							<Row gutter={[8, 0]}>
								<Col span={24}>Search</Col>
								<Col span={24}>
									<Input placeholder='Name of meta' value={searchText} name='search' onChange={onSearchChange} />
								</Col>
							</Row>
						</Col>
						<Col span={24}>
							<Row gutter={[8, 8]}>
								{MetaCards.filter(({ name, allowedRoles }) => {
									return name.toLowerCase().includes(searchText) && allowedRoles.includes(authVerification.role);
								}).map(metaCard => {
									const { name, description } = metaCard;
									return (
										<Col key={name} sm={12} md={8} lg={6}>
											<Card hoverable onClick={(): void => onClick(metaCard)}>
												<Row justify='center'>
													<Col span={24} style={{ textAlign: "center" }}>
														<Title level={3}>{name}</Title>
													</Col>
													<Col style={{ textAlign: "center" }} span={24}>
														<Text>{description}</Text>
													</Col>
												</Row>
											</Card>
										</Col>
									);
								})}
							</Row>
						</Col>
					</Row>
				</LoudPaddingDiv>
			</MaxHeightDiv>
		</PageLayout>
	);
};

export default ProtectRoute(Platformanager);
