import { DetailedProject, PhaseCustomerNames, PhaseInternalNames, UserProjectType } from "@customTypes/dashboardTypes";
import BasicDetails from "@sections/Dashboard/userProjectMainPanel/BasicDetails";
import { getValueSafely } from "@utils/commonUtils";
import fetcher from "@utils/fetcher";
import { Divider, Empty, Row, Spin, Typography } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { MaxHeightDiv, VerticalPaddedDiv } from "../styled";
import ProjectSummary from "./ProjectSummary";
import ProjectTabView from "./ProjectTabView";

const { Text } = Typography;

const userProjectMainPanel: React.FC<{
	updateProjectPhaseInSidepanel: (
		id: string,
		phase: {
			internalName: PhaseInternalNames;
			customerName: PhaseCustomerNames;
		}
	) => void;
	currentTab: string;
	userProjectId: string;
	designId: string;
	dates: Partial<UserProjectType>;
	setDates: React.Dispatch<React.SetStateAction<Partial<DetailedProject>>>;
}> = ({ updateProjectPhaseInSidepanel, userProjectId, designId, dates, setDates, currentTab }): JSX.Element => {
	const [projectData, setProjectData] = useState<DetailedProject>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const Router = useRouter();

	const fetchAndPopulate = async (): Promise<void> => {
		setLoading(true);
		const response = await fetcher({ endPoint: `/admin/project/${userProjectId}`, method: "GET" });
		if (response.statusCode <= 300) {
			setProjectData(response.data);
		}
		setLoading(false);
	};

	useEffect(() => {
		if (projectData) {
			updateProjectPhaseInSidepanel(userProjectId, projectData.currentPhase.name);
		}
	}, [
		getValueSafely(() => projectData.currentPhase.name, {
			internalName: PhaseInternalNames.requirement,
			customerName: PhaseCustomerNames.brief,
		}),
	]);

	useEffect(() => {
		if (dates) {
			setProjectData({
				...projectData,
				endedAt: dates.endedAt,
				startedAt: dates.startedAt,
			});
			setDates(null);
		}
	}, [dates]);

	const onSelectDesign = (selectedDesignId?: string): void => {
		if (selectedDesignId) {
			Router.push(
				{
					pathname: "/dashboard",
					query: { pid: userProjectId, designId: selectedDesignId },
				},
				`/dashboard/pid/${userProjectId}/did/${selectedDesignId}`
			);
			return;
		}
		Router.push({ pathname: "/dashboard", query: { pid: userProjectId } }, `/dashboard/pid/${userProjectId}`);
	};

	useEffect(() => {
		if (!designId) {
			if (userProjectId) {
				fetchAndPopulate();
			}
		}
	}, [designId]);

	useEffect(() => {
		if (userProjectId) {
			fetchAndPopulate();
		}
		return (): void => {
			setProjectData(null);
		};
	}, [userProjectId]);

	const onTabChange = (activeKey, pid, did): void => {
		Router.push(
			{
				pathname: `/dashboard`,
				query: { pid, designId: did, activeKey },
			},
			`/dashboard/pid/${projectData._id}/did/${did}?activeKey=${activeKey}`,
			{ shallow: true }
		);
	};

	return (
		<Spin spinning={loading}>
			<Row>
				{projectData ? (
					<>
						<ProjectSummary projectData={projectData} setProjectData={setProjectData} />
						<Divider /> <BasicDetails projectData={projectData} />
						<Divider />
						<ProjectTabView
							onTabChangeCallback={onTabChange}
							currentTab={currentTab}
							refetchData={fetchAndPopulate}
							setLoading={setLoading}
							projectData={projectData}
							onSelectDesign={onSelectDesign}
							designId={designId}
							setProjectData={setProjectData}
						/>
					</>
				) : (
					<MaxHeightDiv>
						<VerticalPaddedDiv>
							<Row type="flex" justify="center">
								<Empty description={<Text>Select a Project to work on!</Text>} />
							</Row>
						</VerticalPaddedDiv>
					</MaxHeightDiv>
				)}
			</Row>
		</Spin>
	);
};

export default userProjectMainPanel;
