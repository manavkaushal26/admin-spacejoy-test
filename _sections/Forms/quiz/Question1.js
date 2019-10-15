import Button from "@components/Button";
import RadioCard from "@sections/Cards/radio";
import SectionHeader from "@sections/SectionHeader";
import fetcher from "@utils/fetcher";
import React, { useEffect, useState } from "react";
import { goToQuiz, quizReqBody } from "./QuizHelper";

function Question1() {
	const quizId = 1;

	const quizTitle = "Which room are you designing?";

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
		goToQuiz({ pathname: "/designMySpace", query: { quiz: "start", plan: "free" } }, `/designMySpace?quiz=start`);
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
				query: { quiz: quizId + 1, plan: "free" },
				as: `/designMySpace?quiz=${quizId + 1}&plan=free`
			});
		}
	};

	return (
		<div className="container">
			<div className="grid text-center">
				<div className="col-xs-10">
					<SectionHeader
						title={quizTitle}
						description="Let's start by helping your designers understand which rooms you prefer."
					/>
					<div className="grid">
						<div className="col-12 col-sm-6 col-md-4">
							<RadioCard
								value="Living Room"
								onClick={handleClick}
								checked={quizState === "Living Room"}
								bg="rgba(0, 188, 212, 0.05)"
								image="https://res.cloudinary.com/spacejoy/image/upload/c_scale,q_100,w_325/v1570170156/web/living-room-tile_xtghwr.png"
							/>
						</div>
						<div className="col-12 col-sm-6 col-md-4">
							<RadioCard
								value="Bedroom"
								onClick={handleClick}
								checked={quizState === "Bedroom"}
								bg="rgba(121, 85, 72, 0.15)"
								image="https://res.cloudinary.com/spacejoy/image/upload/c_scale,q_100,w_325/v1570170156/web/bedroom-tile_kisjld.png"
							/>
						</div>
						<div className="col-12 col-sm-6 col-md-4">
							<RadioCard
								value="Entryway"
								onClick={handleClick}
								checked={quizState === "Entryway"}
								bg="rgba(103, 58, 183, 0.06)"
								image="https://res.cloudinary.com/spacejoy/image/upload/c_scale,q_100,w_325/v1570602461/web/entryway.png"
							/>
						</div>
						<div className="col-12 col-sm-6 col-md-4">
							<RadioCard
								value="Kid's Bedroom"
								onClick={handleClick}
								checked={quizState === "Kid's Bedroom"}
								bg="rgba(255, 252, 222, 0.2)"
								image="https://res.cloudinary.com/spacejoy/image/upload/v1570448686/web/kids_bedroom_fknoyk.png"
							/>
						</div>
						<div className="col-12 col-sm-6 col-md-4">
							<RadioCard
								value="Studio"
								onClick={handleClick}
								checked={quizState === "Studio"}
								bg="rgba(158, 158, 158, 0.15)"
								image="https://res.cloudinary.com/spacejoy/image/upload/v1570451259/web/Studio_Apartment_nu1av3.png"
							/>
						</div>
						<div className="col-12 col-sm-6 col-md-4">
							<RadioCard
								value="Nursery"
								onClick={handleClick}
								checked={quizState === "Nursery"}
								bg="rgba(255, 193, 7, 0.01)"
								image="https://res.cloudinary.com/spacejoy/image/upload/v1570181061/web/nursery_suenxy.png"
							/>
						</div>
						<div className="col-4 col-sm-2">
							<Button variant="secondary" fill="ghost" size="sm" full onClick={handlePrev}>
								Prev
							</Button>
						</div>
						<div className="col-4 col-sm-8" />
						<div className="col-4 col-sm-2">
							<Button variant="primary" full size="sm" onClick={handleNext} submitInProgress={submitInProgress}>
								Next
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Question1;
