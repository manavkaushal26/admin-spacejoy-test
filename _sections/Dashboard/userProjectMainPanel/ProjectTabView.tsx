import { designApi, publishDesignApi } from "@api/designApi";
import {
	DetailedDesign,
	DetailedProject,
	PhaseInternalNames,
	PhaseCustomerNames,
	HumanizeDesignPhases,
} from "@customTypes/dashboardTypes";
import MoodboardTab from "@sections/Dashboard/userProjectMainPanel/moodboardTab";
import PipelineTab from "@sections/Dashboard/userProjectMainPanel/pipelineTab";
import fetcher from "@utils/fetcher";
import { PageHeader, Spin, Tabs, Button, notification } from "antd";
import React, { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import { getValueSafely, getHumanizedActivePhase } from "@utils/commonUtils";
import { CapitalizedText } from "@components/CommonStyledComponents";
import { Status } from "@customTypes/userType";
import { SilentDivider } from "../styled";
import NotesTab from "./NotesTab";
import TeamTab from "./TeamTab";
import CustomerView from "./CustomerView";
import ProjectDesignInteractionPanel from "./ProjectDesignInteractionPanel";

const { TabPane } = Tabs;

interface ProjectTabViewProps {
	projectData?: DetailedProject;
	designId: string;
	onSelectDesign?: (designId?: string) => void;
	setLoading: React.Dispatch<React.SetStateAction<boolean>>;
	refetchData?: () => void;
	currentTab: string;
	setProjectData?: React.Dispatch<React.SetStateAction<DetailedProject>>;
	onTabChangeCallback?: (activeKey: string, pid: string, designId: string) => void;
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
	onTabChangeCallback,
	setProjectData,
	currentTab,
}): JSX.Element => {
	const id = getValueSafely(() => projectData._id, null);
	const [designData, setDesignData] = useState<DetailedDesign>(null);
	const [designLoading, setDesignLoading] = useState<boolean>(false);

	const [activeTab, setActiveTab] = useState<string>("pipeline");

	const setProjectPhase = (projectPhase: {
		internalName: PhaseInternalNames;
		customerName: PhaseCustomerNames;
	}): void => {
		if (projectData) {
			setProjectData({
				...projectData,
				currentPhase: {
					...projectData.currentPhase,
					name: projectPhase,
				},
			});
		}
	};

	const assignedTeam = useMemo(
		() =>
			getValueSafely(() => {
				if (projectData) {
					return projectData.team;
				}
				return designData.team;
			}, []),
		[projectData, designData]
	);

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
		if (currentTab) {
			setActiveTab(currentTab);
		}
	}, [currentTab]);

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

	const publishButtonDisabled = getValueSafely(() => {
		return (
			getHumanizedActivePhase(designData.phases) !== HumanizeDesignPhases.ready || designData.status === Status.active
		);
	}, true);

	const publishButtonText = getValueSafely(() => {
		return designData.status === Status.active ? "Published" : "Publish";
	}, "Publish");

	const onPublish = async (): Promise<void> => {
		const endPoint = publishDesignApi(designData._id);
		setDesignLoading(true);
		const response = await fetcher({ endPoint, method: "PUT" });

		if (response.statusCode <= 300) {
			setDesignData({
				...designData,
				status: response.data.status,
			});
			notification.success({
				message: "Design successfully published",
			});
		} else {
			notification.error({
				message: "Failed to Publish Design",
			});
		}
		setDesignLoading(false);
	};

	const onTabChange = (activeKey): void => {
		setActiveTab(activeKey);
		const projectId = getValueSafely(() => projectData._id, null);
		if (onTabChangeCallback) {
			onTabChangeCallback(activeKey, projectId, designId);
		}
	};

	return (
		<>
			{designData !== null ? (
				<>
					<SilentPageHeader
						title={designData.name}
						subTitle={<CapitalizedText>{getValueSafely<string>(() => designData.room.roomType, "")}</CapitalizedText>}
						{...(projectData
							? null
							: {
									extra: [
										<Button key="publish" onClick={onPublish} type="primary" disabled={publishButtonDisabled}>
											{publishButtonText}
										</Button>,
									],
							  })}
						onBack={(): void => onSelectDesign()}
					/>
					<SilentDivider />

					<ScrollableTabs activeKey={activeTab} onChange={onTabChange} defaultActiveKey="pipeline">
						<TabPane tab="Team" key="team">
							<TeamTab
								designData={designData}
								projectData={projectData}
								setProjectData={setProjectData}
								setDesignData={setDesignData}
								setLoading={setLoading}
								projectId={id}
								assignedTeam={assignedTeam.map(memberData => {
									return memberData.member;
								})}
							/>
						</TabPane>
						<TabPane tab="Moodboard" key="moodboard">
							<MoodboardTab setDesignData={setDesignData} setLoading={setLoading} projectId={id} designId={designId} />
						</TabPane>
						<TabPane tab="Discussion" key="discussion">
							<NotesTab designData={designData} />
						</TabPane>
						<TabPane tab="Pipeline" key="pipeline">
							<PipelineTab
								setProjectPhase={setProjectPhase}
								designData={designData}
								projectId={id}
								setDesignData={setDesignData}
							/>
						</TabPane>
						{projectData && (
							<TabPane tab="Customer View" key="cust_view">
								<CustomerView projectName={projectData.name} designData={designData} />
							</TabPane>
						)}
					</ScrollableTabs>
				</>
			) : (
				<Spin style={{ padding: "2rem 2rem", width: "100%" }} spinning={designLoading}>
					{!!projectData && (
						<ProjectDesignInteractionPanel
							refetchData={refetchData}
							setProjectData={setProjectData}
							projectData={projectData}
							onSelectDesign={onSelectDesign}
						/>
					)}
				</Spin>
			)}
		</>
	);
};

export default ProjectTabView;
