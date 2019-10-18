import Button from "@components/Button";
import RadioCard from "@sections/Cards/radio";
import SectionHeader from "@sections/SectionHeader";
import fetcher from "@utils/fetcher";
import roomLookOptions from "@utils/roomLookQuizMock";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { goToQuiz, quizReqBody } from "./QuizHelper";

function Question3({ plan }) {
	const quizId = 3;

	const quizTitle = "What's the occasion?";

	const [quizState, setQuizState] = useState("");

	const [submitInProgress, setSubmitInProgress] = useState(false);

	useEffect(() => {
		const formId = "user";
		fetcher({
			endPoint: `/form/${formId}/${quizId}`,
			method: "GET"
		}).then(response => {
			if (response.statusCode <= 300) {
				setQuizState(response.data.formData[0].answer);
			}
		});
	}, []);

	const handleClick = e => setQuizState(e.currentTarget.value);

	const handlePrev = () => {
		goToQuiz(
			{ pathname: "/designMySpace", query: { quiz: quizId - 1, plan } },
			`/designMySpace/${plan}?quiz=${quizId - 1}`
		);
	};

	const handleNext = async () => {
		setSubmitInProgress(true);
		const formId = "user";
		const response = await fetcher({
			endPoint: `/form/${formId}/${quizId}`,
			method: "PUT",
			body: quizReqBody(quizId, quizTitle, quizState)
		});
		if (response.statusCode <= 300) {
			setSubmitInProgress(false);
			goToQuiz({
				pathname: "/designMySpace",
				query: { quiz: quizId + 1, plan },
				as: `/designMySpace/${plan}?quiz=${quizId + 1}`
			});
		}
	};

	return (
		<div className="container">
			<div className="grid text-center">
				<div className="col-12 col-md-10">
					<SectionHeader title={quizTitle} description="We build our vision around your purpose!" />
					<div className="grid align-center">
						<div className="col-12">
							<div className="grid">
								{roomLookOptions.map(room => (
									<div className="col-12 col-sm-6 col-md-3" key={room.title}>
										<RadioCard
											version={2}
											value={room.title}
											onClick={handleClick}
											checked={quizState === room.title}
											bg={room.bg}
											image={`https://res.cloudinary.com/spacejoy/image/upload/v1571132514/web/designPurpose/${room.icon}`}
										/>
									</div>
								))}
							</div>
						</div>
						<div className="col-4 col-sm-2">
							<Button
								variant="secondary"
								fill="ghost"
								size="sm"
								full
								onClick={handlePrev}
								action="Quiz"
								label={quizState}
								event="Quiz"
								data={{ Question: `${quizTitle}`, Answer: `${quizState}`, Action: "Previous" }}
							>
								Prev
							</Button>
						</div>
						<div className="col-4 col-sm-8" />
						<div className="col-4 col-sm-2">
							<Button
								variant="primary"
								full
								size="sm"
								onClick={handleNext}
								submitInProgress={submitInProgress}
								action="Quiz"
								label={quizState}
								event="Quiz"
								data={{ Question: `${quizTitle}`, Answer: `${quizState}`, Action: "Next" }}
							>
								Next
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

Question3.defaultProps = {
	plan: ""
};

Question3.propTypes = {
	plan: PropTypes.string
};

export default Question3;
