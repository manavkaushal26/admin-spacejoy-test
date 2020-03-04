import React, { useState, useEffect } from "react";
import { QuizSectionInterface } from "@customTypes/dashboardTypes";
import fetcher from "@utils/fetcher";
import { notification, Row, Tabs } from "antd";
import { getQuizSectionsApi } from "@api/quizApi";
import QuizSections from "./QuizSections";

const DetailedCustomerRequirements: React.FC<{ projectId: string }> = ({ projectId }) => {
	const [quizResponse, setQuizResponse] = useState<QuizSectionInterface[]>([]);
	const fetchQuizResponses = async (): Promise<void> => {
		const endPoint = getQuizSectionsApi(projectId);
		try {
			const response = await fetcher({ endPoint, method: "GET" });
			if (response.statusCode <= 300) {
				setQuizResponse(response.data);
			}
		} catch (e) {
			if (e.message === "Failed to fetch") {
				notification.error({
					message: "Failed to fetch Quiz Responses. Please check your internet connection and Retry",
				});
			} else {
				notification.error({ message: "Failed to fetch Quiz Responses" });
			}
		}
	};

	useEffect(() => {
		if (quizResponse.length === 0) {
			fetchQuizResponses();
		}
	}, []);
	return (
		<Row>
			<Tabs>
				{quizResponse.map(section => {
					return (
						<Tabs.TabPane tab={section.title} key={section._id}>
							<QuizSections
								key={section._id}
								section={section}
								setQuizResponse={setQuizResponse}
								projectId={projectId}
								quizResponse={quizResponse}
							/>
						</Tabs.TabPane>
					);
				})}
			</Tabs>
		</Row>
	);
};

export default React.memo(DetailedCustomerRequirements);
