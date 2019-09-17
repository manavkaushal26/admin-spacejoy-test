import Button from "@components/Button";
import Carousel from "@components/Carousel";
import Image from "@components/Image";
import Layout from "@sections/Layout";
import { company } from "@utils/config";
import MockData from "@utils/designConceptsMock";
import IndexPageMeta from "@utils/meta";
import Head from "next/head";
import Router from "next/router";
import React from "react";
import styled from "styled-components";

const CarouselCardStyled = styled.div`
	outline: none;
	box-sizing: border-box;
	padding: 1rem;
`;

const HeroWrapperStyled = styled.section`
	position: relative;
	background: #a3c6c3 url("https://res.cloudinary.com/spacejoy/image/upload/v1568742399/web/home-banner_ox5h3w.jpg");
	background-size: cover;
	background-position: center 100%;
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
	border-radius: 5px;
`;

const SectionWrapperStyled = styled.section`
	padding: 3rem 0;
	h1 {
		font-size: 2.5rem;
	}
	p {
		font-size: 1.15rem;
	}
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

function goToDesignMySpace() {
	Router.push("/designMySpace");
}

function index() {
	return (
		<Layout header="solid">
			<Head>
				{IndexPageMeta}
				<title>Home | {company.product}</title>
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
									<Button type="primary" shape="round" size="md" onClick={goToDesignMySpace}>
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
								<p>Set your budget, share pictures of your room and tell us about your style preferences . </p>
								<p>We&lsquo;ll deliver your customized 3D designs in under 5 days, with unlimited revisions</p>
								<p>Ready to transform your home scape?</p>
								<div>
									<Button shape="round" size="lg" onClick={goToDesignMySpace}>
										DESIGN MY SPACE
									</Button>
								</div>
							</div>
						</div>
						<div className="col-xs-6">
							<Image src="https://res.cloudinary.com/spacejoy/image/upload/v1568564547/web/design-top-view_xjikmu.gif" />
						</div>
					</div>
				</div>
			</SectionWrapperStyled>
			<SectionWrapperStyled style={{ backgroundImage: "linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)" }}>
				<div className="container">
					<div className="grid justify-space-between align-center">
						<div className="col-xs-5">
							<div className="grid">
								<div className="col-xs-4">
									<Image src="https://res.cloudinary.com/spacejoy/image/upload/c_scale,h_150/v1568564329/web/Designer5_irflbd.jpg" />
								</div>
								<div className="col-xs-4">
									<Image src="https://res.cloudinary.com/spacejoy/image/upload/c_scale,h_150/v1568564329/web/Designer0_rmledc.jpg" />
								</div>
								<div className="col-xs-4">
									<Image src="https://res.cloudinary.com/spacejoy/image/upload/c_scale,h_150/v1568564329/web/Designer1_gzjvpu.jpg" />
								</div>
								<div className="col-xs-4">
									<Image src="https://res.cloudinary.com/spacejoy/image/upload/c_scale,h_150/v1568564329/web/Designer2_wt3yo2.jpg" />
								</div>
								<div className="col-xs-4">
									<Image src="https://res.cloudinary.com/spacejoy/image/upload/c_scale,h_150/v1568564329/web/Designer3_fn8uxl.jpg" />
								</div>
								<div className="col-xs-4">
									<Image src="https://res.cloudinary.com/spacejoy/image/upload/c_scale,h_150/v1568564330/web/designer4_mas7gx.jpg" />
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
									<Button shape="round" size="lg" onClick={goToDesignMySpace}>
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
									<Button shape="round" size="lg" onClick={goToDesignMySpace}>
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
					<div className="grid">
						<div className="col-xs-12 text-center">
							<CenterTextStyled>Doesn&lsquo;t Spark Joy?</CenterTextStyled>
							<CenterSubTextStyled>
								We&lsquo;ll revise your design until it reflects your perfect space. <br />
								{company.product} designers are here to help
							</CenterSubTextStyled>
							<Carousel slidesToShow={4} slidesToScroll={4} autoplay key={MockData.customerId}>
								{MockData.concept.map(concept => (
									<CarouselCardStyled key={concept.no}>
										<Image src={concept.imageUrl} />
										<h4>
											{MockData.customerName}&apos;s {MockData.roomType}
										</h4>
										<small>Design Concept {concept.no}</small>
									</CarouselCardStyled>
								))}
							</Carousel>

							<div>
								<Button shape="round" size="lg" onClick={goToDesignMySpace}>
									DESIGN MY SPACE
								</Button>
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
