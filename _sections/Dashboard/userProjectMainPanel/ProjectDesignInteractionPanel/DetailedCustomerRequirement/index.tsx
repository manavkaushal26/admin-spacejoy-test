import { editProjectApi } from "@api/projectApi";
import { getQuizSectionsApi } from "@api/quizApi";
import { QuizAnswerFieldType, QuizSectionInterface } from "@customTypes/dashboardTypes";
import { Role } from "@customTypes/userType";
import useAuth from "@utils/authContext";
import { getValueSafely } from "@utils/commonUtils";
import fetcher from "@utils/fetcher";
import { Button, Card, Col, Modal, notification, Row, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import QuizDiscussions from "./QuizDiscussions";
import QuizResponse from "./QuizResponse";
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
		a.download = `${projectId}-quizResponse.json`;
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

	const auth = useAuth();

	const resetQuiz = async () => {
		const endPoint = editProjectApi(projectId);

		try {
			const response = await fetcher({
				endPoint,
				method: "PUT",
				body: {
					data: {
						quizStatus: {
							currentState: "inProgress",
							noOfQuestionsCompleted: 0,
							pendingSections: ["usage", "style-and-color", "existing-products", "room-images", "personalize"],
						},
					},
				},
			});
			if (response.statusCode <= 300) {
				notification.success({ message: "Successfully reset Customer Quiz" });
			} else {
				throw new Error();
			}
		} catch (e) {
			notification.error({ message: "Failed to reset Quiz" });
		}
	};

	const confirmReset = () => {
		Modal.confirm({
			title: "This will reset the quiz progress for the user. Do you want to Continue?",
			onOk: () => resetQuiz(),
		});
	};

	return (
		<Row gutter={[8, 8]}>
			<Col span={24}>
				<Row justify='end' gutter={[8, 8]}>
					<Col>
						<Button type='primary' onClick={downloadCSV}>
							Download as JSON
						</Button>
					</Col>

					{[Role["Account Manager"], Role.Admin, Role.Owner].includes(auth?.user?.role) && (
						<Col>
							<Button onClick={confirmReset} danger>
								Reset Quiz
							</Button>
						</Col>
					)}
				</Row>
			</Col>
			<Col span={24}>
				<Tabs>
					<Tabs.TabPane tab='Quiz Form' key='quizData'>
						{quizResponse.map(section => {
							return (
								<Col key={section._id} span={24}>
									<Card title={section.title}>
										<Row gutter={[8, 8]}>
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
									</Card>
								</Col>
							);
						})}
					</Tabs.TabPane>
					<Tabs.TabPane tab='Upload Missing Quiz data' key='missingdata'>
						<QuizDiscussions projectId={projectId} />
					</Tabs.TabPane>
				</Tabs>
			</Col>
		</Row>
	);
};

export default React.memo(DetailedCustomerRequirements);
