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
													src="https://res.cloudinary.com/spacejoy/image/upload/v1570714758/web/blueprint_zawtzn.svg"
													size="70px"
												/>
												<h3>Our designers weave magic in your room</h3>
												<p>Our designers will present two designs in 3D based on your needs, budget and style.</p>
											</StepStyled>
										</div>
										<div className="col-12 col-md-4">
											<StepStyled>
												<Image
													src="https://res.cloudinary.com/spacejoy/image/upload/v1570621975/web/design_iqvcxi.svg"
													size="70px"
												/>
												<h3>There’s room for your imagination</h3>
												<p>With our interactive 3D mobile app, move, swap, rotate décor- anytime and anywhere.</p>
											</StepStyled>
										</div>
										<div className="col-12 col-md-4">
											<StepStyled>
												<Image
													src="https://res.cloudinary.com/spacejoy/image/upload/v1570621975/web/cart_cdixtm.svg"
													size="70px"
												/>
												<h3>Shopping for what you love is easy</h3>
												<p>
													Shop immediately for the furniture and décor that we use for your designs- all within your
													budget and style.
												</p>
											</StepStyled>
										</div>
										<div className="col-12">
											<Button
												variant="primary"
												size="lg"
												onClick={handleClick}
												style={{ position: "relative", bottom: "-2rem" }}
											>
												START YOUR FREE TRIAL
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
