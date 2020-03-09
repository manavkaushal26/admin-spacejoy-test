import { FormType } from "@customTypes/dashboardTypes";
import { Card, Row, Col, Empty } from "antd";
import React from "react";
import { CustomDiv, ModifiedText } from "../styled";

interface CustomerResponsesProps {
	formData: FormType[];
}

const CustomerResponses: React.FC<CustomerResponsesProps> = ({ formData }): JSX.Element => {
	return (
		<Row gutter={[8, 8]}>
			{formData ? (
				formData.map(question => {
					return (
						<Col key={question.entry} md={6} sm={12}>
							<Card title={<ModifiedText textTransform="capitalize">{question.question}</ModifiedText>} size="small">
								<ModifiedText textTransform="capitalize">{question.answer}</ModifiedText>
							</Card>
						</Col>
					);
				})
			) : (
				<Col span={24}>
					<Row type="flex" justify="center">
						<Empty description="Customer hasn't provided responses for this section" />
					</Row>
				</Col>
			)}
		</Row>
	);
};

export default CustomerResponses;
