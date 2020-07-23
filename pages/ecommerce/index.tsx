import { MaxHeightDiv } from "@sections/Dashboard/styled";
import PageLayout from "@sections/Layout";
import { redirectToLocation, withAuthVerification } from "@utils/auth";
import { company } from "@utils/config";
import IndexPageMeta from "@utils/meta";
import { Card, Col, Row, Typography } from "antd";
import { NextPage } from "next";
import Head from "next/head";
import { LoudPaddingDiv } from "pages/platformanager";
import React from "react";
import User from "@customTypes/userType";

const { Title } = Typography;

interface Ecommerce {
	authVerification: Partial<User>;
	isServer: boolean;
}

const Ecommerce: NextPage<Ecommerce> = ({ authVerification, isServer }) => {
	return (
		<PageLayout isServer={isServer} authVerification={authVerification} pageName='Ecommerce'>
			<Head>
				{IndexPageMeta}
				<title>Ecommerce | {company.product}</title>
			</Head>
			<MaxHeightDiv>
				<LoudPaddingDiv>
					<Row gutter={[8, 8]}>
						<Col span={24}>
							<Title>Ecommerce</Title>
						</Col>
						<Col sm={12} md={8} lg={6}>
							<Card
								hoverable
								onClick={() =>
									redirectToLocation({
										pathname: "/ecommerce/ordertracking",
										query: {},
										url: "/ecommerce/ordertracking",
									})
								}
							>
								<Card.Meta title='Order Tracking' />
							</Card>
						</Col>
						<Col sm={12} md={8} lg={6}>
							<Card
								hoverable
								onClick={() =>
									redirectToLocation({
										pathname: "/ecommerce/retailers",
										query: {},
										url: "/ecommerce/retailers",
									})
								}
							>
								<Card.Meta title='Retailer Management' />
							</Card>
						</Col>
					</Row>
				</LoudPaddingDiv>
			</MaxHeightDiv>
		</PageLayout>
	);
};

Ecommerce.getInitialProps = async ({ req }) => {
	return {
		isServer: !!req,
		authVerification: { name: "", email: "" },
	};
};

export default withAuthVerification(Ecommerce);
