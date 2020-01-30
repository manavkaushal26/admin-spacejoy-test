import User from "@customTypes/userType";
import PageLayout from "@sections/Layout";
import { withAuthVerification, redirectToLocation } from "@utils/auth";
import { company } from "@utils/config";
import IndexPageMeta from "@utils/meta";
import { Card, Icon, Row, Col, Typography } from "antd";
import { NextPage, NextPageContext } from "next";
import Head from "next/head";
import React from "react";
import { getLocalStorageValue } from "@utils/storageUtils";
import styled from "styled-components";
import { PaddedDiv } from "@sections/Header/styled";
import { GreyColumn } from "@sections/Dashboard/userProjectMainPanel/TeamTab/styled";
import { MaxHeightDiv } from "@sections/Dashboard/styled";

const { Text, Title } = Typography;

interface LandingPageProps {
	isServer: boolean;
	authVerification: Partial<User>;
}

interface LaunchpadLocations {
	title: string;
	description: string;
	url: string;
	icon: string;
	color: string;
}

const launchpadLocations = [
	{
		title: "Projects",
		description: "Customer Project Management Console",
		url: "/dashboard",
		icon: "project",
		color: "#4d2aac",
	},
	{
		title: "Product Store",
		description: "Create/Manage Products",
		url: "/assetstore",
		icon: "appstore",
		color: "#e66b8b",
	},
];

const CapitalizedTitle = styled(Title)`
	text-transform: capitalize;
	margin-bottom: 0px;
`;

const GreyMaxHeightDiv = styled.div`
	height: calc(100vh - 60px);
	background-image: linear-gradient(to bottom, white, #fafafa);
`;

const LandingPage: NextPage<LandingPageProps> = ({ isServer, authVerification }) => {
	return (
		<PageLayout isServer={isServer} authVerification={authVerification}>
			<Head>
				<title>Dashboard | {company.product}</title>
				{IndexPageMeta}
			</Head>
			<GreyMaxHeightDiv>
				<Row gutter={[0, 16]}>
					<Col style={{ backgroundColor: "white", padding: "4rem 1.15rem" }}>
						<CapitalizedTitle>Hey {getLocalStorageValue<User>("authVerification").name}</CapitalizedTitle>
					</Col>
					<Col>
						<PaddedDiv>
							<Row gutter={[12, 12]}>
								{launchpadLocations.map(location => {
									return (
										<Col sm={12} md={8} lg={6} key={location.url}>
											<Card
												onClick={(): void =>
													redirectToLocation({ pathname: location.url, query: {}, url: location.url })
												}
												hoverable
											>
												<Row gutter={[0, 12]}>
													<Col>
														<Row type="flex" justify="center">
															<Icon
																style={{ fontSize: "6rem" }}
																twoToneColor={location.color}
																theme="twoTone"
																type={location.icon}
															/>
														</Row>
													</Col>
													<Col>
														<Row>
															<Col>
																<Title level={4}>{location.title}</Title>
															</Col>
															<Col>
																<Text type="secondary">{location.description}</Text>
															</Col>
														</Row>
													</Col>
												</Row>
											</Card>
										</Col>
									);
								})}
							</Row>
						</PaddedDiv>
					</Col>
				</Row>
			</GreyMaxHeightDiv>
		</PageLayout>
	);
};

LandingPage.getInitialProps = async (ctx: NextPageContext): Promise<LandingPageProps> => {
	const { req } = ctx;
	const isServer = !!req;

	const authVerification = {
		name: "",
		email: "",
	};
	return { isServer, authVerification };
};

export default withAuthVerification(LandingPage);
