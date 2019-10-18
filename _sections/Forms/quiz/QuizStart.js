import BenefitList from "@components/BenefitList";
import Button from "@components/Button";
import Image from "@components/Image";
import SectionHeader from "@sections/SectionHeader";
import fetcher from "@utils/fetcher";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { goToQuiz, quizReqBody } from "./QuizHelper";

function QuizStart({ plan }) {
	const quizId = 0;

	const quizTitle = "Selected Plan";

	const [submitInProgress, setSubmitInProgress] = useState(false);

	const handleClick = async () => {
		setSubmitInProgress(true);
		const response = await fetcher({
			endPoint: "/form",
			method: "POST",
			body: quizReqBody(quizId, quizTitle, plan)
		});
		if (response.statusCode <= 300) {
			setSubmitInProgress(false);
			goToQuiz({
				pathname: "/designMySpace",
				query: { quiz: "1", plan },
				as: `/designMySpace/${plan}?quiz=${quizId + 1}`
			});
		}
	};

	return (
		<div className="container">
			<div className="grid text-center">
				<div className="col-12 col-md-8">
					<SectionHeader
						title="Start your free trial and unlock your dream room. You're one step away!"
						description="Sign up for a free trial, answer few more questions and submit images of your room to get your 3D designs going."
					/>
					<div className="grid align-center">
						<div className="col-12 col-md-4">
							<Image
								width="300px"
								src="https://res.cloudinary.com/spacejoy/image/upload/v1568649903/shared/Illustration_ajvkhk.svg"
								alt="quiz begin"
							/>
						</div>
						<div className="col-12 col-md-8 text-left">
							<h3>As part of your trial you get</h3>
							<BenefitList>
								<BenefitList.Item icon="dot">1 Design and Realistic 3D Renders</BenefitList.Item>
								<BenefitList.Item icon="dot">Turnaround Time - 12 Days</BenefitList.Item>
								<BenefitList.Item icon="dot">Shopping List of Your Designs</BenefitList.Item>
							</BenefitList>
							<h3>If you like what we have designed for you, upgrade and unlock</h3>
							<BenefitList>
								<BenefitList.Item icon="tick" nature="positive">
									Get designer help to revise your designs on 3D App
								</BenefitList.Item>
								<BenefitList.Item icon="tick" nature="positive">
									Get designer assistance to shop your products
								</BenefitList.Item>
								<BenefitList.Item icon="tick" nature="positive">
									Access to Deal Hunter - Best deals on your shopping list(Save at least 12% more on your shopping list)
								</BenefitList.Item>
							</BenefitList>
							<Button
								variant="primary"
								size="md"
								shape="rounded"
								onClick={handleClick}
								submitInProgress={submitInProgress}
								style={{ marginTop: "2rem" }}
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
			</div>
		</div>
	);
}

QuizStart.defaultProps = {
	plan: ""
};

QuizStart.propTypes = {
	plan: PropTypes.string
};

export default QuizStart;
