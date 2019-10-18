import BenefitList from "@components/BenefitList";
import Button from "@components/Button";
import SVGIcon from "@components/SVGIcon";
import SectionHeader from "@sections/SectionHeader";
import fetcher from "@utils/fetcher";
import PropTypes from "prop-types";
import React, { useState } from "react";
import styled from "styled-components";
import { goToQuiz, quizReqBody } from "./QuizHelper";

const BaseStyled = styled.div`
	padding: 2rem;
	margin-bottom: 2rem;
	height: 100%;
	h3,
	h4 {
		margin-top: 0;
	}
`;
const FreeStyled = styled(BaseStyled)`
	background-color: ${({ theme }) => theme.colors.bg.light2};
	background-image: url("https://res.cloudinary.com/spacejoy/image/upload/v1571406825/web/white-furniture_pyakvm.png");
	background-position: 100% 100%;
	background-size: 300px;
	background-repeat: no-repeat;
`;
const PaidStyled = styled(BaseStyled)`
	background: ${({ theme }) => theme.colors.mild.blue};
	background-image: url("https://res.cloudinary.com/spacejoy/image/upload/v1571408734/web/hanging-lamp_lbsn20.png");
	background-position: 95% 0%;
	background-size: 70px;
	background-repeat: no-repeat;
`;

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
				<div className="col-12 col-md-10">
					<SectionHeader
						title="Start your free trial"
						description="Go through easy flow and upload few click of your room, to get your 3D designs."
					/>
					<div className="grid text-left">
						<div className="col-12 col-md-6">
							<FreeStyled>
								<h3>Free trial Includes</h3>
								<BenefitList>
									<BenefitList.Item icon="dot">1 Design and Realistic 3D Renders</BenefitList.Item>
									<BenefitList.Item icon="dot">Turnaround Time - 12 Days</BenefitList.Item>
									<BenefitList.Item icon="dot">Shopping List of Your Designs</BenefitList.Item>
								</BenefitList>
							</FreeStyled>
						</div>
						<div className="col-12 col-md-6">
							<PaidStyled>
								<h3>Upgrade and Unlock</h3>
								<h4>If you like what we have designed for you,</h4>
								<BenefitList>
									<BenefitList.Item icon="tick" nature="positive">
										Get designer help to revise your designs on 3D App
									</BenefitList.Item>
									<BenefitList.Item icon="tick" nature="positive">
										Get designer assistance to shop your products
									</BenefitList.Item>
									<BenefitList.Item icon="tick" nature="positive">
										Access to Deal Hunter - Best deals on your shopping list
										<br />
										(Save at least 12% more on your shopping list)
									</BenefitList.Item>
								</BenefitList>
							</PaidStyled>
						</div>
						<div className="col-12 text-center">
							<Button
								variant="primary"
								size="md"
								shape="rounded"
								onClick={handleClick}
								submitInProgress={submitInProgress}
								action="Quiz"
								label="FreeTrialLanding"
								event="Quiz"
								data={{ PageName: "FreeTrialLanding", ButtonName: "Let's Begin" }}
							>
								Let&apos;s Begin <SVGIcon name="arrow-right" fill="#fff" />
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
