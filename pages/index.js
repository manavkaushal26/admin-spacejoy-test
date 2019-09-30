import Button from "@components/Button";
import Carousel from "@components/Carousel";
import Divider from "@components/Divider";
import Image from "@components/Image";
import SVGIcon from "@components/SVGIcon";
import ProfileCard from "@sections/Cards/profile";
import WildCardStyled from "@sections/Cards/wild";
import Layout from "@sections/Layout";
import sparkJoyImg from "@static/images/spark-a-joy.svg";
import { company } from "@utils/config";
import MockData from "@utils/designConceptsMock";
import IndexPageMeta from "@utils/meta";
import Head from "next/head";
import Link from "next/link";
import Router from "next/router";
import React from "react";
import ReactCompareImage from "react-compare-image";
import styled from "styled-components";

const CarouselCardStyled = styled.div`
	outline: none;
	box-sizing: border-box;
	padding: 1rem;
`;

const PartnerBrandStyled = styled.div`
	height: 125px;
	display: flex;
	justify-content: center;
	align-items: center;
	transition: all linear 100ms;
	border-top: 1px solid ${({ theme }) => theme.colors.bg.light2};
	border-right: 1px solid ${({ theme }) => theme.colors.bg.light2};
	&:hover {
		background: ${({ theme }) => theme.colors.primary2};
		svg {
			* {
				fill: white;
			}
		}
	}
	svg {
		* {
			transition: all linear 100ms;
			fill: ${({ theme }) => theme.colors.fc.light2};
		}
	}
`;

const HowStyledBanner = styled.div`
	background: url("https://res.cloudinary.com/spacejoy/image/upload/c_scale,q_80,w_1800/v1569620131/web/pink-sofa_hp7wvg.jpg");
	padding: 5rem 0;
	background-size: cover;
	height: 500px;
	margin-bottom: 150px;
	background-position: 100%;
	background-attachment: fixed;
	h1 {
		font-family: "Airbnb Cereal App Medium";
		color: ${({ theme }) => theme.colors.fc.light1};
	}
	h4 {
		color: ${({ theme }) => theme.colors.fc.light1};
	}
`;

const HowStepStyled = styled.div`
	padding: 2rem;
	p {
		color: ${({ theme }) => theme.colors.fc.dark2};
	}
`;

const HowStyled = styled.div`
	position: absolute;
	background-color: white;
	width: calc(100% - 30px);
	padding: 3rem;
	box-shadow: 0 0 10px 0px rgba(0, 0, 0, 0.1);
`;

const HeroWrapperStyled = styled.section`
	position: relative;
	display: flex;
	align-items: center;
	min-height: calc(100vh - 250px);
`;

const HeroCardStyled = styled.section`
	position: relative;
`;

const SectionWrapperStyled = styled.section`
	padding: 100px 0;
	h1 {
		font-family: "Airbnb Cereal App Medium";
	}
	p {
		color: ${({ theme }) => theme.colors.fc.dark2};
	}
`;

