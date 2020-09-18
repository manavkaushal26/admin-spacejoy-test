import { getRevisionFormForProjectId } from "@api/projectApi";
import {
	DetailedProject,
	PhaseCustomerNames,
	PhaseInternalNames,
	RevisionForm,
	UserProjectType,
} from "@customTypes/dashboardTypes";
import BasicDetails from "@sections/Dashboard/userProjectMainPanel/BasicDetails";
import { getValueSafely } from "@utils/commonUtils";
import fetcher from "@utils/fetcher";
import { Col, notification, Row, Spin, Typography } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { VerticalPaddedDiv } from "../styled";
import { UserProjectSidePanelState } from "../UserProjectSidepanel/reducer";
import ActionView from "./ActionView";
import ProjectSummary from "./ProjectSummary";
import ProjectTabView from "./ProjectTabView";

const { Title } = Typography;

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
	setSearchFiltersChanged: React.Dispatch<React.SetStateAction<UserProjectSidePanelState>>;
}> = ({
	updateProjectPhaseInSidepanel,
	userProjectId,
	designId,
	dates,
	setDates,
	currentTab,
	setSearchFiltersChanged,
}): JSX.Element => {
	const [projectData, setProjectData] = useState<DetailedProject>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const Router = useRouter();
	const [revisionFormData, setRevisionFormData] = useState<RevisionForm>(null);

	const fetchAndPopulateProjectData = async (): Promise<void> => {
		setLoading(true);
		const response = await fetcher({ endPoint: `/admin/project/${userProjectId}`, method: "GET" });
		if (response.statusCode <= 300) {
			setProjectData(response.data);
		}
		setLoading(false);
	};

	const updateRevisionData = (modifiedRevisonData: RevisionForm): void => {
		setRevisionFormData({
			...modifiedRevisonData,
		});
	};

	const fetchAndPopulateRevisionForm = async (): Promise<void> => {
		const endPoint = getRevisionFormForProjectId(userProjectId);
		const response = await fetcher({ endPoint, method: "GET" });
		try {
			if (response.statusCode <= 300) {
				setRevisionFormData(response.data);
			}
		} catch (e) {
			notification.error({ message: "Failed to load revision form" });
		}
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
				fetchAndPopulateProjectData();
			}
		}
	}, [designId]);

	useEffect(() => {
		if (userProjectId) {
			fetchAndPopulateProjectData();
			fetchAndPopulateRevisionForm();
		}
		return (): void => {
			setProjectData(null);
		};
	}, [userProjectId]);

	const onTabChange = (activeKey, pid, did): void => {
		Router.push(
			{
				pathname: "/dashboard",
				query: { pid, designId: did, activeKey },
			},
			`/dashboard/pid/${projectData._id}/did/${did}?activeKey=${activeKey}`,
			{ shallow: true }
		);
	};

	return (
		<Spin spinning={loading}>
			<Row gutter={[8, 8]}>
				{projectData ? (
					<>
						<Col span={24}>
							<ProjectSummary projectData={projectData} setProjectData={setProjectData} />
						</Col>
						<Col span={24}>
							<BasicDetails projectData={projectData} />
						</Col>
						<Col span={24}>
							<ProjectTabView
								updateRevisionData={updateRevisionData}
								onTabChangeCallback={onTabChange}
								currentTab={currentTab}
								refetchData={fetchAndPopulateProjectData}
								setLoading={setLoading}
								projectData={projectData}
								onSelectDesign={onSelectDesign}
								designId={designId}
								setProjectData={setProjectData}
								revisionFormData={revisionFormData}
							/>
						</Col>
					</>
				) : (
					<Col span={24}>
						<VerticalPaddedDiv>
							<ActionView setSearchFiltersChanged={setSearchFiltersChanged} />
						</VerticalPaddedDiv>
					</Col>
				)}
			</Row>
		</Spin>
	);
};

export default userProjectMainPanel;
