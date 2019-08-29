import Button from "@components/Button";
import Image from "@components/Image";
import Layout from "@components/Layout";
import Head from "next/head";
import React from "react";
import styled from "styled-components";

const HeroWrapperStyled = styled.section`
	padding: 2rem 0;
	background-image: linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%);
`;

const SectionWrapperStyled = styled.section`
	padding: 4rem 0;
`;

const HeroText = styled.h1`
	font-weight: bold;
	font-size: 4rem;
	line-height: 5rem;
	margin-bottom: 0;
`;

const HeroSubText = styled.h2`
	font-family: system;
	font-weight: normal;
	width: 75%;
	font-size: 1.25rem;
`;

const CenterTextStyled = styled.h2`
	text-align: center;
`;
const CenterSubTextStyled = styled.p`
	font-family: system;
	font-weight: normal;
`;

function index() {
	return (
		<Layout header="solid">
			<Head>
				<title>My page title</title>
			</Head>
			<HeroWrapperStyled>
				<div className="container">
					<div className="grid">
						<div className="col-xs-6 align-center align-middle">
							<div>
								<HeroText>
									Home Decor
									<br />
									Made Easy
								</HeroText>
								<HeroSubText>
									Experience the joy of designing your home in 3D using products from brands you can buy immediately!
									<p>Plans starting at 19$</p>
								</HeroSubText>
								<div>
									<Button type="primary" shape="round" size="lg" onClick={() => {}}>
										DESIGN MY SPACE
									</Button>
								</div>
							</div>
						</div>
						<div className="col-xs-6 align-center">
							<Image src="https://res.cloudinary.com/spacejoy/image/upload/v1567069731/web/couch_zwbuzf.png" />
						</div>
					</div>
				</div>
			</HeroWrapperStyled>
			<SectionWrapperStyled style={{ backgroundImage: "linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)" }}>
				<div className="container">
					<div className="grid justify-space-between">
						<div className="col-xs-5 align-center align-middle">
							<div>
								<h2>Get 3D Designs of Your Space</h2>
								<p>Set your budget, share pictures of your room and tell us about your style preferences</p>
								<p>We&lsquo;ll deliver your customized 3D designs in under 5 days, with unlimited revisions </p>
								<p>Ready to transform your home scape?</p>
								<div>
									<Button type="primary" shape="round" size="lg" onClick={() => {}}>
										DESIGN MY SPACE
									</Button>
								</div>
							</div>
						</div>
						<div className="col-xs-6 align-center">
							<Image src="https://storage.googleapis.com/isuite-artifacts/homeWeb2/home/design-top-view.gif" />
						</div>
					</div>
				</div>
			</SectionWrapperStyled>
			<SectionWrapperStyled style={{ backgroundImage: "linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)" }}>
				<div className="container">
					<div className="grid justify-space-between">
						<div className="col-xs-6 align-center">
							<div className="grid">
								<div className="col-xs-6 col-md-3">
									<Image src="https://storage.googleapis.com/isuite-artifacts/homeWeb2/spacejoy/designer4.jpg" />
								</div>
								<div className="col-xs-6 col-md-3">
									<Image src="https://storage.googleapis.com/isuite-artifacts/homeWeb2/spacejoy/Designer5.jpg" />
								</div>
								<div className="col-xs-6 col-md-3">
									<Image src="https://storage.googleapis.com/isuite-artifacts/homeWeb2/spacejoy/Designer1.jpg" />
								</div>
								<div className="col-xs-6 col-md-3">
									<Image src="https://storage.googleapis.com/isuite-artifacts/homeWeb2/spacejoy/Designer3.jpg" />
								</div>
								<div className="col-xs-6 col-md-3">
									<Image src="https://storage.googleapis.com/isuite-artifacts/homeWeb2/spacejoy/Designer2.jpg" />
								</div>
								<div className="col-xs-6 col-md-3">
									<Image src="https://storage.googleapis.com/isuite-artifacts/homeWeb2/spacejoy/Designer0.jpg" />
								</div>
							</div>
						</div>
						<div className="col-xs-5 align-center align-middle">
							<div>
								<h2>Crafted By Our Design Experts</h2>
								<p>Set your budget, share pictures of your room and tell us about your style preferences</p>
								<p>We&lsquo;ll deliver your customized 3D designs in under 5 days, with unlimited revisions </p>
								<p>Ready to transform your home scape?</p>
								<div>
									<Button type="primary" shape="round" size="lg" onClick={() => {}}>
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
					<div className="grid justify-space-between">
						<div className="col-xs-5 align-center align-middle">
							<div>
								<h2>Shop Products From Your Designs</h2>
								<p>Our designs feature products from your favorite brands</p>
								<p>We will work within your budget to find those coveted pieces that spark joy</p>
								<p>It&lsquo;s a hassle-free experience </p>
								<div>
									<Button type="primary" shape="round" size="lg" onClick={() => {}}>
										DESIGN MY SPACE
									</Button>
								</div>
							</div>
						</div>
						<div className="col-xs-6 align-center">
							<Image src="https://res.cloudinary.com/spacejoy/image/upload/v1566975734/web/brand-items_nerkmq.jpg" />
						</div>
					</div>
				</div>
			</SectionWrapperStyled>
			<SectionWrapperStyled
				style={{ backgroundImage: "linear-gradient(to top, #f3e7e9 0%, #e3eeff 99%, #e3eeff 100%)" }}
			>
				<div className="container">
					<div className="grid">
						<div className="col-xs-12">
							<div style={{ textAlign: "center" }}>
								<CenterTextStyled>Doesn&lsquo;t Spark Joy?</CenterTextStyled>
								<CenterSubTextStyled>
									We&lsquo;ll revise your design until it reflects your perfect space Spacejoy designers are here to
									help
								</CenterSubTextStyled>
								<div>
									<Button type="primary" shape="round" size="lg" onClick={() => {}}>
										DESIGN MY SPACE
									</Button>
								</div>
							</div>
						</div>
						<div className="col-xs-12 align-center ">Slider</div>
					</div>
				</div>
			</SectionWrapperStyled>
			<SectionWrapperStyled style={{ backgroundImage: "white" }}>
				<div className="container">
					<div className="grid">
						<div className="col-xs-6 align-center align-middle">
							<div>
								<h2>Customer Delight</h2>
								<p>Design stories straight from our customers</p>
								<p>We&lsquo;ll deliver your customized 3D designs in under 5 days, with unlimited revisions </p>
								<p>Ready to transform your home scape?</p>
								<div>
									<Button type="primary" shape="round" size="lg" onClick={() => {}}>
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
