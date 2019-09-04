import Button from "@components/Button";
import Carousel from "@components/Carousel";
import Image from "@components/Image";
import Layout from "@components/Layout";
import Head from "next/head";
import React from "react";
import styled from "styled-components";

const CarouselCardStyled = styled.div`
	outline: none;
	box-sizing: border-box;
	padding: 0.5rem;
	div {
		background: white;
		padding: 0.5rem;
		box-shadow: 0 0 5px 0px rgba(0, 0, 0, 0.1);
	}
`;

const HeroWrapperStyled = styled.section`
	position: relative;
	background: #a3c6c3
		url("https://res.cloudinary.com/spacejoy/image/upload/c_scale,q_auto:best,w_1600/v1567610998/web/home-banner_ykstrm.jpg");
	background-size: cover;
	background-position: center;
	min-height: 80vh;
	max-height: 90vh;
	height: auto;
	display: flex;
	align-items: center;
	background-attachment: fixed;
`;

const HeroCardStyled = styled.section`
	position: relative;
	padding: 2rem;
	background: white;
	box-shadow: 0 0 5px 0px rgba(0, 0, 0, 0.1);
	border-radius: 2px;
`;

const SectionWrapperStyled = styled.section`
	padding: 4rem 0;
`;

const HeroText = styled.h1`
	font-weight: bold;
	font-size: 3.5rem;
	line-height: 3.5rem;
	margin: 0;
`;

const HeroSubText = styled.h1`
	font-weight: normal;
	font-size: 1.15rem;
	color: ${({ theme }) => theme.colors.fc.dark2};
`;

const CenterTextStyled = styled.h1`
	text-align: center;
`;
const CenterSubTextStyled = styled.p`
	font-weight: normal;
`;

function index() {
	return (
		<Layout header="solid">
			<Head>
				<title>Spacejoy</title>
			</Head>
			<HeroWrapperStyled>
				<div className="container">
					<div className="grid align-content-center">
						<div className="col-lg-4 col-md-6 col-xs-12">
							<HeroCardStyled>
								<HeroText>
									Home Decor
									<br />
									Made Easy
								</HeroText>
								<HeroSubText>
									Experience the joy of designing your home in 3D using products from brands you can buy immediately!
								</HeroSubText>
								<p>
									<strong>Plans starting at 19$</strong>
								</p>
								<div>
									<Button shape="round" size="lg" onClick={() => {}}>
										DESIGN MY SPACE
									</Button>
								</div>
							</HeroCardStyled>
						</div>
					</div>
				</div>
			</HeroWrapperStyled>
			<SectionWrapperStyled style={{ backgroundImage: "linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)" }}>
				<div className="container">
					<div className="grid justify-space-between align-center">
						<div className="col-xs-6">
							<div>
								<h1>Get 3D Designs of Your Space</h1>
								<p>Set your budget, share pictures of your room and tell us about your style preferences</p>
								<p>We&lsquo;ll deliver your customized 3D designs in under 5 days, with unlimited revisions </p>
								<p>Ready to transform your home scape?</p>
								<div>
									<Button shape="round" size="lg" onClick={() => {}}>
										DESIGN MY SPACE
									</Button>
								</div>
							</div>
						</div>
						<div className="col-xs-6">
							<Image src="https://storage.googleapis.com/isuite-artifacts/homeWeb2/home/design-top-view.gif" />
						</div>
					</div>
				</div>
			</SectionWrapperStyled>
			<SectionWrapperStyled style={{ backgroundImage: "linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)" }}>
				<div className="container">
					<div className="grid justify-space-between align-center">
						<div className="col-xs-5">
							<div className="grid">
								<div className="col-xs-3">
									<Image src="https://storage.googleapis.com/isuite-artifacts/homeWeb2/spacejoy/designer4.jpg" />
								</div>
								<div className="col-xs-3">
									<Image src="https://storage.googleapis.com/isuite-artifacts/homeWeb2/spacejoy/Designer5.jpg" />
								</div>
								<div className="col-xs-3">
									<Image src="https://storage.googleapis.com/isuite-artifacts/homeWeb2/spacejoy/Designer1.jpg" />
								</div>
								<div className="col-xs-3">
									<Image src="https://storage.googleapis.com/isuite-artifacts/homeWeb2/spacejoy/Designer3.jpg" />
								</div>
								<div className="col-xs-3">
									<Image src="https://storage.googleapis.com/isuite-artifacts/homeWeb2/spacejoy/Designer2.jpg" />
								</div>
								<div className="col-xs-3">
									<Image src="https://storage.googleapis.com/isuite-artifacts/homeWeb2/spacejoy/Designer0.jpg" />
								</div>
							</div>
						</div>
						<div className="col-xs-5">
							<div>
								<h1>Crafted By Our Design Experts</h1>
								<p>Set your budget, share pictures of your room and tell us about your style preferences</p>
								<p>We&lsquo;ll deliver your customized 3D designs in under 5 days, with unlimited revisions </p>
								<p>Ready to transform your home scape?</p>
								<div>
									<Button shape="round" size="lg" onClick={() => {}}>
										DESIGN MY SPACE
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</SectionWrapperStyled>
			<SectionWrapperStyled style={{ backgroundImage: "white" }}>
				<div className="container">
					<div className="grid justify-space-between align-center">
						<div className="col-xs-6">
							<div>
								<h1>Shop Products From Your Designs</h1>
								<p>Our designs feature products from your favorite brands</p>
								<p>We will work within your budget to find those coveted pieces that spark joy</p>
								<p>It&lsquo;s a hassle-free experience </p>
								<div>
									<Button shape="round" size="lg" onClick={() => {}}>
										DESIGN MY SPACE
									</Button>
								</div>
							</div>
						</div>
						<div className="col-xs-6 ">
							<Image src="https://res.cloudinary.com/spacejoy/image/upload/v1566975734/web/brand-items_nerkmq.jpg" />
						</div>
					</div>
				</div>
			</SectionWrapperStyled>
			<SectionWrapperStyled
				style={{ backgroundImage: "linear-gradient(to top, #f3e7e9 0%, #e3eeff 99%, #e3eeff 100%)" }}
			>
				<div className="container">
					<div className="grid justify-space-between align-center">
						<div className="col-xs-12">
							<div style={{ textAlign: "center" }}>
								<CenterTextStyled>Doesn&lsquo;t Spark Joy?</CenterTextStyled>
								<CenterSubTextStyled>
									We&lsquo;ll revise your design until it reflects your perfect space Spacejoy designers are here to
									help
								</CenterSubTextStyled>
								<Carousel>
									{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, i) => (
										<CarouselCardStyled key={Math.random()}>
											<div>
												<Image src={`https://picsum.photos/id/${i + 1}/400/250`} />
												<h4>Susan&apos;s Living Room</h4>
											</div>
										</CarouselCardStyled>
									))}
								</Carousel>
								<div>
									<Button shape="round" size="lg" onClick={() => {}}>
										DESIGN MY SPACE
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</SectionWrapperStyled>
			<SectionWrapperStyled style={{ backgroundImage: "white" }}>
				<div className="container">
					<div className="grid justify-space-between align-center">
						<div className="col-xs-6">
							<div>
								<h1>Customer Delight</h1>
								<p>Design stories straight from our customers</p>
								<p>We&lsquo;ll deliver your customized 3D designs in under 5 days, with unlimited revisions </p>
								<p>Ready to transform your home scape?</p>
								<div>
									<Button shape="round" size="lg" onClick={() => {}}>
										DESIGN MY SPACE
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</SectionWrapperStyled>
		</Layout>
	);
}

export default index;
