import Button from "@components/Button";
import Carousel from "@components/Carousel";
import Divider from "@components/Divider";
import Image from "@components/Image";
import Brands from "@sections/Brands";
import ProfileCard from "@sections/Cards/profile";
import HeroSection from "@sections/Home/HeroSection";
import HowSteps from "@sections/Home/HowSteps";
import Layout from "@sections/Layout";
import { withAuthVerification } from "@utils/auth";
import { company } from "@utils/config";
import MockData from "@utils/designConceptsMock";
import IndexPageMeta from "@utils/meta";
import Head from "next/head";
import Link from "next/link";
import Router from "next/router";
import PropTypes from "prop-types";
import React from "react";
import ReactCompareImage from "react-compare-image";
import styled from "styled-components";

const CarouselCardStyled = styled.div`
	outline: none;
	box-sizing: border-box;
	padding: 1rem;
`;

const SectionWrapperStyled = styled.section`
	padding: 100px 0;
	p {
		color: ${({ theme }) => theme.colors.fc.dark2};
	}
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

function index({ isServer, authVerification }) {
	return (
		<Layout isServer={isServer} authVerification={authVerification}>
			<Head>
				{IndexPageMeta}
				<title>Home | {company.product}</title>
			</Head>
			<HeroSection />
			<Brands />
			<HowSteps />
			<SectionWrapperStyled style={{ backgroundImage: "linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)" }}>
				<div className="container">
					<div className="grid justify-space-between align-center">
						<div className="col-xs-6">
							<div>
								<h1>Get 3D Designs of Your Space</h1>
								<p>Set your budget, share pictures of your room and tell us about your style preferences.</p>
								<p>We&lsquo;ll deliver your customized 3D designs in under 7 days, with unlimited revisions</p>
								<p>Ready to transform your home scape?</p>
								<Button variant="secondary" shape="rounded" size="lg" onClick={goToDesignMySpace}>
									DESIGN MY SPACE
								</Button>
							</div>
						</div>
						<div className="col-xs-6">
							<Image src="https://res.cloudinary.com/spacejoy/image/upload/v1568564547/web/design-top-view_xjikmu.gif" />
						</div>
					</div>
				</div>
			</SectionWrapperStyled>
			<SectionWrapperStyled style={{ background: "rgba(241, 241, 241, 0.38)" }}>
				<div className="container">
					<div className="grid align-center">
						<div className="col-12">
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
										<ProfileCard.Designation />
										<ProfileCard.UserName />
										<ProfileCard.Image source="https://res.cloudinary.com/spacejoy/image/upload/c_fill,g_face,h_300,q_100,w_200/v1569914893/web/designer-2_kdi9o4.jpg" />
										<ProfileCard.Social />
									</ProfileCard>
								</div>
								<div className="col-6 col-md-2">
									<ProfileCard>
										<ProfileCard.Designation />
										<ProfileCard.UserName />
										<ProfileCard.Image source="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=200&q=100" />
										<ProfileCard.Social fb="" tw="" li="" pi="" />
									</ProfileCard>
								</div>
								<div className="col-6 col-md-2">
									<ProfileCard>
										<ProfileCard.Designation />
										<ProfileCard.UserName />
										<ProfileCard.Image source="https://res.cloudinary.com/spacejoy/image/upload/c_scale,q_100,w_200/v1569914892/web/designer-3_f6xfm0.jpg" />
										<ProfileCard.Social fb="" tw="" li="" pi="" />
									</ProfileCard>
								</div>
								<div className="col-6 col-md-2">
									<ProfileCard>
										<ProfileCard.Designation />
										<ProfileCard.UserName />
										<ProfileCard.Image source="https://res.cloudinary.com/spacejoy/image/upload/c_fill,g_center,h_300,w_200/v1569933569/web/designer-5_rf3y3j.jpg" />
										<ProfileCard.Social fb="" tw="" li="" pi="" />
									</ProfileCard>
								</div>
								<div className="col-6 col-md-2">
									<ProfileCard>
										<ProfileCard.Designation />
										<ProfileCard.UserName />
										<ProfileCard.Image source="https://res.cloudinary.com/spacejoy/image/upload/c_fill,g_center,h_300,w_200/v1569933571/web/designer-4_tz7i2j.jpg" />
										<ProfileCard.Social fb="" tw="" li="" pi="" />
									</ProfileCard>
								</div>
								<div className="col-6 col-md-2">
									<ProfileCard>
										<ProfileCard.Designation />
										<ProfileCard.UserName />
										<ProfileCard.Image source="https://res.cloudinary.com/spacejoy/image/upload/c_fill,g_center,h_300,w_200/v1569933570/web/designer-1_pw7lsf.jpg" />
										<ProfileCard.Social fb="" tw="" li="" pi="" />
									</ProfileCard>
								</div>
							</div>
						</div>
						<div className="col-12">
							<Button variant="secondary" shape="rounded" size="lg" onClick={goToDesignMySpace}>
								DESIGN MY SPACE
							</Button>
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
							<Image src="https://res.cloudinary.com/spacejoy/image/upload/c_scale,w_605/v1566975734/web/brand-items_nerkmq.jpg" />
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
			<SectionWrapperStyled style={{ backgroundImage: "white" }}>
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
								leftImage="https://res.cloudinary.com/spacejoy/image/upload/c_scale,w_605/v1568876295/web/Design_2_before_igjbzg.jpg"
								rightImageLabel="After"
								rightImage="https://res.cloudinary.com/spacejoy/image/upload/c_scale,w_605/v1568876295/web/Design_2_after_m2grcx.jpg"
							/>
						</div>
					</div>
				</div>
			</SectionWrapperStyled>
		</Layout>
	);
}

index.defaultProps = {
	authVerification: {
		name: "",
		email: ""
	}
};

index.propTypes = {
	isServer: PropTypes.bool.isRequired,
	authVerification: PropTypes.shape({
		name: PropTypes.string,
		email: PropTypes.string
	})
};

export default withAuthVerification(index);
