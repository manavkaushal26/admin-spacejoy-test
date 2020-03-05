import React, { useState } from "react";
import { QuizSectionInterface, QuizStatus } from "@customTypes/dashboardTypes";
import { Card, Col, Row, Button, notification, Popover, Input, Typography, Alert } from "antd";
import { setQuizReviewApi } from "@api/quizApi";
import fetcher from "@utils/fetcher";
import QuizResponse from "./QuizResponse";

const { Text } = Typography;
interface QuizSection {
	section: QuizSectionInterface;
	setQuizResponse: React.Dispatch<React.SetStateAction<QuizSectionInterface[]>>;
	projectId: string;
	quizResponse: QuizSectionInterface[];
}

const QuizSections: React.FC<QuizSection> = ({ section, projectId, setQuizResponse }) => {
	const [rejectMessage, setRejectMessage] = useState<string>("");
	const [currentQuizId, setCurrentQuizId] = useState<string>("");

	const onReviewButtonClick = async (quizId: string, status: QuizStatus): Promise<void> => {
		const endPoint = setQuizReviewApi(projectId);
		if (status === QuizStatus.Accepted) {
			const response = await fetcher({
				endPoint,
				method: "PUT",
				body: {
					data: {
						[quizId]: {
							status,
							comment: "",
						},
					},
				},
			});
			setQuizResponse(response.data);
		} else if (rejectMessage === "") {
			notification.error({ message: "Please type in the reason why the response is being rejected" });
		} else {
			const response = await fetcher({
				endPoint,
				method: "PUT",
				body: {
					data: {
						[quizId]: {
							status,
							comment: rejectMessage,
						},
					},
				},
			});
			setQuizResponse(response.data);
			setCurrentQuizId("");
		}
	};

	const handleVisibilityChange = (visible: boolean, quizId: string): void => {
		setRejectMessage("");
		setCurrentQuizId(quizId);
	};

	const handleMessageChange = (e): void => {
		const {
			target: { value },
		} = e;
		setRejectMessage(value);
	};

	return (
		<Row gutter={[16, 16]}>
			{section.quiz.map(quizQuestion => {
				const { _id, title, answer, mandatory } = quizQuestion;

				const {
					context: { hasOptions },
					context,
					userResponse,
				} = answer;

				return (
					<Col key={_id}>
						<Card
							key={_id}
							title={
								<Row type="flex" justify="space-between">
									<Col>
										<Row gutter={[8, 8]}>
											<Col>
												<Text strong>{`${title} ${mandatory ? "*" : ""}`}</Text>
											</Col>
											{!!quizQuestion.designerComment && (
												<Col>
													<Alert
														type="error"
														message="Reason for Rejection"
														description={quizQuestion.designerComment}
													/>
												</Col>
											)}
										</Row>
									</Col>
									<Col>
										<Row type="flex" gutter={[8, 8]}>
											<Col>
												<Button
													onClick={(): Promise<void> => onReviewButtonClick(quizQuestion._id, QuizStatus.Accepted)}
													disabled={quizQuestion.responseStatus === QuizStatus.Accepted}
													type="primary"
													icon="check"
												>
													Accept
												</Button>
											</Col>
											<Col>
												<Popover
													content={
														<Row gutter={[8, 8]}>
															<Col span={24}>
																<Input.TextArea value={rejectMessage} onChange={handleMessageChange} />
															</Col>
															<Col span={24}>
																<Row type="flex" justify="end" gutter={[8, 8]}>
																	<Col>
																		<Button
																			type="danger"
																			onClick={(): Promise<void> =>
																				onReviewButtonClick(quizQuestion._id, QuizStatus.Rejected)
																			}
																		>
																			Submit
																		</Button>
																	</Col>
																	<Col>
																		<Button onClick={(): void => handleVisibilityChange(false, "")}>Cancel</Button>
																	</Col>
																</Row>
															</Col>
														</Row>
													}
													trigger="click"
													title="Reason for Rejection"
													visible={currentQuizId === quizQuestion._id}
													onVisibleChange={(visible): void => {
														if (quizQuestion.responseStatus !== QuizStatus.Rejected)
															handleVisibilityChange(visible, quizQuestion._id);
													}}
												>
													<Button
														disabled={quizQuestion.responseStatus === QuizStatus.Rejected}
														type="danger"
														icon="close"
													>
														Reject
													</Button>
												</Popover>
											</Col>
										</Row>
									</Col>
								</Row>
							}
						>
							{hasOptions ? (
								answer.options.map(option => {
									return (
										<Row type="flex" gutter={[8, 8]} key={option._id}>
											<Col>{option.label}: </Col>
											<Col>
												<QuizResponse context={context} response={option.userResponse} />
											</Col>
										</Row>
									);
								})
							) : (
								<QuizResponse context={context} response={userResponse} />
							)}
						</Card>
					</Col>
				);
			})}
		</Row>
	);
};

export default QuizSections;
