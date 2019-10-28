import Button from "@components/Button";
import Image from "@components/Image";
import Stepper from "@components/Stepper";
import SVGIcon from "@components/SVGIcon";
import React, { useState } from "react";
import styled from "styled-components";
import SectionHeader from "./SectionHeader";

const SectionWrapper = styled.section`
	position: relative;
	background-image: ${({ theme }) => `linear-gradient(180deg, white, ${theme.colors.bg.light1})`};
	padding: 100px 0;
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
						<Stepper>
							<Stepper.Step
								title="1"
								description="Set your budget & style"
								isActive={slideActive <= 3}
								onClick={() => handleStepClick(1)}
							/>
							<Stepper.Step
								title="2"
								description="Get designs & revise"
								isActive={slideActive > 1 && slideActive <= 3}
								onClick={() => handleStepClick(2)}
							/>
							<Stepper.Step
								title="3"
								description="Shop from your designs"
								isActive={slideActive === 3}
								onClick={() => handleStepClick(3)}
							/>
						</Stepper>
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
									action="Step1SytleBudget"
									label="HowWeDoIt"
									event="Step1SytleBudget"
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
									action="Step2DesignRevise"
									label="HowWeDoIt"
									event="Step2DesignRevise"
									data={{ sectionName: "HowWeDoIt" }}
								>
									GO STEP 3 <SVGIcon name="arrow-right" height={6} width={10} />
								</Button>
							</StepDescriptionStyled>
						</div>
						<div className="col-12 col-xs-5">
							<Image
								src="https://res.cloudinary.com/spacejoy/image/upload/c_scale,q_100,h_400/v1571136682/web/Get_designs_revivse_2x_tfkfi3.png"
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
									action="Step3Shop"
									label="HowWeDoIt"
									event="Step3Shop"
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
