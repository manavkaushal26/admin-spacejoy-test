import { PhaseCustomerNames, PhaseInternalNames, UserProjectType } from "@customTypes/dashboardTypes";
import User from "@customTypes/userType";
import { MaxHeightDiv } from "@sections/Dashboard/styled";
import UserProjectMainPanel from "@sections/Dashboard/userProjectMainPanel";
import Sidebar from "@sections/Dashboard/UserProjectSidepanel";
import { PaddedDiv } from "@sections/Header/styled";
import PageLayout from "@sections/Layout";
import { withAuthVerification } from "@utils/auth";
import { debounce } from "@utils/commonUtils";
import { company } from "@utils/config";
import IndexPageMeta from "@utils/meta";
import { Layout, Spin } from "antd";
import { NextPage, NextPageContext } from "next";
import Head from "next/head";
import Router from "next/router";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

const GreyDiv = styled.div`
	background-color: ${({ theme }) => theme.colors.bg.light1};
`;
interface DashboardProps {
	isServer: boolean;
	authVerification: Partial<User>;
	projectId: string;
	designId: string;
	currentTab: string;
}

const handleResize = (setIsDesktop): void => {
	if (typeof window !== "undefined") {
		if (window.innerWidth < 1024) {
			setIsDesktop(false);
		} else {
			setIsDesktop(true);
		}
	}
};

const debouncedHandleResize = debounce(handleResize, 100);

const dashboard: NextPage<DashboardProps> = ({
	isServer,
	authVerification,
	projectId,
	designId,
	currentTab,
}): JSX.Element => {
	const [selectedUser, setSelectedUser] = useState<string>("");
	const [loading] = useState<boolean>(false);
	const [dates, setDates] = useState<Partial<UserProjectType>>(null);

	const [collapsed, setCollapsed] = useState<boolean>(false);

	const [isDesktop, setIsDesktop] = useState<boolean>(true);

	const onResize = (): void => debouncedHandleResize(setIsDesktop);

	useEffect(() => {
		if (!authVerification.name) {
			Router.push("/auth", "/auth/login");
		}
	}, [authVerification]);

	useEffect(() => {
		if (typeof window !== "undefined") {
			if (window.innerWidth < 1024) {
				setIsDesktop(false);
			} else {
				setIsDesktop(true);
			}
		}
	});

	useEffect(() => {
		window.addEventListener("resize", onResize);
		return (): void => {
			window.removeEventListener("resize", onResize);
		};
	});

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
	}, [projectId]);

	useEffect(() => {
		if (projectId && !isDesktop) {
			setCollapsed(true);
		} else {
			setCollapsed(false);
		}
	}, [projectId, isDesktop]);

	/**
	 * Function to cause main panel to update start date and hece the progress bar when the start button
	 * is clicked on the sidebar and the project is open in mainpanel
	 * @param pid ProjectID
	 * @param startDate Time when the start button is clicked in the sidepanel
	 */
	const updateStartDateInMainPanel = (pid, data: Partial<UserProjectType>): void => {
		if (pid === projectId) {
			setDates({
				startedAt: data.startedAt,
				endedAt: data.endedAt,
			});
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
		<PageLayout pageName="Dashboard" isServer={isServer} authVerification={authVerification}>
			<Head>
				<title>Dashboard | {company.product}</title>
				{IndexPageMeta}
			</Head>
			<GreyDiv>
				<Spin spinning={loading}>
					<Layout hasSider>
						<Layout.Sider
							collapsed={collapsed}
							onCollapse={(collapsedState): void => {
								setCollapsed(collapsedState && !!projectId);
							}}
							zeroWidthTriggerStyle={{ top: "1.8rem", borderRadius: "0 2px 2px 0" }}
							breakpoint="lg"
							width="360"
							theme="dark"
							collapsible
							collapsedWidth={0}
						>
							<Sidebar
								collapsed={collapsed}
								setCollapsed={setCollapsed}
								updateStartDateInMainPanel={updateStartDateInMainPanel}
								selectedUser={selectedUser}
								handleSelectCard={handleSelectCard}
								projectPhaseUpdateValue={projectPhaseUpdateValue}
								setProjectPhaseUpdateValue={setProjectPhaseUpdateValue}
							/>
						</Layout.Sider>
						<Layout>
							<MaxHeightDiv>
								<PaddedDiv>
									<UserProjectMainPanel
										updateProjectPhaseInSidepanel={updateProjectPhaseInSidepanel}
										designId={designId}
										userProjectId={selectedUser}
										dates={dates}
										setDates={setDates}
										currentTab={currentTab}
									/>
								</PaddedDiv>
							</MaxHeightDiv>
						</Layout>
					</Layout>
				</Spin>
			</GreyDiv>
		</PageLayout>
	);
};

dashboard.getInitialProps = async (ctx: NextPageContext): Promise<DashboardProps> => {
	const {
		req,
		query: { pid, designId: did, activeKey },
	} = ctx;
	const isServer = !!req;
	const designId: string = did as string;
	const projectId: string = pid as string;
	const currentTab: string = activeKey as string;
	const authVerification = {
		name: "",
		email: "",
	};
	return { isServer, authVerification, projectId, designId, currentTab };
};

export default withAuthVerification(dashboard);
