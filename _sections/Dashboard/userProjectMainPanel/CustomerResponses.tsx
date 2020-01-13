import { FormType } from "@customTypes/dashboardTypes";
import { Card } from "antd";
import React from "react";
import { CustomDiv, ModifiedText } from "../styled";

interface CustomerResponsesProps {
	formData: FormType[];
}

const CustomerResponses: React.FC<CustomerResponsesProps> = ({ formData }): JSX.Element => {
	return (
		<>
			<CustomDiv py="16px" flexWrap="wrap" type="flex" justifyContent="flex-start">
				{formData.map(question => {
					return (
						<CustomDiv key={question.entry} mx="8px" my="8px">
							<Card title={<ModifiedText>{question.question}</ModifiedText>} size="small">
								<ModifiedText textTransform="capitalize">{question.answer}</ModifiedText>
							</Card>
						</CustomDiv>
					);
				})}
			</CustomDiv>
		</>
	);
};

export default CustomerResponses;
