import Button from "@components/Button";
import Image from "@components/Image";
import CTA from "@sections/CTA";
import Link from "next/link";
import React from "react";
import TextLoop from "react-text-loop";
import styled from "styled-components";

const HeroWrapperStyled = styled.section`
	display: flex;
	align-items: center;
	min-height: calc(100vh - 270px);
	margin-bottom: 2rem;
`;

const StackImageStyled = styled.div`
	img:nth-child(2) {
		margin-top: 2rem;
	}
	@media (max-width: 576px) {
		img:nth-child(2) {
			margin-top: 1rem;
		}
	}
`;

const HeroCardStyled = styled.section`
	position: relative;
	@media (max-width: 576px) {
		margin: 3rem 0;
	}
`;

const HeroText = styled.h1`
	font-size: 3rem;
	line-height: 3.75rem;
	font-family: inherit;
	span {
		display: block;
		margin-right: 1rem;
		font-family: "Airbnb Cereal App Medium";
		&:last-child {
			background: url("https://res.cloudinary.com/spacejoy/image/upload/v1570798848/web/colors_amte5j.jpg") 50% 50%;
			background-size: 200px;
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
			background-attachment: fixed;
		}
	}
	@media (max-width: 576px) {
		font-size: 3.5rem;
		line-height: 4rem;
		span {
			display: block;
		}
	}
`;

const HeroSubText = styled.h4`
	font-weight: normal;
	font-family: inherit;
	width: 80%;
	color: ${({ theme }) => theme.colors.fc.dark2};
`;

const HeroBottomText = styled.small`
	display: block;
	margin-top: 2em;
	width: 80%;
	color: ${({ theme }) => theme.colors.fc.dark2};
`;

function HeroSection() {
	return (
		<HeroWrapperStyled>
			<div className="container">
				<div className="grid align-center">
					<div className="col-lg-4 col-md-6 col-xs-12">
						<HeroCardStyled>
							<HeroText>
								<span>Designing</span>
								<span>Your</span>
								<TextLoop mask>
									<span>Imagination</span>
									<span>Living Room</span>
									<span>Studio</span>
									<span>Bedroom</span>
									<span>Kid&apos;s Room</span>
									<span>Entryway</span>
									<span>Nursery</span>
								</TextLoop>
							</HeroText>
							<HeroSubText>
								Show us your room and let us design it for you in our 3D App. Within your budget, in your style and with
								products you can buy
							</HeroSubText>
							<CTA
								variant="primary"
								shape="rounded"
								size="lg"
								action="StartFreeTrial"
								label="FirstHomeScreen"
								event="StartFreeTrial"
								data={{ sectionName: "FirstHomeScreen" }}
							/>
							<Link href={{ pathname: "/designProjects" }} as="/designProjects">
								<a href="/designProjects">
									<Button
										fill="ghost"
										shape="rounded"
										size="lg"
										action="ExploreDesigns"
										label="FirstHomeScreen"
										event="ExploreDesigns"
										data={{ sectionName: "FirstHomeScreen" }}
										style={{ marginTop: "2rem" }}
									>
										See Our Design Projects
									</Button>
								</a>
							</Link>
							<HeroBottomText>
								Your first room design is on us. <br />
								No credit card needed. No charges applied .
							</HeroBottomText>
						</HeroCardStyled>
					</div>
					<div className="col-12 col-md-8">
						<div className="grid">
							<div className="col-6">
								<Image
									shape="rounded"
									width="100%"
									src="https://res.cloudinary.com/spacejoy/image/upload/c_scale,q_100,h_550,w_393/v1570089310/web/home-page-image_xvpuyb.jpg"
									nolazy
								/>
							</div>
							<div className="col-6">
								<StackImageStyled>
									<Image
										shape="rounded"
										width="100%"
										src="https://res.cloudinary.com/spacejoy/image/upload/c_scale,h_262,w_392/v1569939505/web/kidsroom_xdr5ym.jpg"
										nolazy
									/>
									<Image
										shape="rounded"
										width="100%"
										src="https://res.cloudinary.com/spacejoy/image/upload/c_scale,h_262,w_392/v1569939669/web/bedroom_s99hp2.jpg"
										nolazy
									/>
								</StackImageStyled>
							</div>
						</div>
					</div>
				</div>
			</div>
		</HeroWrapperStyled>
	);
}

export default HeroSection;
