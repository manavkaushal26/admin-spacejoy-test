import Button from "@components/Button";
import Image from "@components/Image";
import { redirectToLocation } from "@utils/auth";
import { company } from "@utils/config";
import React from "react";
import styled from "styled-components";
import SectionHeader from "./SectionHeader";

const SectionWrapper = styled.section`
	position: relative;
	background: url("https://res.cloudinary.com/spacejoy/image/upload/c_scale,w_1900/v1570708989/web/bg_ubxash.jpg")
		no-repeat center;
	background-size: cover;
	background-attachment: fixed;
	padding: 100px 0;
	max-height: 400px;
	box-shadow: 0px 3px 10px 0 rgba(0, 0, 0, 0.5) inset;
	&:after {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: ${({ theme }) => theme.colors.mild.black};
	}
	@media (max-width: 576px) {
		max-height: 100%;
		padding: 2rem 0;
	}
`;

const StepWrapperStyled = styled.div`
	position: relative;
	z-index: 1;
	background-color: ${({ theme }) => theme.colors.white};
	padding: 5rem 0 0 0;
	border-radius: 2px;
	border: 1px solid ${({ theme }) => theme.colors.bg.dark2};
	box-shadow: 0 0 10px 0px ${({ theme }) => theme.colors.mild.black};
`;

const StepStyled = styled.div`
	width: 70%;
	margin: auto;
	@media (max-width: 900px) {
		width: 100%;
	}
	h3 {
		margin-top: 2rem;
		font-family: inherit;
	}
	p {
		color: ${({ theme }) => theme.colors.fc.dark2};
	}
`;

const FillerStyled = styled.div`
	height: 250px;
	background: ${({ theme }) => theme.colors.mild.yellow};
	@media (max-width: 576px) {
		height: 0px;
		display: none;
	}
`;

function handleClick() {
	if (process.env.NODE_ENV === "production") {
		return redirectToLocation({
			pathname: "/designMySpace",
			query: {},
			url: "/designMySpace"
		});
	}
	return redirectToLocation({
		pathname: "/designMySpace",
		query: { quiz: "start", plan: "free" },
		url: "/designMySpace?quiz=start"
	});
}

function HowSteps() {
	return (
		<>
			<SectionWrapper>
				<div className="container">
					<div className="grid text-center">
						<div className="col-12">
							<StepWrapperStyled>
								<div className="container">
									<SectionHeader title={`What is ${company.product}`} />
									<div className="grid">
										<div className="col-12 col-md-4">
											<StepStyled>
												<Image
													src="https://res.cloudinary.com/spacejoy/image/upload/v1571047876/web/Tool_e7tcsv.svg"
													size="70px"
												/>
												<h3>Our designers weave magic</h3>
												<p>Our designers will present two designs in 3D based on your needs, budget and style.</p>
											</StepStyled>
										</div>
										<div className="col-12 col-md-4">
											<StepStyled>
												<Image
													src="https://res.cloudinary.com/spacejoy/image/upload/v1571047877/web/Computer_wsgn1u.svg"
													size="70px"
												/>
												<h3>Imagine more with our App</h3>
												<p>With our interactive 3D mobile App, move, swap, rotate products - anytime and anywhere</p>
											</StepStyled>
										</div>
										<div className="col-12 col-md-4">
											<StepStyled>
												<Image
													src="https://res.cloudinary.com/spacejoy/image/upload/v1571054616/web/Forklift_icon_l3zi2w.svg"
													size="70px"
												/>
												<h3>Shop from your designs</h3>
												<p>Use the App to shop for furniture & décor that we include in your designs.</p>
											</StepStyled>
										</div>
										<div className="col-12">
											<Button
												variant="primary"
												size="lg"
												onClick={handleClick}
												style={{ position: "relative", bottom: "-2rem" }}
												action="StartFreeTrial"
												label="WhatIsSpacejoy"
												event="FreeTrial Clicked"
												data={{ sectionName: "WhatIsSpacejoy" }}
											>
												Start your free trial
											</Button>
										</div>
									</div>
								</div>
							</StepWrapperStyled>
						</div>
					</div>
				</div>
			</SectionWrapper>
			<FillerStyled />
		</>
	);
}

export default HowSteps;
