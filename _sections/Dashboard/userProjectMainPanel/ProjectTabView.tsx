import { designApi } from "@api/designApi";
import { DetailedDesign, DetailedProject, PhaseInternalNames, PhaseCustomerNames } from "@customTypes/dashboardTypes";
import MoodboardTab from "@sections/Dashboard/userProjectMainPanel/moodboardTab";
import PipelineTab from "@sections/Dashboard/userProjectMainPanel/pipelineTab";
import fetcher from "@utils/fetcher";
import { PageHeader, Spin, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { SilentDivider } from "../styled";
import CustomerResponses from "./CustomerResponses";
import DesignSelection from "./DesignSelection";
import NotesTab from "./NotesTab";
import TeamTab from "./TeamTab";
import CustomerView from "./CustomerView";

const { TabPane } = Tabs;

interface ProjectTabViewProps {
	projectData: DetailedProject;
	designId: string;
	onSelectDesign: (designId?: string) => void;
	setLoading: React.Dispatch<React.SetStateAction<boolean>>;
	refetchData: () => void;
	setProjectData: React.Dispatch<React.SetStateAction<DetailedProject>>;
}

const ScrollableTabs = styled(Tabs)`
	.ant-tabs-content {
		div[role="presentation"] + div {
			overflow-y: scroll;
		}
	}
`;

const SilentPageHeader = styled(PageHeader)`
	padding: 10px 0;
`;

const ProjectTabView: React.FC<ProjectTabViewProps> = ({
	projectData,
	designId,
	onSelectDesign,
	setLoading,
	refetchData,
	setProjectData,
}): JSX.Element => {
	const { form: formData } = projectData;
	const [designData, setDesignData] = useState<DetailedDesign>(null);
	const [designLoading, setDesignLoading] = useState<boolean>(false);

	const setProjectPhase = (projectPhase: {
		internalName: PhaseInternalNames;
		customerName: PhaseCustomerNames;
	}): void => {
		setProjectData({
			...projectData,
			currentPhase: {
				name: projectPhase,
			},
		});
	};

	const fetchDesignData = async (): Promise<void> => {
		setDesignLoading(true);
		const endPoint = designApi(designId);
		const responseData = await fetcher({ endPoint, method: "GET" });
		if (responseData.statusCode <= 300) {
			setDesignData(responseData.data);
		}
		setDesignLoading(false);
	};

	useEffect(() => {
		if (designId) {
			fetchDesignData();
			return (): void => {};
		}
		setDesignData(null);
		return (): void => {
			setDesignData(null);
			setDesignLoading(false);
		};
	}, [designId]);
	return (
		<>
			{designData !== null ? (
				<>
					<SilentPageHeader title={designData.name} onBack={(): void => onSelectDesign()} />
					<SilentDivider />

					<ScrollableTabs defaultActiveKey="6">
						<TabPane tab="Customer Responses" key="1">
							<CustomerResponses formData={formData || []} />
						</TabPane>
						<TabPane tab="Team" key="5">
							<TeamTab
								projectData={projectData}
								setProjectData={setProjectData}
								setLoading={setLoading}
								projectId={projectData._id}
								assignedTeam={projectData.team.map(memberData => {
									return memberData.member;
								})}
							/>
						</TabPane>
						<TabPane tab="Moodboard" key="3">
							<MoodboardTab
								setDesignData={setDesignData}
								setLoading={setLoading}
								projectId={projectData._id}
								designId={designId}
							/>
						</TabPane>
						<TabPane tab="Discussion" key="2">
							<NotesTab designData={designData} />
						</TabPane>
						<TabPane tab="Pipeline" key="6">
							<PipelineTab setProjectPhase={setProjectPhase} designData={designData} setDesignData={setDesignData} />
						</TabPane>
						<TabPane tab="Customer View" key="7">
							<CustomerView projectName={projectData.name} designData={designData} />
						</TabPane>
					</ScrollableTabs>
				</>
			) : (
				<Spin spinning={designLoading}>
					<DesignSelection
						refetchData={refetchData}
						setProjectData={setProjectData}
						projectData={projectData}
						onSelectDesign={onSelectDesign}
					/>
				</Spin>
			)}
		</>
	);
};

export default ProjectTabView;
