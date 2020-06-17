import { DetailedProject } from "@customTypes/dashboardTypes";
import { Card, Row, Typography, Col } from "antd";
import React from "react";

interface CustomerFeedbackTab {
	projectData: Partial<DetailedProject>;
}

const { Text } = Typography;

const CustomerFeedbackTab: React.FC<CustomerFeedbackTab> = ({ projectData }) => {
	return (
		<Row gutter={[8, 8]}>
			{projectData.feedback.map(feedback => {
				const designData = projectData.designs.find(design => {
					return design.design._id === feedback.reference;
				});
				return (
					<Col key={feedback._id}>
						<Card title={`${designData.design.name}' feedback`}>
							<Text>{feedback.comment}</Text>
						</Card>
					</Col>
				);
			})}
		</Row>
	);
};

export default CustomerFeedbackTab;
