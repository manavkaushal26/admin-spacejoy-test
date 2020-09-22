import { ArrowLeftOutlined } from "@ant-design/icons";
import { MaxHeightDiv } from "@sections/Dashboard/styled";
import PageLayout from "@sections/Layout";
import UserLandingPage from "@sections/UserManager/UserLandingPage";
import { company } from "@utils/config";
import IndexPageMeta from "@utils/meta";
import { Col, Row, Typography } from "antd";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { LoudPaddingDiv } from "./index";
const { Title } = Typography;

const UserManagement: NextPage = () => {
	const router = useRouter();

	return (
		<PageLayout pageName='User Manager'>
			<Head>
				<title>User Manager | {company.product}</title>
				{IndexPageMeta}
			</Head>
			<MaxHeightDiv>
				<LoudPaddingDiv>
					<Row gutter={[4, 4]}>
						<Col span={24}>
							<Title level={3}>
								<Row gutter={[8, 8]}>
									<Col>
										<ArrowLeftOutlined onClick={() => router.push("/platformanager")} />
									</Col>
									<Col>User Manager</Col>
								</Row>
							</Title>
						</Col>
						<Col span={24}>
							<UserLandingPage />
						</Col>
					</Row>
				</LoudPaddingDiv>
			</MaxHeightDiv>
		</PageLayout>
	);
};

export default UserManagement;
