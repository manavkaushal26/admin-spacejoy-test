import { designApi, editDesignApi, publishDesignApi } from "@api/designApi";
import { CapitalizedText } from "@components/CommonStyledComponents";
import EditDesignModal from "@components/EditDesignModal";
import {
	DetailedDesign,
	DetailedProject,
	HumanizeDesignPhases,
	PhaseCustomerNames,
	PhaseInternalNames,
	RevisionForm,
} from "@customTypes/dashboardTypes";
import { Status } from "@customTypes/userType";
import ChatPanel from "@sections/AdminChatInterface";
import { DisabledLabel } from "@sections/Dashboard/styled";
import MoodboardTab from "@sections/Dashboard/userProjectMainPanel/moodboardTab";
import PipelineTab from "@sections/Dashboard/userProjectMainPanel/pipelineTab";
import { getHumanizedActivePhase, getValueSafely } from "@utils/commonUtils";
import fetcher from "@utils/fetcher";
import { Button, Col, notification, PageHeader, Popconfirm, Row, Spin, Tabs } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { SilentDivider } from "../styled";
import CustomerView from "./CustomerView";
import DesignDetails from "./DesignDetails";
import NotesTab from "./NotesTab";
import ProjectDesignInteractionPanel from "./ProjectDesignInteractionPanel";
import CustomerFeedbackTab from "./ProjectDesignInteractionPanel/CustomerFeedbackTab";
import TeamTab from "./TeamTab";
const { TabPane } = Tabs;

interface ProjectTabViewProps {
	projectData?: DetailedProject;
	designId: string;
	onSelectDesign?: (designId?: string) => void;
	setLoading: React.Dispatch<React.SetStateAction<boolean>>;
	refetchData?: () => void;
	currentTab: string;
	revisionFormData?: RevisionForm;
	setProjectData?: React.Dispatch<React.SetStateAction<DetailedProject>>;
	onTabChangeCallback?: (activeKey: string, pid: string, designId: string) => void;
	updateRevisionData?: (revisionData: RevisionForm) => void;
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
	updateRevisionData,
	revisionFormData,
}): JSX.Element => {
	const id = getValueSafely(() => projectData._id, null);
	const [designData, setDesignData] = useState<DetailedDesign>(null);
	const [designLoading, setDesignLoading] = useState<boolean>(false);
	const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
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

	const onPublish = async (status?: Status): Promise<void> => {
		const endPoint = publishDesignApi(designData._id, status);
		setDesignLoading(true);
		const response = await fetcher({
			endPoint,
			method: "PUT",
			body: {
				status,
			},
		});

		if (response.statusCode <= 300) {
			setDesignData(prevState => {
				return { ...prevState, status: response.data.status };
			});
			if (status === Status.active) {
				notification.success({
					message: "Design successfully published",
				});
			} else {
				notification.success({
					message: "Design successfully unpublished",
				});
			}
			setEditModalVisible(false);
		} else {
			notification.error({
				message: "Failed to Publish Design",
			});
		}
		setDesignLoading(false);
	};

	const toggleEditDesignModal = async (): Promise<void> => {
		if (activeTab === "design_details") {
			setDesignLoading(true);
			await onPublish(Status.active);
			setDesignLoading(false);
		} else {
			setEditModalVisible(prevValue => !prevValue);
		}
	};

	const onTabChange = (activeKey): void => {
		setActiveTab(activeKey);
		const projectId = getValueSafely(() => projectData._id, null);
		if (onTabChangeCallback) {
			onTabChangeCallback(activeKey, projectId, designId);
		}
	};

	const onClickOk = useCallback(
		async (dataToUpdate: Partial<DetailedDesign>): Promise<void> => {
			setDesignLoading(true);
			const endPoint = editDesignApi(designData._id);
			const response = await fetcher({ endPoint, method: "PUT", body: { data: dataToUpdate } });
			if (response.statusCode <= 300) {
				setDesignData(response.data);
				notification.success({ message: "Updated Design Successfully" });
				await onPublish(Status.active);
			} else {
				notification.error({ message: response.message });
				setDesignLoading(false);
			}
		},
		[designData]
	);

	const feedback = getValueSafely(
		() =>
			projectData.feedback.filter(designFeedback => {
				if (designData) return designFeedback.reference === designData._id;
				return false;
			}),
		[]
	);
	const { pause = false } = projectData;
	return (
		<>
			{designData !== null ? (
				<Row>
					<Col span={24}>
						<SilentPageHeader
							title={designData.name}
							subTitle={
								<CapitalizedText>
									{getValueSafely<string>(() => designData.searchKey.roomType || designData.room.roomType, "")}
								</CapitalizedText>
							}
							{...(projectData
								? null
								: {
										extra: [
											publishButtonText !== "Published" ? (
												<Button
													key='publish'
													onClick={toggleEditDesignModal}
													type='primary'
													disabled={publishButtonDisabled}
												>
													{publishButtonText}
												</Button>
											) : (
												<Popconfirm
													title='Are you sure?'
													key='popConfirm'
													onConfirm={(): Promise<void> => onPublish(Status.pending)}
												>
													<Button key='unPublish' danger type='primary'>
														Unpublish
													</Button>
												</Popconfirm>
											),
										],
								  })}
							onBack={(): void => onSelectDesign()}
						/>
					</Col>
					<Col span={24}>
						<SilentDivider />
					</Col>
					<Col span={24}>
						{pause ? <DisabledLabel>This project is currently paused</DisabledLabel> : null}
						<ScrollableTabs activeKey={activeTab} onChange={onTabChange} defaultActiveKey='pipeline'>
							{!projectData && (
								<TabPane tab='Team' key='team'>
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
							)}
							<TabPane tab='Moodboard' key='moodboard'>
								<MoodboardTab
									setDesignData={setDesignData}
									setLoading={setLoading}
									projectId={id}
									designId={designId}
								/>
							</TabPane>
							<TabPane tab='Discussion' key='discussion'>
								<NotesTab designData={designData} />
							</TabPane>
							<TabPane tab='Pipeline' key='pipeline'>
								<PipelineTab
									setProjectPhase={setProjectPhase}
									designData={designData}
									projectId={id}
									setDesignData={setDesignData}
									pause={pause}
								/>
							</TabPane>
							<TabPane tab='Chat' key='Chat'>
								<ChatPanel projectId={id} designID={designId} />
							</TabPane>

							{designData.assets.length && (
								<TabPane tab='Customer View' key='cust_view'>
									<CustomerView
										projectName={getValueSafely(() => projectData.name, "")}
										designData={designData}
										projectData={projectData}
									/>
								</TabPane>
							)}
							{feedback.length && (
								<TabPane tab='Customer Feedback' key='customer_feedback'>
									<CustomerFeedbackTab
										projectData={{
											feedback,
											designs: [...projectData.designs],
										}}
									/>
								</TabPane>
							)}
							{!projectData && (
								<TabPane tab='Design Details' key='design_details'>
									<DesignDetails
										designData={designData}
										setDesignData={setDesignData}
										setDesignLoading={setDesignLoading}
									/>
								</TabPane>
							)}
						</ScrollableTabs>
					</Col>
					<EditDesignModal
						confirmLoading={designLoading}
						publish={!!projectData}
						onOk={onClickOk}
						onCancel={toggleEditDesignModal}
						designData={designData}
						visible={editModalVisible}
					/>
				</Row>
			) : (
				<Spin style={{ padding: "2rem 2rem", width: "100%" }} spinning={designLoading}>
					{!!projectData && (
						<ProjectDesignInteractionPanel
							updateRevisionData={updateRevisionData}
							revisionFormData={revisionFormData}
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
