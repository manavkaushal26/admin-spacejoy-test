import Button from "@components/Button";
import Image from "@components/Image";
import SectionHeader from "@sections/SectionHeader";
import fetcher from "@utils/fetcher";
import React, { useState } from "react";
import { goToQuiz, quizReqBody } from "./QuizHelper";

function QuizStart() {
	const quizId = 0;

	const formId = localStorage.getItem("quizFormId");

	const [submitInProgress, setSubmitInProgress] = useState(false);

	const handleClick = async () => {
		setSubmitInProgress(true);
		const body = quizReqBody(quizId, "begin quiz", "generate form id");
		const response = await fetcher({
			endPoint: formId ? `/form/${formId}/${quizId}` : "/form",
			method: formId ? "PUT" : "POST",
			body
		});
		if (response.statusCode <= 300) {
			setSubmitInProgress(false);
			localStorage.setItem("quizFormId", response.data.id);
			goToQuiz({
				pathname: "/designMySpace",
				query: { quiz: "1", plan: "free" },
				as: "/designMySpace?quiz=1&plan=free"
			});
		}
	};

	return (
		<div className="container">
			<div className="grid text-center">
				<div className="col-12 col-md-6">
					<Image
						size="300px"
						src="https://res.cloudinary.com/spacejoy/image/upload/v1568649903/shared/Illustration_ajvkhk.svg"
						alt="quiz begin"
						style={{ marginTop: "100px" }}
					/>
					<SectionHeader
						title="We're so Excited"
						description="Hello there! Let us understand your requirements so that we can kick start designing your dream home."
					/>
					<Button variant="primary" size="lg" onClick={handleClick} submitInProgress={submitInProgress}>
						Let&apos;s Begin
					</Button>
				</div>
			</div>
		</div>
	);
}

export default QuizStart;
