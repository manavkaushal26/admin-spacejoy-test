import React, { useState } from "react";
import { getValueSafely } from "@utils/commonUtils";
import { DetailedProject } from "@customTypes/dashboardTypes";
import CustomerResponses from "@sections/Dashboard/userProjectMainPanel/CustomerResponses";
import { Radio, Row, Col } from "antd";
import DetailedCustomerRequirement from "../DetailedCustomerRequirement";

interface CustomerResponsesTab {
	projectData: DetailedProject;
}

const CustomerResponsesTab: React.FC<CustomerResponsesTab> = ({ projectData }) => {
	const formData = getValueSafely(() => projectData.form, null);
	const [currentTab, setCurrentTab] = useState<"quiz1" | "quiz2">("quiz1");
	return (
		<Row gutter={[8, 8]}>
			<Col span={24}>
				<Row justify="center">
					<Radio.Group
						value={currentTab}
						onChange={(e): void => {
							setCurrentTab(e.target.value);
						}}
					>
						<Radio.Button value="quiz1">Initial Quiz</Radio.Button>
						<Radio.Button value="quiz2">Requirement Quiz</Radio.Button>
					</Radio.Group>
				</Row>
			</Col>
			{currentTab === "quiz1" && (
				<Col span={24}>
					<CustomerResponses formData={formData} />
				</Col>
			)}
			{currentTab === "quiz2" && (
				<Col span={24}>
					<DetailedCustomerRequirement projectId={projectData._id} />
				</Col>
			)}
		</Row>
	);
};

export default CustomerResponsesTab;
