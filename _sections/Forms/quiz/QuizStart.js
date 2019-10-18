import Button from "@components/Button";
import Image from "@components/Image";
import BenefitList from "@components/BenefitList";
import SectionHeader from "@sections/SectionHeader";
import fetcher from "@utils/fetcher";
import React, { useState } from "react";
import styled from "styled-components";
import { goToQuiz, quizReqBody } from "./QuizHelper";

const List = styled.div`
	margin-bottom: 30px;
	text-align: left;
	div {
		margin: 10px 0px;
	}
	@media (max-width: 576px) {
		margin: 1rem 0;
	}
`;

function QuizStart() {
	const quizId = 0;

	const [submitInProgress, setSubmitInProgress] = useState(false);

	const handleClick = async () => {
		setSubmitInProgress(true);
		const body = quizReqBody(quizId, "begin quiz", "generate form id");
		const response = await fetcher({
			endPoint: "/form",
			method: "POST",
			body
		});
		if (response.statusCode <= 300) {
			setSubmitInProgress(false);
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
						width="300px"
						src="https://res.cloudinary.com/spacejoy/image/upload/v1568649903/shared/Illustration_ajvkhk.svg"
						alt="quiz begin"
						style={{ marginTop: "100px" }}
					/>
					<SectionHeader
						title="You’re on the verge of getting a new design for your space!"
						description="Sign up for a free trial, answer few more questions and submit images of your room to get your 3D designs going."
					/>
					<List>
						<div>As part of your trial you get </div>
						<BenefitList>
							<BenefitList.Active>1 Design and Realistic 3D Renders</BenefitList.Active>
							<BenefitList.Active>Turnaround Time - 12 Days</BenefitList.Active>
							<BenefitList.Active>Shopping List of your Designs</BenefitList.Active>
						</BenefitList>
						<div>If you like what we have designed for you, upgrade and unlock</div>
						<BenefitList>
							<BenefitList.Active> Get designer help to revise your designs on 3D App</BenefitList.Active>
							<BenefitList.Active>Get designer assistance to shop your products</BenefitList.Active>
							<BenefitList.Active>
								Access to Deal Hunter - Best deals on your shopping list (Save at least 12% more on your shopping list)
							</BenefitList.Active>
						</BenefitList>
					</List>
					<Button
						variant="primary"
						size="lg"
						onClick={handleClick}
						submitInProgress={submitInProgress}
						action="Quiz"
						label="FreeTrialLanding"
						event="Quiz"
						data={{ PageName: "FreeTrialLanding", ButtonName: "Let's Begin" }}
					>
						Let&apos;s Begin
					</Button>
				</div>
			</div>
		</div>
	);
}

export default QuizStart;
