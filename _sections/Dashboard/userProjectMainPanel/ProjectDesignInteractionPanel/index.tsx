import React from "react";
import DesignSelection from "@sections/Dashboard/userProjectMainPanel/DesignSelection";
import { DetailedProject, RevisionForm } from "@customTypes/dashboardTypes";
import { Tabs } from "antd";
import CustomerResponsesTab from "./CustomerResponesTab";
import CustomerFeedbackTab from "./CustomerFeedbackTab";
import CustomerRevisionData from "./CustomerRevisionData";
import PhaseTimeline from "@components/PhaseTimeline";
import { PaddedDiv } from "@sections/Header/styled";

interface ProjectDesignInteractionPanel {
	projectData: DetailedProject;
	onSelectDesign: (id: string) => void;
	refetchData: () => void;
	setProjectData: React.Dispatch<React.SetStateAction<DetailedProject>>;
	revisionFormData: RevisionForm;
	updateRevisionData: (revisionForm: RevisionForm) => void;
}

const ProjectDesignInteractionPanel: React.FC<ProjectDesignInteractionPanel> = ({
	refetchData,
	setProjectData,
	projectData,
	onSelectDesign,
	revisionFormData,
	updateRevisionData,
}) => {
	return (
		<Tabs>
			<Tabs.TabPane tab='Designs' key='designSelection'>
				<DesignSelection
					refetchData={refetchData}
					setProjectData={setProjectData}
					projectData={projectData}
					onSelectDesign={onSelectDesign}
					revisionDesign={revisionFormData?.revisedDesign?._id}
				/>
			</Tabs.TabPane>
			<Tabs.TabPane tab='Quiz Responses' key='customerResponses'>
				<CustomerResponsesTab projectData={projectData} />
			</Tabs.TabPane>
			{projectData.feedback.length && (
				<Tabs.TabPane tab='Customer Feedback (Deprecated)' key='customerFeedbackDeprecated'>
					<CustomerFeedbackTab projectData={projectData} />
				</Tabs.TabPane>
			)}
			{revisionFormData?._id && (
				<Tabs.TabPane tab='Revision' key='customerFeedback'>
					<CustomerRevisionData revisionData={revisionFormData} updateRevisionData={updateRevisionData} />
				</Tabs.TabPane>
			)}
			<Tabs.TabPane tab='Project Timeline' key='projectTimeline'>
				<PaddedDiv>
					<PhaseTimeline
						completedPhases={projectData?.completedPhases || []}
						currentPhase={projectData?.currentPhase}
					/>
				</PaddedDiv>
			</Tabs.TabPane>
		</Tabs>
	);
};

export default React.memo(ProjectDesignInteractionPanel);
