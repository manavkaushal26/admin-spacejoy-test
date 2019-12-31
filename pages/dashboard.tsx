import { ExtendedJSXFC } from "@customTypes/extendedReactComponentTypes";
import User from "@customTypes/userType";
import { MaxHeightDiv } from "@sections/Dashboard/styled";
import UserProjectMainPanel from "@sections/Dashboard/userProjectMainPanel";
import Sidebar from "@sections/Dashboard/UserProjectSidepanel";
import { PaddedDiv } from "@sections/Header/styled";
import PageLayout from "@sections/Layout";
import { withAuthSync, withAuthVerification } from "@utils/auth";
import { company } from "@utils/config";
import { Col, Row, Spin } from "antd";
import { NextPageContext, NextPage } from "next";
import Head from "next/head";
import Router from "next/router";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import IndexPageMeta from "@utils/meta";

const GreyDiv = styled.div`
	background-color: ${({ theme }) => theme.colors.bg.light1};
`;
interface DashboardProps {
	isServer: boolean;
	authVerification: Partial<User>;
	projectId: string;
	designId: string;
}

const dashboard: NextPage<DashboardProps> = ({ isServer, authVerification, projectId, designId }): JSX.Element => {
	const [selectedUser, setSelectedUser] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const handleSelectCard = (user: string): void => {
		setSelectedUser(user);
		Router.push({ pathname: "/dashboard", query: { user } }, `/dashboard/pid/${user}`);
	};

	useEffect(() => {
		setSelectedUser(projectId);
	}, []);

	return (
		<PageLayout isServer={isServer} authVerification={authVerification}>
			<Head>
				<title>Dashboard | {company.product}</title>
				{IndexPageMeta}
			</Head>
			<GreyDiv>
				<Spin spinning={loading}>
					<Row type={"flex"} align="top">
						<Col sm={24} md={10} lg={7} xl={6}>
							<Sidebar selectedUser={selectedUser} handleSelectCard={handleSelectCard} />
						</Col>
						<Col sm={24} md={14} lg={17} xl={18}>
							<MaxHeightDiv>
								<PaddedDiv>
									<UserProjectMainPanel
										loading={loading}
										setLoading={setLoading}
										designId={designId}
										userProjectId={selectedUser}
									/>
								</PaddedDiv>
							</MaxHeightDiv>
						</Col>
					</Row>
				</Spin>
			</GreyDiv>
		</PageLayout>
	);
};

dashboard.getInitialProps = async (ctx: NextPageContext): Promise<DashboardProps> => {
	const {
		req,
		query: { pid, designId: did }
	} = ctx;
	const isServer = !!req;
	const designId: string = did as string;
	const projectId: string = pid as string;
	const authVerification = {
		name: "",
		email: ""
	};
	return { isServer, authVerification, projectId, designId };
};

export default withAuthVerification(dashboard);
