import User from "@customTypes/userType";
import ProjectTabView from "@sections/Dashboard/userProjectMainPanel/ProjectTabView";
import PageLayout from "@sections/Layout";
import { redirectToLocation, withAuthVerification } from "@utils/auth";
import { company } from "@utils/config";
import IndexPageMeta from "@utils/meta";
import { Row, Spin } from "antd";
import { NextPage, NextPageContext } from "next";
import Head from "next/head";
import React, { useState } from "react";
import styled from "styled-components";

interface DesignExampleViewProps {
	isServer: boolean;
	authVerification: Partial<User>;
	designId: string;
}

const MaxWidthDesignPage = styled.div`
	max-width: calc(1200px + 1rem);
	margin: auto;
`;

const Padding = styled.div`
	padding: 1rem;
`;

const DesignExamples: NextPage<DesignExampleViewProps> = ({ isServer, authVerification, designId }) => {
	const [loading, setLoading] = useState<boolean>(false);

	const goBack = (): void => {
		redirectToLocation({ pathname: "/designexamples", url: "/designexamples" });
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
							<ProjectTabView onSelectDesign={goBack} designId={designId} setLoading={setLoading} />
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
		query: { designId },
	} = ctx;
	const isServer = !!req;

	const authVerification = {
		name: "",
		email: "",
	};
	const designIdAsString = designId as string;
	return { isServer, authVerification, designId: designIdAsString };
};

export default withAuthVerification(DesignExamples);
