import User from "@customTypes/userType";
import PageLayout from "@sections/Layout";
import { withAuthVerification } from "@utils/auth";
import { company } from "@utils/config";
import IndexPageMeta from "@utils/meta";
import { NextPage, NextPageContext } from "next";
import Head from "next/head";
import React from "react";
import { Row, Col, Button } from "antd";
import styled from "styled-components";
import DesignListDisplay from "@sections/DesignExamples/DesignListDisplay";

interface DesignExamplesProps {
	isServer: boolean;
	authVerification: Partial<User>;
}

const MaxWidthDesignPage = styled.div`
	max-width: 1200px;
	margin: auto;
`;

const DesignExamples: NextPage<DesignExamplesProps> = ({ isServer, authVerification }) => {
	return (
		<PageLayout isServer={isServer} authVerification={authVerification}>
			<Head>
				<title>Design Examples | {company.product}</title>
				{IndexPageMeta}
			</Head>
			<MaxWidthDesignPage>
				<Row gutter={[16, 16]}>
					<Col>
						<Row style={{ padding: "2rem 2rem" }} type="flex" justify="end">
							<Button type="primary">Create new Design</Button>
						</Row>
					</Col>
					<Col>
						<Row>
							<Col sm={0} md={6}>
								Filter
							</Col>
							<Col md={18}>
								<DesignListDisplay />
							</Col>
						</Row>
					</Col>
				</Row>
			</MaxWidthDesignPage>
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
