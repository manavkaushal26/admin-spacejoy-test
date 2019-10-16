import Button from "@components/Button";
import Image from "@components/Image";
import SVGIcon from "@components/SVGIcon";
import { redirectToLocation } from "@utils/auth";
import Link from "next/link";
import React from "react";
import TextLoop from "react-text-loop";
import styled from "styled-components";

const HeroWrapperStyled = styled.section`
	display: flex;
	align-items: center;
	min-height: calc(100vh - 238px);
`;

const HeroCardStyled = styled.section`
	position: relative;
	@media (max-width: 576px) {
		margin: 10rem 0;
	}
`;

const HeroText = styled.h1`
	font-size: 3rem;
	line-height: 3.75rem;
	margin: 0;
	font-family: inherit;
	span {
		display: block;
		&:last-child {
			font-family: "Airbnb Cereal App Medium";
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
	}
`;

const HeroSubText = styled.h4`
	font-weight: normal;
	font-family: inherit;
	width: 80%;
	color: ${({ theme }) => theme.colors.fc.dark2};
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
		url: "/designMySpace?quiz=start&plan=free"
	});
}

function HeroSection() {
	return (
		<HeroWrapperStyled>
			<div className="container">
				<div className="grid align-center">
					<div className="col-lg-4 col-md-6 col-xs-12">
						<HeroCardStyled>
							<HeroText>
								<span>Designing Your</span>
								<TextLoop mask>
									<span>Imagination</span>
									<span>Living Room</span>
									<span>Studio Room</span>
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
							<Button
								variant="primary"
								shape="rounded"
								size="lg"
								onClick={handleClick}
								action="StartFreeTrial"
								label="FirstHomeScreen"
								event="FreeTrial Clicked"
								data={{ sectionName: "HeroSection" }}
							>
								Start Your Free Trial <SVGIcon name="right" width={20} fill="white" />
							</Button>
							<Link href={{ pathname: "/designProjects" }} as="/designProjects">
								<a href="/designProjects">
									<p>Explore stunning design layouts</p>
								</a>
							</Link>
						</HeroCardStyled>
					</div>
					<div className="col-12 col-md-8">
						<div className="grid">
							<div className="col-12 col-xs-6">
								<Image
									width="100%"
									src="https://res.cloudinary.com/spacejoy/image/upload/c_scale,q_100,w_393/v1570089310/web/home-page-image_xvpuyb.jpg"
								/>
							</div>
							<div className="col-12 col-xs-6">
								<Image
									width="100%"
									src="https://res.cloudinary.com/spacejoy/image/upload/c_scale,h_252,w_392/v1569939505/web/kidsroom_xdr5ym.jpg"
								/>
								<Image
									style={{ marginTop: "30px" }}
									width="100%"
									src="https://res.cloudinary.com/spacejoy/image/upload/c_scale,h_252,w_392/v1569939669/web/bedroom_s99hp2.jpg"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</HeroWrapperStyled>
	);
}

export default HeroSection;