const HeroText = styled.h1`
	font-family: "Airbnb Cereal App Medium";
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
	font-family: "Airbnb Cereal App Book";
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
		<Layout>
			<Head>
				{IndexPageMeta}
				<title>Home | {company.product}</title>
			</Head>
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
								<Button variant="primary" shape="flat" size="lg" onClick={goToDesignMySpace}>
									DESIGN MY SPACE <SVGIcon name="right" width={20} fill="white" />
								</Button>
								<Link href={{ pathname: "/designProjects" }} as="/designProjects">
									<a href="/designProjects">
										<p>Explore stunning design layouts.</p>
									</a>
								</Link>
							</HeroCardStyled>
						</div>
						<div className="col-8 col-bleed">
							<div className="grid">
								<div className="col-6 text-right">
									<Image
										full
										src="https://res.cloudinary.com/spacejoy/image/upload/c_fill,h_534,q_100,w_392/v1569581710/web/pink-scene_hmyxdk.jpg"
									/>
								</div>
								<div className="col-6">
									<Image
										full
										src="https://res.cloudinary.com/spacejoy/image/upload/c_fill,g_center,h_252,w_392/v1569619350/web/bulb_nxqhxo.jpg"
									/>
									<Image
										style={{ marginTop: "30px" }}
										full
										src="https://res.cloudinary.com/spacejoy/image/upload/c_fill,g_center,h_252,w_392/v1569581314/web/chairs_dqrdn9.jpg"
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</HeroWrapperStyled>

			<div>
				<div className="grid grid-bleed">
					<div className="col-6 col-xs-6 col-sm-4 col-md-2">
						<PartnerBrandStyled>
							<SVGIcon name="crateandbarrel" width={230} height={16.6} />
						</PartnerBrandStyled>
					</div>
					<div className="col-6 col-xs-6 col-sm-4 col-md-2">
						<PartnerBrandStyled>
							<SVGIcon name="anthropologie" width={203} height={12.5} />
						</PartnerBrandStyled>
					</div>
					<div className="col-6 col-xs-6 col-sm-4 col-md-2">
						<PartnerBrandStyled>
							<SVGIcon name="cb2" width={68.58} height={25} />
						</PartnerBrandStyled>
					</div>
					<div className="col-6 col-xs-6 col-sm-4 col-md-2">
						<PartnerBrandStyled>
							<SVGIcon name="potterybarn" width={206.56} height={14.28} />
						</PartnerBrandStyled>
					</div>
					<div className="col-6 col-xs-6 col-sm-4 col-md-2">
						<PartnerBrandStyled>
							<SVGIcon name="westelm" width={139.3} height={25} />
						</PartnerBrandStyled>
					</div>
					<div className="col-6 col-xs-6 col-sm-4 col-md-2">
						<PartnerBrandStyled>
							<SVGIcon name="wayfair" height={50} width={126.5} />
						</PartnerBrandStyled>
					</div>
				</div>
			</div>

			<HowStyledBanner>
				<div className="container">
					<div className="grid">
						<div className="col-12 col-xs-6">
							<h1>Custom Interior Design</h1>
							<h4>
								Set your budget, share pictures of your room and tell us about your style preferences. We‘ll deliver
								your customized 3D designs in under 7 days, with unlimited revisions.
							</h4>
						</div>
						<div className="col-12">
							<HowStyled>
								<div className="grid text-center">
									<div className="col-12 col-xs-4">
										<HowStepStyled>
											<SVGIcon name="divider" width={70} height={70} />
											<h3>Select Design</h3>
											<p>
												Lorem ipsum dolor, sit amet consectetur adipisicing elit. Unde, voluptatem architecto! Dolore
												dolores molestias inventore assumenda debitis id dolorum fugiat sapiente quae ab. Facilis facere
												dolorum corrupti! Quasi, ipsam ab.
											</p>
										</HowStepStyled>
									</div>
									<div className="col-12 col-xs-4">
										<HowStepStyled>
											<SVGIcon name="divider-2" width={70} height={70} />
											<h3>Select Design</h3>
											<p>
												Lorem ipsum dolor, sit amet consectetur adipisicing elit. Unde, voluptatem architecto! Dolore
												dolores molestias inventore assumenda debitis id dolorum fugiat sapiente quae ab. Facilis facere
												dolorum corrupti! Quasi, ipsam ab.
											</p>
										</HowStepStyled>
									</div>
									<div className="col-12 col-xs-4">
										<HowStepStyled>
											<SVGIcon name="divider-3" width={70} height={70} />
											<h3>Select Design</h3>
											<p>
												Lorem ipsum dolor, sit amet consectetur adipisicing elit. Unde, voluptatem architecto! Dolore
												dolores molestias inventore assumenda debitis id dolorum fugiat sapiente quae ab. Facilis facere
												dolorum corrupti! Quasi, ipsam ab.
											</p>
										</HowStepStyled>
									</div>
									<div className="col-12 col-bleed">
										<div style={{ position: "relative", marginBottom: "-50px" }}>
											<Button variant="primary" shape="flat" size="lg" onClick={goToDesignMySpace}>
												DESIGN MY SPACE
											</Button>
										</div>
									</div>
								</div>
							</HowStyled>
						</div>
					</div>
				</div>
			</HowStyledBanner>

			<SectionWrapperStyled>
				<div className="container">
					<div className="grid text-center">
						<div className="col-xs-12">
							<h1>Get 3D Designs of Your Space</h1>
							<Image
								size="500px"
								src="https://res.cloudinary.com/spacejoy/image/upload/v1568564547/web/design-top-view_xjikmu.gif"
							/>
						</div>
						<div className="col-xs-12">
							<div>
								<HeroSubText>
									Set your budget, share pictures of your room and tell us about your style preferences.
								</HeroSubText>
								<HeroSubText>
									We&lsquo;ll deliver your customized 3D designs in under 7 days, with unlimited revisions
								</HeroSubText>
								<HeroSubText>Ready to transform your home scape?</HeroSubText>
								<Button variant="secondary" shape="flat" size="lg" onClick={goToDesignMySpace}>
									DESIGN MY SPACE
								</Button>
							</div>
						</div>
					</div>
				</div>
			</SectionWrapperStyled>

			<SectionWrapperStyled style={{ background: "rgba(241, 241, 241, 0.38)" }}>
				<div className="container">
					<div className="grid justify-space-between align-center">
						<div className="col-xs-12">
							<h1>Crafted By Our Design Experts</h1>
							<p>
								Our designers will transform your space into a stunningly beautiful home
								<br />
								Want to change something? Speak to them & finalize your perfect space that brings perfect joy.
							</p>
						</div>
						<div className="col-xs-12">
							<div className="grid">
								<div className="col-6 col-md-2">
									<ProfileCard>
										<ProfileCard.Designation>Creative Designer</ProfileCard.Designation>
										<ProfileCard.UserName>Saurabh Sachan</ProfileCard.UserName>
										<ProfileCard.Image source="https://images.unsplash.com/photo-1520001304590-52ba97432c52?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=200&q=100" />
										<ProfileCard.Social fb="" tw="" li="" pi="" />
									</ProfileCard>
								</div>
								<div className="col-6 col-md-2">
									<ProfileCard>
										<ProfileCard.Designation>Creative Designer</ProfileCard.Designation>
										<ProfileCard.UserName>Saurabh Sachan</ProfileCard.UserName>
										<ProfileCard.Image source="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=200&q=100" />
										<ProfileCard.Social fb="" tw="" li="" pi="" />
									</ProfileCard>
								</div>
								<div className="col-6 col-md-2">
									<ProfileCard>
										<ProfileCard.Designation>Creative Designer</ProfileCard.Designation>
										<ProfileCard.UserName>Saurabh Sachan</ProfileCard.UserName>
										<ProfileCard.Image source="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=200&q=100" />
										<ProfileCard.Social fb="" tw="" li="" pi="" />
									</ProfileCard>
								</div>
								<div className="col-6 col-md-2">
									<ProfileCard>
										<ProfileCard.Designation>Creative Designer</ProfileCard.Designation>
										<ProfileCard.UserName>Saurabh Sachan</ProfileCard.UserName>
										<ProfileCard.Image source="https://images.unsplash.com/photo-1535230464639-a413d00b9934?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=200&q=100" />
										<ProfileCard.Social fb="" tw="" li="" pi="" />
									</ProfileCard>
								</div>
								<div className="col-12 col-md-4">
									<WildCardStyled>
										<Image size="50px" src={sparkJoyImg} />
										<p>
											Lorem ipsum dolor, sit amet consectetur adipisicing elit. Unde, voluptatem architecto! Dolore
											dolores molestias.
										</p>
										<Button variant="primary" shape="flat" size="lg" onClick={goToDesignMySpace}>
											DESIGN MY SPACE
										</Button>
									</WildCardStyled>
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
								<p>Our designs feature products from your favorite brands.</p>
								<p>We will work within your budget to find those coveted pieces that spark joy.</p>
								<p>It&lsquo;s a hassle-free experience </p>
								<Button variant="secondary" shape="rounded" size="lg" onClick={goToDesignMySpace}>
									DESIGN MY SPACE
								</Button>
							</div>
						</div>
						<div className="col-xs-6 ">
							<Image src="https://res.cloudinary.com/spacejoy/image/upload/v1566975734/web/brand-items_nerkmq.jpg" />
						</div>
					</div>
				</div>
			</SectionWrapperStyled>
			<SectionWrapperStyled>
				<div className="container">
					<div className="grid">
						<div className="col-xs-12 text-center">
							<CenterTextStyled>Swap It Till You Love It</CenterTextStyled>
							<CenterSubTextStyled>
								Revision is our mantra! We&apos;ll make sure what you see sparks total joy!
								<br />
								<Link href={{ pathname: "/designProjects" }} as="/designProjects">
									<a href="/designProjects">Explore multiple layouts</a>
								</Link>
								, swap furniture from various brands that reflects your style and is in your budget until you&apos;re
								all hearts about it.
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
							<Button variant="secondary" shape="rounded" size="lg" onClick={goToDesignMySpace}>
								DESIGN MY SPACE
							</Button>
						</div>
					</div>
				</div>
			</SectionWrapperStyled>
			<SectionWrapperStyled>
				<div className="container">
					<div className="grid">
						<div className="col-xs-12 col-sm-6">
							<h1>Customer Delight</h1>
							<h4>Design stories straight from our customers</h4>
							<div className="grid">
								<div className="col-4  col-md-3">
									<Image
										size="100px"
										src="https://res.cloudinary.com/spacejoy/image/upload/v1568876294/web/customer3_z2vvn2.jpg"
									/>
								</div>
								<div className="col-8  col-md-9 col-bleed-y">
									<p>
										Living Room for <strong> Erika Lee </strong>
									</p>
									<p> Denver, Colorado </p>
								</div>
							</div>
							<Divider />
							<p>
								Our designer from Spacejoy immediately caught on to our vision and delivered. The execution was
								flawless. We couldn’t be happier with how amazing our home looks right now.
							</p>
							<p>Ready to transform your home scape?</p>
							<Button variant="secondary" shape="rounded" size="lg" onClick={goToDesignMySpace}>
								DESIGN MY SPACE
							</Button>
						</div>
						<div className="col-xs-12 col-sm-6">
							<ReactCompareImage
								leftImageLabel="Before"
								leftImage="https://res.cloudinary.com/spacejoy/image/upload/v1568876295/web/Design_2_before_igjbzg.jpg"
								rightImageLabel="After"
								rightImage="https://res.cloudinary.com/spacejoy/image/upload/v1568876295/web/Design_2_after_m2grcx.jpg"
							/>
						</div>
					</div>
				</div>
			</SectionWrapperStyled>
		</Layout>
	);
}

export default index;
