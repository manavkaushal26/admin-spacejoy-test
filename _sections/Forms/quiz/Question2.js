import Button from "@components/Button";
import Divider from "@components/Divider";
import Image from "@components/Image";
import SVGIcon from "@components/SVGIcon";
import React, { useState } from "react";
import styled from "styled-components";
import QuizHeader from "./QuizHeader";
import goToQuiz from "./QuizHelper";

const BudgetSelectionStyled = styled.div`
	border: 1px solid ${({ theme }) => theme.colors.bg.dark2};
	padding: 2rem;
	border-radius: 5px;
`;

const RadioStyled = styled(Button)`
	width: 100%;
	display: flex;
	overflow: auto;
	white-space: normal;
	text-align: left;
	text-transform: inherit;
	&.active {
		div {
			svg {
				background-color: ${({ theme }) => theme.colors.primary1};
			}
		}
	}
	div {
		pointer-events: none;
		&:first-child {
			flex: 1;
			svg {
				border: 1px solid ${({ theme }) => theme.colors.primary1};
				height: 20px;
				width: 20px;
				border-radius: 10px;
				padding: 2px;
				path {
					fill: white;
				}
			}
		}
		&:last-child {
			flex: 6;
			align-self: center;
		}
		h4 {
			font-family: "Airbnb Cereal App Medium";
			margin: 0;
			display: block;
		}
		h5 {
			margin: 0.15rem 0;
			display: block;
		}
		small {
			letter-spacing: 0;
			line-height: 1.58;
			display: inline-block;
			color: ${({ theme }) => theme.colors.fc.dark3};
		}
	}
`;

function Question2() {
	const [budget, setBudget] = useState("");

	const handleClick = e => {
		console.log("e", e.target);
		setBudget(e.target.value);
	};

	const handlePrev = () => {
		goToQuiz({ pathname: "/designMySpace", query: { quiz: "1", plan: "free" } }, "/designMySpace?quiz=1");
	};

	const handleNext = () => {
		goToQuiz({ pathname: "/designMySpace", query: { quiz: "3", plan: "free" } }, "/designMySpace?quiz=3");
	};

	return (
		<div className="container">
			<div className="grid text-center">
				<div className="col-10">
					<QuizHeader
						title="Have a budget in mind??"
						description="Let's start by helping your designers understand which rooms you prefer."
					/>
					<div className="grid align-center">
						<div className="col-12 col-sm-5 col-md-4">
							<BudgetSelectionStyled>
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
										<h5>A budget friendly option</h5>
										{budget === "$2000 or less" && (
											<small>
												Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod
												tincidunt ut laoreet dolore magna
											</small>
										)}
									</div>
								</RadioStyled>
								<Divider />
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
										<h5>A budget friendly option</h5>
										{budget === "$2000 - $5000" && (
											<small>
												Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod
												tincidunt ut laoreet dolore magna
											</small>
										)}
									</div>
								</RadioStyled>
								<Divider />
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
										<h5>A budget friendly option</h5>
										{budget === "$5000 - $7000" && (
											<small>
												Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod
												tincidunt ut laoreet dolore magna
											</small>
										)}
									</div>
								</RadioStyled>
								<Divider />
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
										<h5>A budget friendly option</h5>
										{budget === "$10,000 or more" && (
											<small>
												Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod
												tincidunt ut laoreet dolore magna
											</small>
										)}
									</div>
								</RadioStyled>
							</BudgetSelectionStyled>
						</div>
						<div className="col-12 col-sm-7 col-md-8">
							{(budget === "$2000 - $5000" || budget === "") && (
								<Image src="https://res.cloudinary.com/spacejoy/image/upload/v1570180654/web/budget-1_gfb6kj.png" />
							)}
							{budget === "$5000 - $7000" && (
								<Image src="https://res.cloudinary.com/spacejoy/image/upload/v1570183550/web/budget-2_cgrmuu.png" />
							)}
						</div>
						<div className="col-4">
							<Button variant="secondary" shape="flat" fill="ghost" full onClick={handlePrev}>
								<SVGIcon name="left" height={15} width={10} /> Prev
							</Button>
						</div>
						<div className="col-4" />
						<div className="col-4">
							<Button variant="secondary" shape="flat" fill="ghost" full onClick={handleNext}>
								Next <SVGIcon name="right" height={15} width={10} />
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Question2;
