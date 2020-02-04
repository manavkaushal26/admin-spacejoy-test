import User from "@customTypes/userType";
import PageLayout from "@sections/Layout";
import { withAuthVerification } from "@utils/auth";
import { company } from "@utils/config";
import IndexPageMeta from "@utils/meta";
import { NextPage, NextPageContext } from "next";
import Head from "next/head";
import React from "react";

interface DesignExamplesProps {
	isServer: boolean;
	authVerification: Partial<User>;
}

const DesignExamples: NextPage<DesignExamplesProps> = ({ isServer, authVerification }) => {
	return (
		<PageLayout isServer={isServer} authVerification={authVerification}>
			<Head>
				<title>Dashboard | {company.product}</title>
				{IndexPageMeta}
			</Head>
		</PageLayout>
	);
};

DesignExamples.getInitialProps = async (ctx: NextPageContext): Promise<DesignExamplesProps> => {
	const { req } = ctx;
	const isServer = !!req;

	const authVerification = {
		name: "",
		email: "",
	};
	return { isServer, authVerification };
};

export default withAuthVerification(DesignExamples);
