import Button from "@components/Button";
import Image from "@components/Image";
import SVGIcon from "@components/SVGIcon";
import SectionHeader from "@sections/SectionHeader";
import fetcher from "@utils/fetcher";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { goToQuiz, quizReqBody } from "./QuizHelper";

const SampleImageStyled = styled.div`
	position: relative;
	min-height: 100%;
	@media (max-width: 576px) {
		height: 250px;
	}
`;

const ImageWrapperStyled = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	margin-top: -30%;
	width: 100%;
	transition: opacity 0.25s ease-in-out, transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
	&.active {
		opacity: 1;
		transform: scale(1);
	}
	&.inactive {
		opacity: 0;
		transform: scale(0.95);
	}
	@media (max-width: 576px) {
		margin-top: 0;
	}
`;

const BudgetSelectionStyled = styled.div`
	padding: 1rem 2rem;
	border-radius: 5px;
	box-shadow: 0 0 10px 0px ${({ theme }) => theme.colors.mild.black};
	@media (max-width: 576px) {
		box-shadow: none;
	}
`;

const RadioStyled = styled(Button)`
	padding: 1rem 0;
	width: 100%;
	display: flex;
	overflow: auto;
	white-space: normal;
	text-align: left;
	text-transform: inherit;
	letter-spacing: 0;
	line-height: 1.58;
	background-color: transparent;
	border-bottom: 1px solid ${({ theme }) => theme.colors.bg.light2};
	&:last-child {
		border: 0px;
	}
	&.active {
		div:first-child {
			svg {
				background-color: ${({ theme }) => theme.colors.accent};
				path {
					fill: white;
				}
			}
		}
	}
	div {
		pointer-events: none;
		&:first-child {
			flex: 1;
			svg {
				border: 1px solid ${({ theme }) => theme.colors.accent};
				height: 20px;
				width: 20px;
				border-radius: 10px;
				padding: 2px;
				path {
					fill: transparent;
				}
			}
		}
		&:last-child {
			flex: 6;
		}
		h4 {
			font-family: inherit;
			margin: 0;
			display: block;
		}
		span {
			margin: 0.15rem 0;
			font-size: 13px;
		}
		small {
			display: inline-block;
			color: ${({ theme }) => theme.colors.fc.dark2};
		}
	}
`;

function Question2({ plan }) {
	const quizId = 2;

	const quizTitle = "What does your budget look like?";

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
				<div className="col-xs-10">
					<SectionHeader title={quizTitle} description="Pick one from the budget ranges below" />
					<div className="grid align-center">
						<div className="col-12 col-sm-5 col-md-4">
							<BudgetSelectionStyled>
								<RadioStyled
									type="button"
									raw
									onClick={handleClick}
									value="$10,000 or more"
									className={quizState === "$10,000 or more" ? "active" : ""}
								>
									<div>
										<SVGIcon name="tick" height={13} width={20} />
									</div>
									<div>
										<h4>$10,000 or more</h4>
										<span>A budget friendly option</span>
										{quizState === "$10,000 or more" && (
											<small>Lorem ipsum dolor sit amet, consectetuer adipiscing elit</small>
										)}
									</div>
								</RadioStyled>
								<RadioStyled
									type="button"
									raw
									onClick={handleClick}
									value="$5000 - $7000"
									className={quizState === "$5000 - $7000" ? "active" : ""}
								>
									<div>
										<SVGIcon name="tick" height={13} width={20} />
									</div>
									<div>
										<h4>$5000 - $7000</h4>
										<span>A budget friendly option</span>
										{quizState === "$5000 - $7000" && (
											<small>Lorem ipsum dolor sit amet, consectetuer adipiscing elit</small>
										)}
									</div>
								</RadioStyled>
								<RadioStyled
									type="button"
									raw
									onClick={handleClick}
									value="$2000 - $5000"
									className={quizState === "$2000 - $5000" ? "active" : ""}
								>
									<div>
										<SVGIcon name="tick" height={13} width={20} />
									</div>
									<div>
										<h4>$2000 - $5000</h4>
										<span>A budget friendly option</span>
										{quizState === "$2000 - $5000" && (
											<small>Lorem ipsum dolor sit amet, consectetuer adipiscing elit</small>
										)}
									</div>
								</RadioStyled>
								<RadioStyled
									type="button"
									raw
									onClick={handleClick}
									value="$2000 or less"
									className={quizState === "$2000 or less" ? "active" : ""}
								>
									<div>
										<SVGIcon name="tick" />
									</div>
									<div>
										<h4>$2000 or less</h4>
										<span>A budget friendly option</span>
										{quizState === "$2000 or less" && (
											<small>Lorem ipsum dolor sit amet, consectetuer adipiscing elit</small>
										)}
									</div>
								</RadioStyled>
							</BudgetSelectionStyled>
						</div>
						<div className="col-12 col-sm-7 col-md-8">
							<SampleImageStyled>
								<ImageWrapperStyled className={quizState === "" ? "active" : "inactive"}>
									<Image
										height="auto"
										src="https://res.cloudinary.com/spacejoy/image/upload/v1571313167/web/Spacejoy_quiz_blank_state_bm2xyu.svg"
									/>
								</ImageWrapperStyled>
								<ImageWrapperStyled className={quizState === "$10,000 or more" ? "active" : "inactive"}>
									<Image
										height="auto"
										src="https://res.cloudinary.com/spacejoy/image/upload/v1570444188/web/10000_gydis3.png"
									/>
								</ImageWrapperStyled>
								<ImageWrapperStyled className={quizState === "$5000 - $7000" ? "active" : "inactive"}>
									<Image
										height="auto"
										src="https://res.cloudinary.com/spacejoy/image/upload/v1570442615/web/7000_fojbqr.png"
									/>
								</ImageWrapperStyled>
								<ImageWrapperStyled className={quizState === "$2000 - $5000" ? "active" : "inactive"}>
									<Image
										height="auto"
										src="https://res.cloudinary.com/spacejoy/image/upload/v1570442615/web/5000_gy1xsz.png"
									/>
								</ImageWrapperStyled>
								<ImageWrapperStyled className={quizState === "$2000 or less" ? "active" : "inactive"}>
									<Image
										height="auto"
										src="https://res.cloudinary.com/spacejoy/image/upload/v1570442615/web/2000_clxfbs.png"
									/>
								</ImageWrapperStyled>
							</SampleImageStyled>
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
								action="Quiz"
								label={quizState}
								event="Quiz"
								data={{ Question: `${quizTitle}`, Answer: `${quizState}`, Action: "Next" }}
								submitInProgress={submitInProgress}
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

Question2.defaultProps = {
	plan: ""
};

Question2.propTypes = {
	plan: PropTypes.string
};

export default Question2;
