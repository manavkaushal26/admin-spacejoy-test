import { ArrowLeftOutlined } from "@ant-design/icons";
import { MaxHeightDiv } from "@sections/Dashboard/styled";
import PageLayout from "@sections/Layout";
import { redirectToLocation } from "@utils/authContext";
import { company } from "@utils/config";
import IndexPageMeta from "@utils/meta";
import { Col, Row } from "antd";
import Head from "next/head";
import { LoudPaddingDiv } from "pages/platformanager";
import React from "react";

export default function index() {
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
						<Col sm={12} md={8} lg={6}></Col>
					</Row>
				</LoudPaddingDiv>
			</MaxHeightDiv>
		</PageLayout>
	);
}
