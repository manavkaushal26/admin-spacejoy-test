import User from "@customTypes/userType";
import { MaxHeightDiv } from "@sections/Dashboard/styled";
import UserProjectMainPanel from "@sections/Dashboard/userProjectMainPanel";
import Sidebar from "@sections/Dashboard/UserProjectSidepanel";
import { PaddedDiv } from "@sections/Header/styled";
import PageLayout from "@sections/Layout";
import { withAuthVerification } from "@utils/auth";
import { company } from "@utils/config";
import IndexPageMeta from "@utils/meta";
import { Col, Row, Spin } from "antd";
import { NextPage, NextPageContext } from "next";
import Head from "next/head";
import Router from "next/router";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { PhaseInternalNames, PhaseCustomerNames } from "@customTypes/dashboardTypes";

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
	const [loading] = useState<boolean>(false);
	const [startDate, setStartDate] = useState<string>(null);
	const handleSelectCard = (user: string): void => {
		setSelectedUser(user);
		Router.push({ pathname: "/dashboard", query: { pid: user } }, `/dashboard/pid/${user}`);
	};

	const [projectPhaseUpdateValue, setProjectPhaseUpdateValue] = useState<{
		pid: string;
		projectPhase: {
			internalName: PhaseInternalNames;
			customerName: PhaseCustomerNames;
		};
	}>(null);

	useEffect(() => {
		if (projectId) {
			setSelectedUser(projectId);
		}
	}, []);

	/**
	 * Function to cause main panel to update start date and hece the progress bar when the start button
	 * is clicked on the sidebar and the project is open in mainpanel
	 * @param pid ProjectID
	 * @param startDate Time when the start button is clicked in the sidepanel
	 */
	const updateStartDateInMainPanel = (pid, date): void => {
		if (pid === projectId) {
			setStartDate(date);
		}
	};

	const updateProjectPhaseInSidepanel = (
		id,
		phase: {
			internalName: PhaseInternalNames;
			customerName: PhaseCustomerNames;
		}
	): void => {
		setProjectPhaseUpdateValue({
			pid: id,
			projectPhase: phase,
		});
	};

	return (
		<PageLayout isServer={isServer} authVerification={authVerification}>
			<Head>
				<title>Dashboard | {company.product}</title>
				{IndexPageMeta}
			</Head>
			<GreyDiv>
				<Spin spinning={loading}>
					<Row type="flex" align="top">
						<Col sm={24} md={10} lg={7} xl={6}>
							<Sidebar
								updateStartDateInMainPanel={updateStartDateInMainPanel}
								selectedUser={selectedUser}
								handleSelectCard={handleSelectCard}
								projectPhaseUpdateValue={projectPhaseUpdateValue}
								setProjectPhaseUpdateValue={setProjectPhaseUpdateValue}
							/>
						</Col>
						<Col sm={24} md={14} lg={17} xl={18}>
							<MaxHeightDiv>
								<PaddedDiv>
									<UserProjectMainPanel
										updateProjectPhaseInSidepanel={updateProjectPhaseInSidepanel}
										designId={designId}
										userProjectId={selectedUser}
										startDate={startDate}
										setStartDate={setStartDate}
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
		query: { pid, designId: did },
	} = ctx;
	const isServer = !!req;
	const designId: string = did as string;
	const projectId: string = pid as string;
	const authVerification = {
		name: "",
		email: "",
	};
	return { isServer, authVerification, projectId, designId };
};

export default withAuthVerification(dashboard);
