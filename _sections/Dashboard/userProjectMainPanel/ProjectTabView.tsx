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
import CustomerResponses from "./CustomerResponses";
import DesignSelection from "./DesignSelection";
import NotesTab from "./NotesTab";
import TeamTab from "./TeamTab";
import CustomerView from "./CustomerView";

const { TabPane } = Tabs;

interface ProjectTabViewProps {
	projectData?: DetailedProject;
	designId: string;
	onSelectDesign?: (designId?: string) => void;
	setLoading: React.Dispatch<React.SetStateAction<boolean>>;
	refetchData?: () => void;
	setProjectData?: React.Dispatch<React.SetStateAction<DetailedProject>>;
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
	const formData = getValueSafely(() => projectData.form, null);
	const id = getValueSafely(() => projectData._id, null);
	const [designData, setDesignData] = useState<DetailedDesign>(null);
	const [designLoading, setDesignLoading] = useState<boolean>(false);

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

	const publishButtonDisabled = getValueSafely(
		() =>
			getHumanizedActivePhase(designData.phases) !== HumanizeDesignPhases.ready || designData.status === Status.active,
		true
	);

	const publishButtonText = getValueSafely(() => {
		return designData.status === Status.active ? "Published" : "Publish";
	}, "Publish");

	const onPublish = async (): Promise<void> => {
		const endPoint = publishDesignApi(designData._id);
		setDesignLoading(true);
		const response = await fetcher({ endPoint, method: "POST" });

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

					<ScrollableTabs defaultActiveKey="6">
						{formData && (
							<TabPane tab="Customer Responses" key="1">
								<CustomerResponses formData={formData || []} />
							</TabPane>
						)}
						<TabPane tab="Team" key="5">
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
						<TabPane tab="Moodboard" key="3">
							<MoodboardTab setDesignData={setDesignData} setLoading={setLoading} projectId={id} designId={designId} />
						</TabPane>
						<TabPane tab="Discussion" key="2">
							<NotesTab designData={designData} />
						</TabPane>
						<TabPane tab="Pipeline" key="6">
							<PipelineTab setProjectPhase={setProjectPhase} designData={designData} setDesignData={setDesignData} />
						</TabPane>
						{projectData && (
							<TabPane tab="Customer View" key="7">
								<CustomerView projectName={projectData.name} designData={designData} />
							</TabPane>
						)}
					</ScrollableTabs>
				</>
			) : (
				<Spin style={{ padding: "2rem 2rem", width: "100%" }} spinning={designLoading}>
					{!!projectData && (
						<DesignSelection
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
