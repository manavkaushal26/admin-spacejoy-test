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
	font-size: 3.5rem;
	line-height: 4rem;
	margin: 0;
	@media (max-width: 400px) {
		font-size: 2.5rem;
		line-height: 3rem;
	}
`;

const HeroSubText = styled.h3`
	font-weight: normal;
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
								Home Designs
								<br />
								Made Easy
							</HeroText>
							<HeroSubText>
								Experience the joy of designing your home in 3D using products from brands you can buy immediately!
							</HeroSubText>
							<h4>Plans starting at $19</h4>
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
