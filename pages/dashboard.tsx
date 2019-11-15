import PageLayout from "@sections/Layout";
import { Row, Col, Card, Avatar, Tag, Typography, Tabs, Input } from "antd";
import { withAuthSync, withAuthVerification } from "@utils/auth";
import { company } from "@utils/config";
import Head from "next/head";
import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import User from "@customTypes/userType";
import { PaddedDiv } from "@sections/Header/styled";
import Sidebar from "@sections/Dashboard/userProjectSidepanel";
import { UserProjects } from "@mocks/userProjectMocks";
import { UserProjectType } from "@customTypes/dashboardTypes";
import UserProjectMainPanel from "@sections/Dashboard/userProjectMainPanel";
import fetcher from "@utils/fetcher";
import { ExtendedJSXFC } from '@customTypes/extendedReactComponentTypes';
import { NextPageContext } from "next";

interface DashboardProps {
	isServer: boolean;
	authVerification: Partial<User>;
}

const dashboard: ExtendedJSXFC<DashboardProps> = ({ isServer, authVerification }): JSX.Element => {
	const [selectedUser, setSelectedUser] = useState<string | null>('');
	const [userProjectData, setUserProjectData] = useState<UserProjectType[]>([]);
	const handleSelectCard = (user:string):void => {
		setSelectedUser(user);
	};

	useEffect(()=> {
		const endPoint = `/projects?skip=0&limit=10`;
		fetcher({ endPoint, method: "GET" }).then((data=> {
			if (data.status === "success") {
				const {
					data: { data: userProjectData }
				} = data;
				setUserProjectData(userProjectData);
			}
		}));
	},[]);

	return (
		<PageLayout isServer={isServer} authVerification={authVerification}>
			<Head>
				<title>Dashboard | {company.product}</title>
			</Head>
			<PaddedDiv>
				<Row type={"flex"} align="top">
					<Col sm={24} md={10} lg={7} xl={6}>
							<Sidebar isServer={isServer} handleSelectCard={handleSelectCard} userProjectData={userProjectData}/>
					</Col>
					<Col sm={24} md={14} lg={17} xl={18}>
						<PaddedDiv>
							{selectedUser!=='' && <UserProjectMainPanel userProjectData={selectedUser}/>}
							Hello World
						</PaddedDiv>
					</Col>
				</Row>
			</PaddedDiv>
		</PageLayout>
	);
};

dashboard.propTypes = {
	isServer: PropTypes.bool.isRequired,
	authVerification: PropTypes.shape({
		name: PropTypes.string,
		email: PropTypes.string
	})
};

export default withAuthVerification(withAuthSync(dashboard));
