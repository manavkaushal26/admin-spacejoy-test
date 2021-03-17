import PhaseTimeline from "@components/PhaseTimeline";
import { DetailedProject, RevisionForm } from "@customTypes/dashboardTypes";
import ChatWrapper from "@sections/AdminChatInterface/ChatOverView";
import CartDetails from "@sections/CartShoppingInterface/CartDetails";
import ShoppingDetails from "@sections/CartShoppingInterface/ShoppingDetails";
import CustomerRatings from "@sections/CustomerRatings";
import DesignSelection from "@sections/Dashboard/userProjectMainPanel/DesignSelection";
import { PaddedDiv } from "@sections/Header/styled";
import { Tabs } from "antd";
import React from "react";
import ProjectTeamTab from "../ProjectTeamTab";
import CustomerFeedbackTab from "./CustomerFeedbackTab";
import CustomerResponsesTab from "./CustomerResponesTab";
import CustomerRevisionData from "./CustomerRevisionData";
interface ProjectDesignInteractionPanel {
	projectData: DetailedProject;
	onSelectDesign: (id: string) => void;
	refetchData: () => void;
	setProjectData: React.Dispatch<React.SetStateAction<DetailedProject>>;
	revisionFormData: RevisionForm;
	updateRevisionData: (revisionForm: RevisionForm) => void;
	userStyleQuizResult?: React.ReactNode;
	customerRatings: Partial<{}>;
}

const ProjectDesignInteractionPanel: React.FC<ProjectDesignInteractionPanel> = ({
	refetchData,
	setProjectData,
	projectData,
	onSelectDesign,
	revisionFormData,
	updateRevisionData,
	userStyleQuizResult,
	customerRatings,
}) => {
	const { id: projectId, designs, customer } = projectData;
	console.log("customerRatings", customerRatings);
	return (
		<Tabs>
			<Tabs.TabPane tab='Designs' key='designSelection'>
				<DesignSelection
					refetchData={refetchData}
					setProjectData={setProjectData}
					projectData={projectData}
					onSelectDesign={onSelectDesign}
					revisionDesign={revisionFormData?.revisedDesign ? revisionFormData?.revisedDesign?._id : null}
				/>
			</Tabs.TabPane>
			<Tabs.TabPane tab='Quiz Responses' key='customerResponses'>
				<CustomerResponsesTab projectData={projectData} userStyleQuizResult={userStyleQuizResult} />
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
			<Tabs.TabPane tab='Project team' key='team'>
				<Tabs type='card'>
					<Tabs.TabPane tab='Base team' key='team'>
						<ProjectTeamTab type='team' projectId={projectData?._id} />
					</Tabs.TabPane>
					<Tabs.TabPane tab='Revision team' key='revisionTeam'>
						<ProjectTeamTab type='revisionTeam' projectId={projectData?._id} />
					</Tabs.TabPane>
				</Tabs>
			</Tabs.TabPane>
			<Tabs.TabPane tab='Chat' key='chat'>
				<ChatWrapper projectId={projectId} designs={designs}></ChatWrapper>
			</Tabs.TabPane>
			<Tabs.TabPane tab='Cart Data' key='cart-data'>
				<CartDetails id={customer?._id}></CartDetails>
			</Tabs.TabPane>
			<Tabs.TabPane tab='Shopping Data' key='shopping-data'>
				<ShoppingDetails id={customer?.email}></ShoppingDetails>
			</Tabs.TabPane>
			<Tabs.TabPane tab='Customer Ratings' key='customer-rating'>
				<CustomerRatings data={customerRatings}></CustomerRatings>
			</Tabs.TabPane>
		</Tabs>
	);
};

export default React.memo(ProjectDesignInteractionPanel);
