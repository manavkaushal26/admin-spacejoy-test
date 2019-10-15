import Button from "@components/Button";
import Image from "@components/Image";
import SVGIcon from "@components/SVGIcon";
import React, { useState } from "react";
import styled from "styled-components";
import QuizHeader from "./QuizHeader";
import { goToQuiz } from "./QuizHelper";

const SampleImageStyled = styled.div`
	position: relative;
	min-height: 100%;
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
`;

const BudgetSelectionStyled = styled.div`
	padding: 1rem 2rem;
	border-radius: 5px;
	box-shadow: 0 0 10px 0px ${({ theme }) => theme.colors.mild.black};
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

function Question2() {
	const [budget, setBudget] = useState("");

	const handleClick = e => setBudget(e.target.value);

	const handlePrev = () => {
		goToQuiz({ pathname: "/designMySpace", query: { quiz: "1", plan: "free" }, as: "/designMySpace?quiz=1&plan=free" });
	};

	const handleNext = () => {
		goToQuiz({ pathname: "/designMySpace", query: { quiz: "3", plan: "free" }, as: "/designMySpace?quiz=3&plan=free" });
	};

	return (
		<div className="container">
			<div className="grid text-center">
				<div className="col-xs-10">
					<QuizHeader
						title="Have a budget in mind?"
						description="Let's start by helping your designers understand which rooms you prefer."
					/>
					<div className="grid align-center">
						<div className="col-12 col-sm-5 col-md-4">
							<BudgetSelectionStyled>
								<RadioStyled
									type="button"
									raw
									onClick={handleClick}
									value="$10,000 or more"
									className={budget === "$10,000 or more" ? "active" : ""}
								>
									<div>
										<SVGIcon name="tick" height={13} width={20} />
									</div>
									<div>
										<h4>$10,000 or more</h4>
										<span>A budget friendly option</span>
										{budget === "$10,000 or more" && (
											<small>Lorem ipsum dolor sit amet, consectetuer adipiscing elit</small>
										)}
									</div>
								</RadioStyled>
								<RadioStyled
									type="button"
									raw
									onClick={handleClick}
									value="$5000 - $7000"
									className={budget === "$5000 - $7000" ? "active" : ""}
								>
									<div>
										<SVGIcon name="tick" height={13} width={20} />
									</div>
									<div>
										<h4>$5000 - $7000</h4>
										<span>A budget friendly option</span>
										{budget === "$5000 - $7000" && (
											<small>Lorem ipsum dolor sit amet, consectetuer adipiscing elit</small>
										)}
									</div>
								</RadioStyled>
								<RadioStyled
									type="button"
									raw
									onClick={handleClick}
									value="$2000 - $5000"
									className={budget === "$2000 - $5000" ? "active" : ""}
								>
									<div>
										<SVGIcon name="tick" height={13} width={20} />
									</div>
									<div>
										<h4>$2000 - $5000</h4>
										<span>A budget friendly option</span>
										{budget === "$2000 - $5000" && (
											<small>Lorem ipsum dolor sit amet, consectetuer adipiscing elit</small>
										)}
									</div>
								</RadioStyled>
								<RadioStyled
									type="button"
									raw
									onClick={handleClick}
									value="$2000 or less"
									className={budget === "$2000 or less" ? "active" : ""}
								>
									<div>
										<SVGIcon name="tick" />
									</div>
									<div>
										<h4>$2000 or less</h4>
										<span>A budget friendly option</span>
										{budget === "$2000 or less" && (
											<small>Lorem ipsum dolor sit amet, consectetuer adipiscing elit</small>
										)}
									</div>
								</RadioStyled>
							</BudgetSelectionStyled>
						</div>
						<div className="col-12 col-sm-7 col-md-8">
							<SampleImageStyled>
								<ImageWrapperStyled className={budget === "" ? "active" : "inactive"}>
									<Image
										size="full"
										src="https://res.cloudinary.com/spacejoy/image/upload/c_scale,w_550/v1570618479/web/empty_ekqe1s.png"
									/>
								</ImageWrapperStyled>
								<ImageWrapperStyled className={budget === "$10,000 or more" ? "active" : "inactive"}>
									<Image
										size="full"
										src="https://res.cloudinary.com/spacejoy/image/upload/v1570444188/web/10000_gydis3.png"
									/>
								</ImageWrapperStyled>
								<ImageWrapperStyled className={budget === "$5000 - $7000" ? "active" : "inactive"}>
									<Image
										size="full"
										src="https://res.cloudinary.com/spacejoy/image/upload/v1570442615/web/7000_fojbqr.png"
									/>
								</ImageWrapperStyled>
								<ImageWrapperStyled className={budget === "$2000 - $5000" ? "active" : "inactive"}>
									<Image
										size="full"
										src="https://res.cloudinary.com/spacejoy/image/upload/v1570442615/web/5000_gy1xsz.png"
									/>
								</ImageWrapperStyled>
								<ImageWrapperStyled className={budget === "$2000 or less" ? "active" : "inactive"}>
									<Image
										size="full"
										src="https://res.cloudinary.com/spacejoy/image/upload/v1570442615/web/2000_clxfbs.png"
									/>
								</ImageWrapperStyled>
							</SampleImageStyled>
						</div>
						<div className="col-4 col-sm-2">
							<Button variant="secondary" fill="ghost" size="sm" full onClick={handlePrev}>
								Prev
							</Button>
						</div>
						<div className="col-4 col-sm-8" />
						<div className="col-4 col-sm-2">
							<Button variant="primary" full size="sm" onClick={handleNext}>
								Next
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Question2;
