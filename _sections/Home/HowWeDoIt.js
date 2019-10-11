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
	margin: 1rem 0;
	display: flex;
`;

const StepTitle = styled.span`
	margin: 0.5rem 0;
	display: inline-block;
	font-family: inherit;
`;

const StepCount = styled.div`
	cursor: pointer;
	position: relative;
	border: 1px solid ${({ theme }) => theme.colors.bg.dark2};
	background: white;
	border-radius: 15px;
	height: 30px;
	width: 70px;
	line-height: 29px;
	margin: auto;
	z-index: 1;
	&.active {
		border: 1px solid ${({ theme }) => theme.colors.accent};
		background: ${({ theme }) => theme.colors.accent};
		color: ${({ theme }) => theme.colors.white};
		&:after,
		&:before {
			background: ${({ theme }) => theme.colors.accent};
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
		top: 13px;
		width: 100px;
		height: 1px;
		background: ${({ theme }) => theme.colors.bg.dark2};
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
					<div className="col-12 col-xs-6">
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
						<div className="col-12 col-xs-4">
							<span>01</span>
							<h2>Set your budget & style</h2>
							<p>
								Start your free trial by uploading images of your room and tell us your budget, your requirements and
								most of all, your unique style and taste
							</p>
						</div>
						<div className="col-12 col-xs-5">
							<Image
								src="https://res.cloudinary.com/spacejoy/image/upload/w_650/v1570619193/web/step-1_s3ljeg.png"
								full
							/>
						</div>
					</div>
				</StepSlideStyled>
				<StepSlideStyled active={slideActive === 2}>
					<div className="grid align-center justify-space-around">
						<div className="col-12 col-xs-4">
							<span>02</span>
							<h2>Get designs & revise</h2>
							<p>
								Our designers will then present two designs which you can explore in 3D. Work with our designers and
								edit with ease on our interactive app to finalise your design
							</p>
						</div>
						<div className="col-12 col-xs-5">
							<Image
								src="https://res.cloudinary.com/spacejoy/image/upload/w_650/v1570619193/web/step-1_s3ljeg.png"
								full
							/>
						</div>
					</div>
				</StepSlideStyled>
				<StepSlideStyled active={slideActive === 3}>
					<div className="grid align-center justify-space-around">
						<div className="col-12 col-xs-4">
							<span>03</span>
							<h2>Shop from your designs</h2>
							<p>
								Shop for what you love, directly from your designs. We will find you the best deals for furniture and
								decor products from your favorite brands.
							</p>
						</div>
						<div className="col-12 col-xs-5">
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
