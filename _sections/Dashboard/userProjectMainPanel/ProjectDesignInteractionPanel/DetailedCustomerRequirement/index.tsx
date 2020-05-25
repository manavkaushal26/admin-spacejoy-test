import React, { useState, useEffect } from "react";
import { QuizSectionInterface, QuizAnswerFieldType } from "@customTypes/dashboardTypes";
import fetcher from "@utils/fetcher";
import { notification, Row, Tabs, Col, Button } from "antd";
import { getQuizSectionsApi } from "@api/quizApi";
import { getValueSafely } from "@utils/commonUtils";
import QuizSections from "./QuizSections";
import QuizResponse from "./QuizResponse";

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

	const quizResp: (resp: QuizResponse) => string | number = ({ context, response }) => {
		const { files, text, select, value } = getValueSafely(
			() => ({ value: response.value, files: response.files, text: response.text, select: response.select }),
			{
				files: [],
				text: "",
				select: false,
				value: 0,
			}
		);

		switch (context.fieldType) {
			case QuizAnswerFieldType.Stepper:
				if (!select) {
					return "No Answer Provided";
				}
				return value;
			case QuizAnswerFieldType.Select:
				if (select) {
					return "Selected";
				}
				return "Not Selected";
			case QuizAnswerFieldType.Text:
				if (text) {
					return text;
				}
				return "No Answer Provided";
			case QuizAnswerFieldType.Value:
				return value;
			case QuizAnswerFieldType.Image:
			case QuizAnswerFieldType.File: {
				if (files.length !== 0) {
					return files
						.map(() => {
							return "File uploaded";
						})
						.join("");
				}
				return "No Files Uploaded";
			}
			default:
				return "Unknown Error";
		}
	};

	const downloadCSV = (): void => {
		const response = quizResponse.map(section => {
			return {
				quizSection: {
					sectionName: section.title,
					value: section.quiz.map(quizRes => {
						const { title, answer } = quizRes;

						const {
							context: { hasOptions },
							context,
							userResponse,
						} = answer;
						return {
							title,
							value: hasOptions
								? answer.options.map(option => {
										return {
											optionName: option.label,
											value: quizResp({ context, response: option.userResponse }),
										};
								  })
								: quizResp({ context, response: userResponse }),
						};
					}),
				},
			};
		});

		const jsonBlob = new Blob([JSON.stringify(response, null, 1)], { type: "text/plain;charset=utf-8" });

		const url = window.URL || window.webkitURL;
		const link = url.createObjectURL(jsonBlob);
		const a = document.createElement("a");
		a.download = `${projectId}-quizResponse.jsode`;
		a.href = link;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
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
							<Row gutter={[8, 8]}>
								<Col>
									<Row type="flex" justify="end">
										<Button type="primary" onClick={downloadCSV}>
											Download as JSON
										</Button>
									</Row>
								</Col>
								<Col>
									<QuizSections
										key={section._id}
										section={section}
										setQuizResponse={setQuizResponse}
										projectId={projectId}
										quizResponse={quizResponse}
									/>
								</Col>
							</Row>
						</Tabs.TabPane>
					);
				})}
			</Tabs>
		</Row>
	);
};

export default React.memo(DetailedCustomerRequirements);
