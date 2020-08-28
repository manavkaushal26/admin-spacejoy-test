import ProjectTabView from "@sections/Dashboard/userProjectMainPanel/ProjectTabView";
import PageLayout from "@sections/Layout";
import { ProtectRoute, redirectToLocation } from "@utils/authContext";
import { company } from "@utils/config";
import IndexPageMeta from "@utils/meta";
import { Spin } from "antd";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import styled from "styled-components";

interface DesignExampleViewProps {
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

const DesignExamples: NextPage<DesignExampleViewProps> = ({ designId, currentTab }) => {
	const [loading, setLoading] = useState<boolean>(false);

	const Router = useRouter();

	const goBack = (): void => {
		redirectToLocation({ pathname: "/designexamples", url: "/designexamples" });
	};

	const onTabChange = (activeKey, pid = null, did): void => {
		if (!pid)
			Router.push(
				{
					pathname: "/designexamples/designExampleView",
					query: { designId: did, activeKey },
				},
				`/designexamples/${did}?activeKey=${activeKey}`,
				{ shallow: true }
			);
	};

	return (
		<PageLayout pageName='Design Example View'>
			<Head>
				<title>
					Design Examples | {designId} | {company.product}
				</title>
				{IndexPageMeta}
			</Head>
			<MaxWidthDesignPage>
				<Spin spinning={loading}>
					<Padding>
						<ProjectTabView
							onTabChangeCallback={onTabChange}
							currentTab={currentTab}
							onSelectDesign={goBack}
							designId={designId}
							setLoading={setLoading}
						/>
					</Padding>
				</Spin>
			</MaxWidthDesignPage>
		</PageLayout>
	);
};

export const getServerSideProps: GetServerSideProps<DesignExampleViewProps> = async ctx => {
	const {
		query: { designId, activeKey },
	} = ctx;

	const designIdAsString = (designId || "") as string;
	const activeKeyAsString = (activeKey || "") as string;
	return { props: { designId: designIdAsString, currentTab: activeKeyAsString } };
};

export default ProtectRoute(DesignExamples);
