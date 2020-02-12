import User from "@customTypes/userType";
import ProjectTabView from "@sections/Dashboard/userProjectMainPanel/ProjectTabView";
import PageLayout from "@sections/Layout";
import { redirectToLocation, withAuthVerification } from "@utils/auth";
import { company } from "@utils/config";
import IndexPageMeta from "@utils/meta";
import { Row, Spin } from "antd";
import { NextPage, NextPageContext } from "next";
import Head from "next/head";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";

interface DesignExampleViewProps {
	isServer: boolean;
	authVerification: Partial<User>;
	designId: string;
	currentTab: string;
}

const MaxWidthDesignPage = styled.div`
	max-width: calc(1200px + 1rem);
	margin: auto;
`;

const Padding = styled.div`
	padding: 1rem;
`;

const DesignExamples: NextPage<DesignExampleViewProps> = ({ isServer, authVerification, designId, currentTab }) => {
	const [loading, setLoading] = useState<boolean>(false);

	const Router = useRouter();

	const goBack = (): void => {
		redirectToLocation({ pathname: "/designexamples", url: "/designexamples" });
	};
	useEffect(() => {
		if (!authVerification.name) {
			Router.push("/auth", "/auth/login");
		}
	}, [authVerification]);

	const onTabChange = (activeKey, pid = null, did): void => {
		if (!pid)
			Router.push(
				{
					pathname: `/designexamples/designExampleView`,
					query: { designId: did, activeKey },
				},
				`/designexamples/${did}?activeKey=${activeKey}`,
				{ shallow: true }
			);
	};

	return (
		<PageLayout isServer={isServer} authVerification={authVerification}>
			<Head>
				<title>
					Design Examples | {designId} | {company.product}
				</title>
				{IndexPageMeta}
			</Head>
			<MaxWidthDesignPage>
				<Spin spinning={loading}>
					<Padding>
						<Row gutter={[16, 16]}>
							<ProjectTabView
								onTabChangeCallback={onTabChange}
								currentTab={currentTab}
								onSelectDesign={goBack}
								designId={designId}
								setLoading={setLoading}
							/>
						</Row>
					</Padding>
				</Spin>
			</MaxWidthDesignPage>
		</PageLayout>
	);
};

DesignExamples.getInitialProps = async (ctx: NextPageContext): Promise<DesignExampleViewProps> => {
	const {
		req,
		query: { designId, activeKey },
	} = ctx;
	const isServer = !!req;

	const authVerification = {
		name: "",
		email: "",
	};
	const designIdAsString = designId as string;
	const activeKeyAsString = activeKey as string;
	return { isServer, authVerification, designId: designIdAsString, currentTab: activeKeyAsString };
};

export default withAuthVerification(DesignExamples);
