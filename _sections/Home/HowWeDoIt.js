import Button from "@components/Button";
import Image from "@components/Image";
import React, { useState } from "react";
import styled from "styled-components";
import SectionHeader from "./SectionHeader";

const SectionWrapper = styled.section`
	position: relative;
	background-image: ${({ theme }) => `linear-gradient(180deg, white, ${theme.colors.bg.light1})`};
	padding: 40px 0;
`;

const StepperWrapper = styled.div`
	margin: 2rem 0;
	display: flex;
`;

const StepCount = styled.div`
	position: relative;
	border: 1px solid ${({ theme }) => theme.colors.bg.dark2};
	background: white;
	border-radius: 15px;
	height: 30px;
	width: 30px;
	line-height: 29px;
	margin: auto;
	z-index: 1;
	&.active {
		border: 1px solid ${({ theme }) => theme.colors.accent};
		background: ${({ theme }) => theme.colors.accent};
		color: ${({ theme }) => theme.colors.white};
		&:after,
		&:before {
			border-color: ${({ theme }) => theme.colors.accent};
		}
	}
	&:after,
	&:before {
		content: "";
		position: absolute;
		top: 13px;
		width: 100px;
		border-top: 1px solid ${({ theme }) => theme.colors.bg.dark2};
	}
	&:before {
		right: -100px;
	}
	&:after {
		left: -100px;
	}
`;

const StepBlock = styled.div`
	flex: 1;
	color: ${({ theme }) => theme.colors.fc.dark3};
	&:first-child {
		${StepCount} {
			&:after {
				border: none;
			}
		}
	}
	&:last-child {
		${StepCount} {
			&:before {
				border: none;
			}
		}
	}
`;

const StepTitle = styled.h5`
	margin: 0.5rem 0;
	font-family: inherit;
`;

const StepSlideStyled = styled.div`
	display: ${({ active }) => (active ? "block" : "none")};
	margin-bottom: 2rem;
	span,
	p {
		color: ${({ theme }) => theme.colors.fc.dark2};
	}
`;

function HowWeDoIt() {
	const [slideActive, setSlideActive] = useState(1);

	const handleClick = step => setSlideActive(step);

	return (
		<SectionWrapper>
			<div className="container">
				<SectionHeader
					title="How we do it"
					description="Get your room designed in 3D by designers. Get a glimpse of what it can look like. Upgrade to get access to the design and the shopping list in our App, Make/Request Changes, finalize a design and shop"
				/>
				<div className="grid align-center text-center">
					<div className="col-6">
						<StepperWrapper>
							<StepBlock>
								<StepCount className="active" onClick={() => handleClick(1)}>
									1
								</StepCount>
								<StepTitle>Set your budget & style</StepTitle>
							</StepBlock>
							<StepBlock>
								<StepCount
									className={slideActive > 1 && slideActive <= 3 ? "active" : ""}
									onClick={() => handleClick(2)}
								>
									2
								</StepCount>
								<StepTitle>Get designs & revise</StepTitle>
							</StepBlock>
							<StepBlock>
								<StepCount className={slideActive === 3 ? "active" : ""} onClick={() => handleClick(3)}>
									3
								</StepCount>
								<StepTitle>Shop from your designs</StepTitle>
							</StepBlock>
						</StepperWrapper>
					</div>
				</div>
				<StepSlideStyled active={slideActive === 1}>
					<div className="grid align-center justify-space-around">
						<div className="col-4">
							<span>01</span>
							<h2>Set your budget & style</h2>
							<p>
								Start your free trial by uploading images of your room and tell us your budget, your requirements and
								most of all, your unique style and taste
							</p>
						</div>
						<div className="col-5">
							<Image
								src="https://res.cloudinary.com/spacejoy/image/upload/w_650/v1570619193/web/step-1_s3ljeg.png"
								full
							/>
						</div>
					</div>
				</StepSlideStyled>
				<StepSlideStyled active={slideActive === 2}>
					<div className="grid align-center justify-space-around">
						<div className="col-4">
							<span>02</span>
							<h2>Get designs & revise</h2>
							<p>
								Lorem ipsum dolor, sit amet consectetur adipisicing elit. Maxime eum mollitia architecto error cumque
								ea. Cum sint consectetur voluptatem velit aut commodi voluptates dolorem, hic soluta sunt at,
								consequatur assumenda!
							</p>
						</div>
						<div className="col-5">
							<Image
								src="https://res.cloudinary.com/spacejoy/image/upload/w_650/v1570619193/web/step-1_s3ljeg.png"
								full
							/>
						</div>
					</div>
				</StepSlideStyled>
				<StepSlideStyled active={slideActive === 3}>
					<div className="grid align-center justify-space-around">
						<div className="col-4">
							<span>03</span>
							<h2>Shop from your designs</h2>
							<p>
								Lorem ipsum dolor, sit amet consectetur adipisicing elit. Maxime eum mollitia architecto error cumque
								ea. Cum sint consectetur voluptatem velit aut commodi voluptates dolorem, hic soluta sunt at,
								consequatur assumenda!
							</p>
						</div>
						<div className="col-5">
							<Image
								src="https://res.cloudinary.com/spacejoy/image/upload/w_650/v1570619193/web/step-1_s3ljeg.png"
								full
							/>
						</div>
					</div>
				</StepSlideStyled>
				<div className="grid align-center text-center">
					<Button fill="ghost">How it works</Button>
				</div>
			</div>
		</SectionWrapper>
	);
}

export default HowWeDoIt;
