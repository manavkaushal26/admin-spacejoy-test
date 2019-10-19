import Button from "@components/Button";
import Image from "@components/Image";
import SVGIcon from "@components/SVGIcon";
import React, { useState } from "react";
import styled from "styled-components";
import SectionHeader from "./SectionHeader";

const SectionWrapper = styled.section`
	position: relative;
	background-image: ${({ theme }) => `linear-gradient(180deg, white, ${theme.colors.bg.light1})`};
	padding: 100px 0;
`;

const StepperWrapper = styled.div`
	margin: 1rem 0;
	border-radius: 5px;
	padding: 1rem 0;
	display: flex;
	background: ${({ theme }) => theme.colors.mild.red};
`;

const StepTitle = styled.span`
	margin-top: 0.5rem;
	display: inline-block;
	font-family: inherit;
	font-size: 0.8em;
`;

const StepCount = styled.div`
	cursor: pointer;
	position: relative;
	height: 20px;
	width: 70px;
	line-height: 29px;
	margin: auto;
	z-index: 1;
	&.active {
		color: ${({ theme }) => theme.colors.accent};
		font-weight: bold;
		&:after,
		&:before {
			border-top: 1px solid ${({ theme }) => theme.colors.accent};
		}
		& + {
			${StepTitle} {
				color: ${({ theme }) => theme.colors.accent};
			}
		}
	}
	&:after,
	&:before {
		content: "";
		position: absolute;
		top: 14px;
		width: 100px;
		border-top: 1px dashed ${({ theme }) => theme.colors.bg.dark1};
	}
	&:before {
		right: -100px;
	}
	&:after {
		left: -100px;
	}
`;

const StepBlock = styled.div`
	overflow: hidden;
	flex: 1;
	&:first-child {
		${StepCount} {
			&:after {
				display: none;
			}
		}
	}
	&:last-child {
		${StepCount} {
			&:before {
				display: none;
			}
		}
	}
`;

const StepSlideStyled = styled.div`
	display: ${({ active }) => (active ? "block" : "none")};
	margin-bottom: 2rem;
`;

const StepDescriptionStyled = styled.div`
	position: relative;
	padding-left: 2rem;
	span {
		position: absolute;
		top: 0;
		left: 0;
		color: ${({ theme }) => theme.colors.mild.black};
		line-height: 0px;
		font-size: 10rem;
		font-weight: bold;
		font-family: "Airbnb Cereal App Medium";
	}
	p {
		color: ${({ theme }) => theme.colors.fc.dark2};
	}
`;

function HowWeDoIt() {
	const [slideActive, setSlideActive] = useState(1);

	const handleStepClick = step => setSlideActive(step);

	return (
		<SectionWrapper>
			<div className="container">
				<SectionHeader
					title="How does Spacejoy work?"
					description="Start your free trial. Get a glimpse of the magic we’ll make with your space. Upgrade when you love what you see."
				/>
				<div className="grid align-center text-center">
					<div className="col-12 col-xs-6">
						<StepperWrapper>
							<StepBlock>
								<StepCount className="active" onClick={() => handleStepClick(1)}>
									1
								</StepCount>
								<StepTitle>Set your budget & style</StepTitle>
							</StepBlock>
							<StepBlock>
								<StepCount
									className={slideActive > 1 && slideActive <= 3 ? "active" : ""}
									onClick={() => handleStepClick(2)}
								>
									2
								</StepCount>
								<StepTitle>Get designs & revise</StepTitle>
							</StepBlock>
							<StepBlock>
								<StepCount className={slideActive === 3 ? "active" : ""} onClick={() => handleStepClick(3)}>
									3
								</StepCount>
								<StepTitle>Shop from your designs</StepTitle>
							</StepBlock>
						</StepperWrapper>
					</div>
				</div>
				<StepSlideStyled active={slideActive === 1}>
					<div className="grid align-center justify-space-around">
						<div className="col-12 col-xs-4">
							<StepDescriptionStyled>
								<span>1</span>
								<h2>Set your budget & style</h2>
								<p>
									Start your free trial by uploading images of your room. Set your budget, tell us about your
									requirements and most of all, your unique style and taste
								</p>
								<Button
									variant="ghost"
									fill="ghost"
									size="xs"
									onClick={() => handleStepClick(2)}
									action="HowWeDoItStep2"
									label="HowWeDoIt"
									event="HowWeDoItStep2"
									data={{ sectionName: "HowWeDoIt" }}
								>
									GO STEP 2 <SVGIcon name="arrow-right" height={6} width={10} />
								</Button>
							</StepDescriptionStyled>
						</div>
						<div className="col-12 col-xs-5">
							<Image
								src="https://res.cloudinary.com/spacejoy/image/upload/c_scale,q_100,h_400/w_650/v1570619193/web/step-1_s3ljeg.png"
								width="100%"
							/>
						</div>
					</div>
				</StepSlideStyled>
				<StepSlideStyled active={slideActive === 2}>
					<div className="grid align-center justify-space-around">
						<div className="col-12 col-xs-4">
							<StepDescriptionStyled>
								<span>2</span>
								<h2>Get designs & revise</h2>
								<p>
									For starters, our designers will present 2 designs which you can explore in 3D. Love what you see?
									Edit with ease on our interactive app and finalize your design
								</p>
								<Button
									variant="ghost"
									fill="ghost"
									size="xs"
									onClick={() => handleStepClick(3)}
									action="HowWeDoItStep3"
									label="HowWeDoIt"
									event="HowWeDoItStep3"
									data={{ sectionName: "HowWeDoIt" }}
								>
									GO STEP 3 <SVGIcon name="arrow-right" height={6} width={10} />
								</Button>
							</StepDescriptionStyled>
						</div>
						<div className="col-12 col-xs-5">
							<Image
								src="https://res.cloudinary.com/spacejoy/image/upload/c_scale,q_100,h_400/v1571293665/web/Get_designs_revise_2x_bcv526.png"
								width="100%"
							/>
						</div>
					</div>
				</StepSlideStyled>
				<StepSlideStyled active={slideActive === 3}>
					<div className="grid align-center justify-space-around">
						<div className="col-12 col-xs-4">
							<StepDescriptionStyled>
								<span>3</span>
								<h2>Shop from your designs</h2>
								<p>
									Shop the products you love, directly from your designs. We will find you the best deals on furniture
									and decor from all your favorite brands
								</p>
								<Button
									variant="ghost"
									fill="ghost"
									size="xs"
									onClick={() => handleStepClick(1)}
									action="HowWeDoItRepeat"
									label="HowWeDoIt"
									event="HowWeDoItRepeat"
									data={{ sectionName: "HowWeDoIt" }}
								>
									Repeat! Go Step 1
								</Button>
							</StepDescriptionStyled>
						</div>
						<div className="col-12 col-xs-5">
							<Image
								src="https://res.cloudinary.com/spacejoy/image/upload/c_scale,q_100,h_400/v1571136682/web/Shop_with_your_designs_2x_jidkom.png"
								width="100%"
							/>
						</div>
					</div>
				</StepSlideStyled>
			</div>
		</SectionWrapper>
	);
}

export default HowWeDoIt;
