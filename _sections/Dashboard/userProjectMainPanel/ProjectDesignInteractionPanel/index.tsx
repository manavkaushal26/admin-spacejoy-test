import React from "react";
import DesignSelection from "@sections/Dashboard/userProjectMainPanel/DesignSelection";
import { DetailedProject } from "@customTypes/dashboardTypes";
import { Tabs } from "antd";
import CustomerResponsesTab from "./CustomerResponesTab";
import CustomerFeedbackTab from "./CustomerFeedbackTab";

interface ProjectDesignInteractionPanel {
	projectData: DetailedProject;
	onSelectDesign: (id: string) => void;
	refetchData: () => void;
	setProjectData: React.Dispatch<React.SetStateAction<DetailedProject>>;
}

const ProjectDesignInteractionPanel: React.FC<ProjectDesignInteractionPanel> = ({
	refetchData,
	setProjectData,
	projectData,
	onSelectDesign,
}) => {
	return (
		<Tabs>
			<Tabs.TabPane tab="Designs" key="designSelection">
				<DesignSelection
					refetchData={refetchData}
					setProjectData={setProjectData}
					projectData={projectData}
					onSelectDesign={onSelectDesign}
				/>
			</Tabs.TabPane>
			<Tabs.TabPane tab="Customer Responses" key="customerResponses">
				<CustomerResponsesTab projectData={projectData} />
			</Tabs.TabPane>
			{projectData.feedback.length && (
				<Tabs.TabPane tab="Customer Feedback" key="customerFeedback">
					<CustomerFeedbackTab projectData={projectData} />
				</Tabs.TabPane>
			)}
		</Tabs>
	);
};

export default React.memo(ProjectDesignInteractionPanel);
