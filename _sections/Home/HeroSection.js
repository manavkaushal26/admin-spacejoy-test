import Button from "@components/Button";
import Image from "@components/Image";
import SVGIcon from "@components/SVGIcon";
import { redirectToLocation } from "@utils/auth";
import Link from "next/link";
import React from "react";
import styled from "styled-components";

const HeroWrapperStyled = styled.section`
	display: flex;
	align-items: center;
	min-height: calc(100vh - 238px);
`;

const HeroCardStyled = styled.section`
	position: relative;
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
			background: url("https://images.unsplash.com/photo-1490049350474-498de43bc885?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2026&q=80")
				50% 50%;
			background-size: 200px;
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
			background-attachment: fixed;
		}
	}
	@media (max-width: 400px) {
		font-size: 2.5rem;
		line-height: 3rem;
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
		url: "/designMySpace?quiz=start"
	});
}

export default function HeroSection() {
	return (
		<HeroWrapperStyled>
			<div className="container">
				<div className="grid align-center">
					<div className="col-lg-4 col-md-6 col-xs-12">
						<HeroCardStyled>
							<HeroText>
								<span>Designing Your</span>
								<span>Imagination</span>
							</HeroText>
							<HeroSubText>
								Show us your room and let us design it for you in our 3D App. Within your budget, with your style and
								with products you can buy
							</HeroSubText>
							<Button variant="primary" shape="rounded" size="lg" onClick={handleClick}>
								DESIGN MY SPACE NOW <SVGIcon name="right" width={20} fill="white" />
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
							<div className="col-6">
								<Image
									full
									src="https://res.cloudinary.com/spacejoy/image/upload/c_scale,q_100,w_393/v1570089310/web/home-page-image_xvpuyb.jpg"
								/>
							</div>
							<div className="col-6">
								<Image
									full
									src="https://res.cloudinary.com/spacejoy/image/upload/c_scale,h_252,w_392/v1569939505/web/kidsroom_xdr5ym.jpg"
								/>
								<Image
									style={{ marginTop: "30px" }}
									full
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
