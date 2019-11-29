import PageLayout from "@sections/Layout";
import { Row, Col } from "antd";
import { withAuthSync, withAuthVerification } from "@utils/auth";
import { company } from "@utils/config";
import Head from "next/head";
import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import User from "@customTypes/userType";
import { PaddedDiv } from "@sections/Header/styled";
import Sidebar from "@sections/Dashboard/userProjectSidepanel";
import { UserProjectType } from "@customTypes/dashboardTypes";
import UserProjectMainPanel from "@sections/Dashboard/userProjectMainPanel";
import fetcher from "@utils/fetcher";
import { ExtendedJSXFC } from "@customTypes/extendedReactComponentTypes";
import Router from "next/router";
import { NextPageContext } from "next";
import { MaxHeightDiv } from "@sections/Dashboard/styled";
import styled from "styled-components";

const GreyDiv = styled.div`
	background-color: ${({theme})=>theme.colors.bg.light1};
`;
interface DashboardProps {
	isServer: boolean;
	authVerification: Partial<User>;
	projectId: string;
}

const dashboard: ExtendedJSXFC<DashboardProps> = ({ isServer, authVerification, projectId = "" }): JSX.Element => {
	const [selectedUser, setSelectedUser] = useState<string>("");
	const handleSelectCard = (user: string): void => {
		setSelectedUser(user);
		Router.push({ pathname: "/dashboard", query: { user } }, `/dashboard/${user}`, { shallow: true });
	};

	useEffect(() => {
		setSelectedUser(projectId);
	}, []);

	return (
		<PageLayout isServer={isServer} authVerification={authVerification}>
			<Head>
				<title>Dashboard | {company.product}</title>
			</Head>
			<GreyDiv>
				<Row type={"flex"} align="top">
					<Col sm={24} md={10} lg={7} xl={6}>
						<Sidebar selectedUser={selectedUser} handleSelectCard={handleSelectCard} />
					</Col>
					<Col sm={24} md={14} lg={17} xl={18}>
						<MaxHeightDiv>
							<PaddedDiv>
								<UserProjectMainPanel userProjectId={selectedUser} />
							</PaddedDiv>
						</MaxHeightDiv>
					</Col>
				</Row>
			</GreyDiv>
		</PageLayout>
	);
};

dashboard.getInitialProps = async (ctx: NextPageContext): Promise<DashboardProps> => {
	const {
		req,
		query: { pid }
	} = ctx;
	const isServer = !!req;
	const projectId: string = pid as string;
	const authVerification = {
		name: "",
		email: ""
	};
	return { isServer, authVerification, projectId };
};

export default withAuthVerification(withAuthSync(dashboard));
