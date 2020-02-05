import User from "@customTypes/userType";
import PageLayout from "@sections/Layout";
import { redirectToLocation, withAuthVerification } from "@utils/auth";
import { company } from "@utils/config";
import IndexPageMeta from "@utils/meta";
import { Card, Col, Icon, Row, Typography } from "antd";
import { NextPage, NextPageContext } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import styled from "styled-components";

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
	notActive?: boolean;
	backgroundColor: string;
}

const launchpadLocations = [
	{
		title: "Projects",
		description: "Customer Project Management",
		url: "/dashboard",
		icon: "profile",
		color: "#4d2aac",
		backgroundColor: "#e3ddeb",
	},
	{
		title: "Product Store",
		description: "Create/Manage Products",
		url: "/assetstore",
		icon: "appstore",
		color: "#e66b8b",
		backgroundColor: "#fff0f1",
	},
	{
		title: "Design Examples",
		description: "Create Designs that excite you",
		url: "/designexamples",
		icon: "book",
		color: "#1d39c4",
		backgroundColor: "#f0f5ff",
		notActive: true,
	},
];

const LoudPaddingDiv = styled.div`
	padding: 2rem 1.15rem;
	@media only screen and (max-width: 1200px) {
		padding: 2rem 1.15rem;
	}
	max-width: 1200px;
	margin: auto;
`;

const CapitalizedTitle = styled(Title)`
	text-transform: capitalize;
	margin-bottom: 0px !important;
`;

const GreyMaxHeightDiv = styled.div`
	height: calc(100vh - 60px);
	background-image: linear-gradient(to bottom, white, #fafafa);
`;

const IconBackground = styled.div<{ color: string }>`
	padding: 1rem;
	background-color: ${({ color }): string => color};
	border-radius: 50px;
`;

const LandingPage: NextPage<LandingPageProps> = ({ isServer, authVerification }) => {
	const Router = useRouter();
	useEffect(() => {
		if (!authVerification.name) {
			Router.push("/auth", "/auth/login");
		}
	}, [authVerification]);

	return (
		<PageLayout isServer={isServer} authVerification={authVerification}>
			<Head>
				<title>Launchpad | {company.product}</title>
				{IndexPageMeta}
			</Head>
			<GreyMaxHeightDiv>
				<LoudPaddingDiv>
					<Row gutter={[0, 16]}>
						<Col style={{ backgroundColor: "white" }}>
							<CapitalizedTitle level={2}>Hey {authVerification.name},</CapitalizedTitle>
							<h2 style={{ margin: 0 }}>Welcome to the Spacejoy Launchpad</h2>
						</Col>
						<Col>
							<Row gutter={[12, 12]}>
								{launchpadLocations.map(location => {
									return (
										!(location.notActive && process.env.NODE_ENV === "production") && (
											<Col sm={12} md={8} key={location.url}>
												<Card
													onClick={(): void =>
														redirectToLocation({ pathname: location.url, query: {}, url: location.url })
													}
													hoverable
												>
													<Row gutter={[0, 12]}>
														<Col>
															<Row type="flex" justify="center">
																<IconBackground color={location.backgroundColor}>
																	<Icon
																		style={{ fontSize: "3rem" }}
																		twoToneColor={location.color}
																		theme="twoTone"
																		type={location.icon}
																	/>
																</IconBackground>
															</Row>
														</Col>
														<Col>
															<Row>
																<Col>
																	<Title style={{ textAlign: "center" }} level={4}>
																		{location.title}
																	</Title>
																</Col>
																<Col style={{ textAlign: "center" }}>
																	<Text type="secondary">{location.description}</Text>
																</Col>
															</Row>
														</Col>
													</Row>
												</Card>
											</Col>
										)
									);
								})}
							</Row>
						</Col>
					</Row>
				</LoudPaddingDiv>
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
