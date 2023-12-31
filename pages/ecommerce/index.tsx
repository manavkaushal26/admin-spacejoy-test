import { ArrowLeftOutlined } from "@ant-design/icons";
import { MaxHeightDiv } from "@sections/Dashboard/styled";
import PageLayout from "@sections/Layout";
import { ProtectRoute, redirectToLocation } from "@utils/authContext";
import { company } from "@utils/config";
import IndexPageMeta from "@utils/meta";
import { Card, Col, Row, Typography } from "antd";
import { NextPage } from "next";
import Head from "next/head";
import { LoudPaddingDiv } from "pages/platformanager";
import React from "react";

const { Title } = Typography;

const Ecommerce: NextPage = () => {
	return (
		<PageLayout pageName='Ecommerce'>
			<Head>
				{IndexPageMeta}
				<title>Ecommerce | {company.product}</title>
			</Head>
			<MaxHeightDiv>
				<LoudPaddingDiv>
					<Row gutter={[8, 8]}>
						<Col span={24}>
							<Title level={3}>
								<Row gutter={[8, 8]}>
									<Col>
										<ArrowLeftOutlined onClick={() => redirectToLocation({ pathname: "/launchpad" })} />
									</Col>
									<Col>Ecommmerce</Col>
								</Row>
							</Title>
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

export default ProtectRoute(Ecommerce);
