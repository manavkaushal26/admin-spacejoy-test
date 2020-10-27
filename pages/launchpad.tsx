import {
	AppstoreTwoTone,
	BookTwoTone,
	DatabaseTwoTone,
	EditTwoTone,
	ProfileTwoTone,
	ShopTwoTone,
} from "@ant-design/icons";
import { Role } from "@customTypes/userType";
import PageLayout from "@sections/Layout";
import useAuth, { ProtectRoute } from "@utils/authContext";
import { getValueSafely } from "@utils/commonUtils";
import { company } from "@utils/config";
import IndexPageMeta from "@utils/meta";
import { Card, Col, Row, Typography } from "antd";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import styled from "styled-components";

const { Text, Title } = Typography;

interface LandingPageProps {
	isServer: boolean;
}

interface LaunchpadLocations {
	title: string;
	description: string;
	url: string;
	icon: JSX.Element;
	color?: string;
	notActive?: boolean;
	backgroundColor?: string;
	allowedRoles: Role[];
}

const launchpadLocations: LaunchpadLocations[] = [
	{
		title: "Projects",
		description: "Customer Project Management",
		url: "/dashboard",
		icon: <ProfileTwoTone style={{ fontSize: "3rem" }} twoToneColor='#4d2aac' />,
		color: "#4d2aac",
		backgroundColor: "#e3ddeb",
		allowedRoles: [
			Role["3D Artist"],
			Role["Account Manager"],
			Role.Admin,
			Role.Designer,
			Role.Owner,
			Role["Senior 3D Artist"],
			Role.Analyst,
		],
	},
	{
		title: "Product Store",
		description: "Create/Manage Products",
		url: "/assetstore",
		icon: <AppstoreTwoTone style={{ fontSize: "3rem" }} twoToneColor='#e66b8b' />,
		color: "#e66b8b",
		backgroundColor: "#fff0f1",
		allowedRoles: [
			Role["3D Artist"],
			Role["Account Manager"],
			Role.Admin,
			Role.Designer,
			Role.Owner,
			Role["Senior 3D Artist"],
			Role.Analyst,
		],
	},
	{
		title: "Design Examples",
		description: "Create Designs that excite you",
		url: "/designexamples",
		icon: <BookTwoTone style={{ fontSize: "3rem" }} twoToneColor='#1d39c4' />,
		color: "#1d39c4",
		backgroundColor: "#f0f5ff",
		notActive: false,
		allowedRoles: [
			Role["3D Artist"],
			Role["Account Manager"],
			Role.Admin,
			Role.Designer,
			Role.Owner,
			Role["Senior 3D Artist"],
			Role.Analyst,
		],
	},
	{
		title: "Blog Platform",
		description: "Write your heart out",
		url: "/author",
		icon: <EditTwoTone style={{ fontSize: "3rem" }} twoToneColor='#FA8C16' />,
		color: "#FA8C16",
		backgroundColor: "#FFF7E6",
		notActive: false,
		allowedRoles: [Role.Admin, Role.Owner, Role.BlogAuthor, Role.BlogAdmin, Role.Analyst],
	},
	{
		title: "Platform Manager",
		description: "Functions that apply across platform",
		url: "/platformanager",
		icon: <DatabaseTwoTone style={{ fontSize: "3rem" }} />,
		backgroundColor: "#e6f7ff",
		notActive: false,
		allowedRoles: [Role.Admin, Role.Owner, Role["Seo Team"], Role.Team, Role.Analyst, Role["Account Manager"]],
	},
	{
		title: "Ecommerce",
		description: "All things Ecommerce",
		url: "/ecommerce",
		icon: <ShopTwoTone style={{ fontSize: "3rem" }} twoToneColor='#fa541c' />,
		color: "#fa541c",
		backgroundColor: "#fff2e8",
		notActive: false,
		allowedRoles: [Role.Admin, Role.Owner, Role.Analyst],
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
	height: calc(100vh - 70px);
`;

const IconBackground = styled.div<{ color: string }>`
	padding: 1rem;
	background-color: ${({ color }): string => color};
	border-radius: 50px;
`;

const LandingPage: NextPage<LandingPageProps> = () => {
	const { user } = useAuth();

	return (
		<PageLayout pageName='Launchpad'>
			<Head>
				<title>Launchpad | {company.product}</title>
				{IndexPageMeta}
			</Head>
			<GreyMaxHeightDiv>
				<LoudPaddingDiv>
					<Row gutter={[0, 16]}>
						<Col span={24}>
							<CapitalizedTitle level={2}>Hey {getValueSafely(() => user.name, "")},</CapitalizedTitle>
							<h2 style={{ margin: 0 }}>Welcome to the Spacejoy Launchpad</h2>
						</Col>
						<Col span={24}>
							<Row gutter={[12, 12]}>
								{launchpadLocations.map(location => {
									return (
										!(location.notActive && process.env.NODE_ENV === "production") &&
										location.allowedRoles.includes(user.role) && (
											<Col sm={12} md={8} key={location.url}>
												<Link href={location.url}>
													<Card hoverable>
														<Row gutter={[0, 12]}>
															<Col span={24}>
																<Row justify='center'>
																	<IconBackground color={location.backgroundColor}>{location.icon}</IconBackground>
																</Row>
															</Col>
															<Col span={24}>
																<Row>
																	<Col span={24}>
																		<Title style={{ textAlign: "center" }} level={4}>
																			{location.title}
																		</Title>
																	</Col>
																	<Col span={24} style={{ textAlign: "center" }}>
																		<Text type='secondary'>{location.description}</Text>
																	</Col>
																</Row>
															</Col>
														</Row>
													</Card>
												</Link>
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

export default ProtectRoute(LandingPage);
