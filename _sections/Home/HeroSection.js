import Image from "@components/Image";
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
		&:last-child {
			font-family: "Airbnb Cereal App Medium";
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

function HeroSection() {
	return (
		<HeroWrapperStyled>
			<div className="container">
				<div className="grid align-center">
					<div className="col-lg-4 col-md-6 col-xs-12">
						<HeroCardStyled>
							<HeroText>
								<span>Admin</span>
								<span>like a</span>
								<TextLoop mask>
									<span>Owner</span>
									<span>Designer</span>
									<span>Manager</span>
									<span>Developer</span>
								</TextLoop>
							</HeroText>
							<HeroSubText>Login to do what you do.</HeroSubText>
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
