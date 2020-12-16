import { ArrowLeftOutlined } from "@ant-design/icons";
import { Role } from "@customTypes/userType";
import { MaxHeightDiv } from "@sections/Dashboard/styled";
import PageLayout from "@sections/Layout";
import useAuth, { ProtectRoute, redirectToLocation } from "@utils/authContext";
import { company } from "@utils/config";
import IndexPageMeta from "@utils/meta";
import { Card, Col, Input, notification, Row, Typography } from "antd";
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
		name: "Design Styles",
		description: "Manage Design Styles",
		action: "redirect",
		to: "/stylequiz/stylesList",
		url: "/stylequiz/stylesList",
		query: {},
		allowedRoles: [Role.Admin, Role.Owner, Role.BlogAuthor, Role.BlogAdmin, Role.Analyst],
	},
	{
		name: "Room Designs",
		description: "Manage Room Designs",
		action: "redirect",
		to: "/stylequiz/imageList",
		url: "/stylequiz/imageList",
		query: { styleId: "all" },
		allowedRoles: [Role.Admin, Role.Owner],
	},
	{
		name: "Products",
		description: "Manage Products",
		action: "redirect",
		to: "/stylequiz/productList",
		url: "/stylequiz/productList",
		query: {},
		allowedRoles: [Role.Admin, Role.Owner],
	},
	{
		name: "Palettes",
		description: "Manage Palettes",
		action: "redirect",
		to: "/stylequiz/paletteList",
		url: "/stylequiz/paletteList",
		query: {},
		allowedRoles: [Role.Admin, Role.Owner],
	},
	{
		name: "Textures",
		description: "Manage Textures",
		action: "redirect",
		to: "/stylequiz/textureList",
		url: "/stylequiz/textureList",
		query: {},
		allowedRoles: [Role.Admin, Role.Owner],
	},
];

function StyleQuiz() {
	const Router = useRouter();
	const [searchText, setSearchText] = useState("");
	const { user: authVerification } = useAuth();
	const onSearchChange = e => {
		const {
			target: { value },
		} = e;
		setSearchText(value.toLowerCase());
	};

	const onClick = ({ action, to, query, url }) => {
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
											<Card hoverable onClick={() => onClick(metaCard)}>
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
}
export default ProtectRoute(StyleQuiz);
