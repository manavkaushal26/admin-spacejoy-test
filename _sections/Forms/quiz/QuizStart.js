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
	background-image: url("https://res.cloudinary.com/spacejoy/image/upload/v1571468153/web/white-furniture_lsnszk.png");
	background-position: 100% 100%;
	background-size: 250px;
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
						title="Start Your Free Trial. Unlock Fabulous Designs!"
						description="Answer few more questions and submit images of your room to get your 3D designs going"
					/>
					<div className="grid text-left">
						<div className="col-12 col-md-6">
							<FreeStyled>
								<h3>Free trial Includes</h3>
								<BenefitList>
									<BenefitList.Item icon="tick">Realistic 3D render of your design </BenefitList.Item>
									<BenefitList.Item icon="tick">Turnaround time of 12 Days</BenefitList.Item>
									<BenefitList.Item icon="tick">Shopping list of products in your design</BenefitList.Item>
								</BenefitList>
							</FreeStyled>
						</div>
						<div className="col-12 col-md-6">
							<PaidStyled>
								<h3>Love what you see? Upgrade and unlock</h3>
								<BenefitList>
									<BenefitList.Item icon="plus" nature="positive">
										Everything in the &quot;Delight&quot; package +
									</BenefitList.Item>
									<BenefitList.Item icon="tick" nature="positive">
										Design revisions on our 3D App
									</BenefitList.Item>
									<BenefitList.Item icon="tick" nature="positive">
										Shopping and styling assistance
									</BenefitList.Item>
									<BenefitList.Item icon="tick" nature="positive">
										Access to our <strong>Deal-Hunter</strong>*
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
						<div className="col-12">
							<h4>What is Deal Hunter?</h4>
							<small>
								<sup>*</sup>We&apos;ll find you the best deals on products featured in your design <br /> Get at least
								12% off on your entire shopping list <br /> Always looking to save your precious dollars!
							</small>
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
