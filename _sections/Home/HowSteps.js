import Button from "@components/Button";
import Image from "@components/Image";
import { redirectToLocation } from "@utils/auth";
import { company } from "@utils/config";
import React from "react";
import styled from "styled-components";

const FillerStyled = styled.div`
	height: 200px;
`;

const SectionWrapper = styled.div`
	position: relative;
	background: url("https://res.cloudinary.com/spacejoy/image/upload/v1569620131/web/pink-sofa_hp7wvg.jpg") no-repeat
		center;
	background-size: cover;
	background-attachment: fixed;
	box-shadow: 0 0 10px 0px ${({ theme }) => theme.colors.mild.black} inset;
	padding: 100px 0;
	max-height: 400px;
	&:after {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.05);
	}
`;

const StepWrapperStyled = styled.div`
	position: relative;
	z-index: 1;
	background-color: ${({ theme }) => theme.colors.bg.light1};
	padding: 5rem 0 0 0;
	border-radius: 2px;
	border: 1px solid ${({ theme }) => theme.colors.bg.dark2};
	box-shadow: 0 0 10px 0px ${({ theme }) => theme.colors.mild.black};
	h2 {
		margin-bottom: 2rem;
	}
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
			{" "}
			<SectionWrapper>
				<div className="container">
					<div className="grid text-center">
						<div className="col-12">
							<StepWrapperStyled>
								<div className="container">
									<div className="grid">
										<div className="col-12">
											<h2>What is {company.product}</h2>
										</div>
										<div className="col-12 col-md-4">
											<StepStyled>
												<Image
													src="https://res.cloudinary.com/spacejoy/image/upload/v1570621975/web/scale_xwrm9r.svg"
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
												shape="rounded"
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
