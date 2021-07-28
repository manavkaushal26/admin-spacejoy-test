import { DetailedProject } from "@customTypes/dashboardTypes";
import CustomerResponses from "@sections/Dashboard/userProjectMainPanel/CustomerResponses";
import { getValueSafely } from "@utils/commonUtils";
import { Col, Radio, Row } from "antd";
import React, { useState } from "react";
import DetailedCustomerRequirement from "../DetailedCustomerRequirement";
import UserStyleQuizResponse from "../StyleQuizResponse";

interface CustomerResponsesTab {
	projectData: DetailedProject;
}

const CustomerResponsesTab: React.FC<CustomerResponsesTab> = ({ projectData }) => {
	const formData = getValueSafely(() => projectData.form, null);
	const [currentTab, setCurrentTab] = useState<"quiz1" | "quiz2" | "quiz3">("quiz1");
	return (
		<Row gutter={[8, 8]}>
			<Col span={24}>
				<Row justify='center'>
					<Radio.Group
						value={currentTab}
						onChange={(e): void => {
							setCurrentTab(e.target.value);
						}}
					>
						<Radio.Button value='quiz1'>Initial Quiz</Radio.Button>
						<Radio.Button value='quiz2'>Requirement Quiz</Radio.Button>
						<Radio.Button value='quiz3'>Style Quiz Results</Radio.Button>
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
			{currentTab === "quiz3" && (
				<Col span={24}>
					<div>
						<UserStyleQuizResponse userId={projectData.customer._id} />
					</div>
				</Col>
			)}
		</Row>
	);
};

export default CustomerResponsesTab;
