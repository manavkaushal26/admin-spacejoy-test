import Image from "@components/Image";
import Link from "next/link";
import React from "react";
import styled from "styled-components";

const FooterStyled = styled.footer`
	padding: 0;
	font-size: 0.9rem;
`;

const FooterNavStyled = styled.ul`
	padding: 0;
	margin: 0;
	li {
		list-style: none;
		padding: ${({ direction }) => (direction === "horizontal" ? "0.5rem" : "0.25rem 0")};
		display: ${({ direction }) => (direction === "horizontal" ? "inline-block" : "block")};
	}
`;

const DividerStyled = styled.div`
	margin: 1rem 0;
	height: 1px;
	background: #dcdcdc;
`;

const HappinessSealStyled = styled.footer`
	margin: 2rem 0;
	font-size: 0.8rem;
`;

function index() {
	return (
		<FooterStyled>
			<div className="container">
				<DividerStyled />
				<div className="grid justify-space-between">
					<div className="col-xs-12 col-md-4">
						<h3>Quick Links</h3>
						<nav>
							<FooterNavStyled>
								<li>
									<a href="https://www.blog.spacejoy.com/">Blog</a>
								</li>
								<li>
									<Link href="/feedback" as="/feedback">
										<a href="/feedback">Privacy Policy</a>
									</Link>
								</li>
								<li>
									<Link href="/feedback" as="/feedback">
										<a href="/feedback">Terms of Service</a>
									</Link>
								</li>
								<li>
									<Link href="/feedback" as="/feedback">
										<a href="/feedback">Cookie Statement</a>
									</Link>
								</li>
							</FooterNavStyled>
						</nav>
					</div>
					<div className="col-xs-12 col-md-4 align-center">
						<h3>CONNECT WITH US</h3>
						<nav>
							<FooterNavStyled direction="horizontal">
								<li>
									<a href="https://www.blog.spacejoy.com/">
										<Image
											size="xs"
											src="https://res.cloudinary.com/spacejoy/image/upload/v1567093473/shared/facebook_fjpw0j.svg"
										/>
									</a>
								</li>
								<li>
									<Link href="/feedback" as="/feedback">
										<a href="/feedback">
											<Image
												size="xs"
												src="https://res.cloudinary.com/spacejoy/image/upload/v1567093473/shared/twitter_el5nrt.svg"
											/>
										</a>
									</Link>
								</li>
								<li>
									<Link href="/feedback" as="/feedback">
										<a href="/feedback">
											<Image
												size="xs"
												src="https://res.cloudinary.com/spacejoy/image/upload/v1567093473/shared/instagram_w0u21k.svg"
											/>
										</a>
									</Link>
								</li>
								<li>
									<Link href="/feedback" as="/feedback">
										<a href="/feedback">
											<Image
												size="xs"
												src="https://res.cloudinary.com/spacejoy/image/upload/v1567093473/shared/pinterest_q2xvqr.svg"
											/>
										</a>
									</Link>
								</li>
								<li>
									<Link href="/feedback" as="/feedback">
										<a href="/feedback">
											<Image
												size="xs"
												src="https://res.cloudinary.com/spacejoy/image/upload/v1567093473/shared/whatsapp_bbk16v.svg"
											/>
										</a>
									</Link>
								</li>
							</FooterNavStyled>
						</nav>
						<h3>Download App</h3>
						<nav>
							<FooterNavStyled direction="horizontal">
								<li>
									<a href="https://www.blog.spacejoy.com/">
										<Image size="md" src="https://storage.googleapis.com/isuite-artifacts/homeWeb2/home/APPSTORE.png" />
									</a>
								</li>
								<li>
									<Link href="/feedback" as="/feedback">
										<a href="/feedback">
											<Image
												size="md"
												src="https://storage.googleapis.com/isuite-artifacts/homeWeb2/home/googleplay_icon.png"
											/>
										</a>
									</Link>
								</li>
							</FooterNavStyled>
						</nav>
					</div>
					<div className="col-xs-12 col-md-4 align-right">
						<Image src="https://havenly.com/marketing-pages-assets/images/home/happiness-guarantee.svg" />
						<HappinessSealStyled>
							There is really just one thing we want - to instil happiness in the form of a stylish home. Once
							you&apos;ve made the payment, if at any point you feel otherwise, we&apos;ll be happy to rectify. In case
							you still are not convinced we promise to give you, your money back!
						</HappinessSealStyled>
					</div>
				</div>
			</div>
		</FooterStyled>
	);
}

export default index;
