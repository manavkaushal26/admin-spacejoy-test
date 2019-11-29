import PageLayout from "@sections/Layout";
import { Row, Col } from "antd";
import { withAuthSync, withAuthVerification } from "@utils/auth";
import { company } from "@utils/config";
import Head from "next/head";
import React, { useState, useEffect } from "react";
import User from "@customTypes/userType";
import Sidebar from "@sections/AssetStore/assetSidepanel";
import { UserProjectType } from "@customTypes/dashboardTypes";
import fetcher from "@utils/fetcher";
import { ExtendedJSXFC } from "@customTypes/extendedReactComponentTypes";
import Router from "next/router";
import { NextPageContext } from "next";
import { MetaDataType } from "@customTypes/moodboardTypes";
import { CustomDiv, MaxHeightDiv } from "@sections/Dashboard/styled";
import AssetMainPanel from "@sections/AssetStore/assetMainpanel";

const metaDataEndpoint = "/unity/meta";

interface MoodboardProps {
	isServer: boolean;
	authVerification: Partial<User>;
}

const moodboard: ExtendedJSXFC<MoodboardProps> = ({ isServer, authVerification }): JSX.Element => {
	const [metaData, setMetaData] = useState<MetaDataType>(null);
	const [userProjectData, setUserProjectData] = useState<UserProjectType[]>([]);

	const fetchMetaData = async (): Promise<void> => {
		const response = await fetcher({ endPoint: metaDataEndpoint, method: "GET" });
		if (response.statusCode === 200) {
			setMetaData(response.data);
		}
	};

	useEffect(() => {
		fetchMetaData();
	}, []);

	return (
		<PageLayout isServer={isServer} authVerification={authVerification}>
			<Head>
				<title>Asset Store | {company.product}</title>
			</Head>
			<Row type={"flex"} align="top">
				<Col sm={8} md={6} lg={6} xl={4}>
					<MaxHeightDiv>
						<CustomDiv px="8px" overY='scroll'>
							<Sidebar metaData={metaData} />
						</CustomDiv>
					</MaxHeightDiv>
				</Col>
				<Col sm={16} md={18} lg={18} xl={20}>
					<MaxHeightDiv>
						<AssetMainPanel />
					</MaxHeightDiv>
				</Col>
			</Row>
		</PageLayout>
	);
};

moodboard.getInitialProps = async (ctx: NextPageContext) => {
	const { req } = ctx;
	const isServer = !!req;
	const authVerification = {
		name: "",
		email: ""
	};
	return { isServer, authVerification };
};

export default withAuthVerification(withAuthSync(moodboard));
