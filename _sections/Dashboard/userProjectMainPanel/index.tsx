import { DetailedProject, PhaseInternalNames, PhaseCustomerNames } from "@customTypes/dashboardTypes";
import BasicDetails from "@sections/Dashboard/userProjectMainPanel/BasicDetails";
import fetcher from "@utils/fetcher";
import { Empty, Spin, Typography } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { getValueSafely } from "@utils/commonUtils";
import { CustomDiv, MaxHeightDiv, SilentDivider } from "../styled";
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
	userProjectId: string;
	designId: string;
	startDate: string;
	setStartDate: React.Dispatch<React.SetStateAction<string>>;
}> = ({ updateProjectPhaseInSidepanel, userProjectId, designId, startDate, setStartDate }): JSX.Element => {
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
		if (startDate) {
			setProjectData({
				...projectData,
				startedAt: startDate,
			});
			setStartDate(null);
		}
	}, [startDate]);

	const onSelectDesign = (selectedDesignId?: string): void => {
		if (selectedDesignId) {
			Router.push(
				{ pathname: "/dashboard", query: { user: userProjectId, designId: selectedDesignId } },
				`/dashboard/pid/${userProjectId}/did/${selectedDesignId}`
			);
			return;
		}
		Router.push({ pathname: "/dashboard", query: { user: userProjectId } }, `/dashboard/pid/${userProjectId}`);
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

	return (
		<Spin spinning={loading}>
			<CustomDiv width="100%" height="100%">
				{projectData ? (
					<>
						<ProjectSummary projectData={projectData} />
						<SilentDivider />
						<BasicDetails projectData={projectData} />
						<ProjectTabView
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
						<CustomDiv width="100%" height="100%" type="flex" justifyContent="space-around" align="center">
							<Empty description={<Text>Select a Project to work on!</Text>} />
						</CustomDiv>
					</MaxHeightDiv>
				)}
			</CustomDiv>
		</Spin>
	);
};

export default userProjectMainPanel;
