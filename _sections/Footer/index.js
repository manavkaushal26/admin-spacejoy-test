import Divider from "@components/Divider";
import Image from "@components/Image";
import { company } from "@utils/config";
import Link from "next/link";
import React from "react";
import styled from "styled-components";

const FooterStyled = styled.footer`
	padding: 1.5rem 0;
	font-size: 0.9rem;
	margin-bottom: 20vh;
`;

const FooterNavStyled = styled.ul`
	padding: 0;
	margin: 0;
	li {
		list-style: none;
		padding: ${({ direction }) => (direction === "horizontal" ? "0.5rem" : "0.25rem 0")};
		display: ${({ direction }) => (direction === "horizontal" ? "inline-block" : "block")};
		&:first-child {
			padding-left: 0;
		}
		&:last-child {
			padding-right: 0;
		}
		a {
			color: ${({ theme }) => theme.colors.fc.dark1};
		}
	}
`;

const HappinessSealStyled = styled.div`
	font-size: 0.8rem;
`;

function index() {
	return (
		<FooterStyled>
			<div className="container">
				<Divider />
				<div className="grid">
					<div className="col-xs-12 col-md-3">
						<h3>QUICK LINKS</h3>
						<nav>
							<FooterNavStyled>
								<li>
									<a href="https://www.blog.spacejoy.com/">Blog</a>
								</li>
								<li>
									<Link href="/profile" as="/profile">
										<a href="/profile">Privacy Policy</a>
									</Link>
								</li>
								<li>
									<Link href="/terms" as="/terms">
										<a href="/terms">Terms of Service</a>
									</Link>
								</li>
								<li>
									<Link href="/cookies" as="/cookies">
										<a href="/cookies">Cookie Statement</a>
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
									<a href={company.social.facebook} target="_black">
										<Image
											size="xs"
											src="https://res.cloudinary.com/spacejoy/image/upload/v1567093473/shared/facebook_fjpw0j.svg"
										/>
									</a>
								</li>
								<li>
									<a href={company.social.twitter} target="_black">
										<Image
											size="xs"
											src="https://res.cloudinary.com/spacejoy/image/upload/v1567093473/shared/twitter_el5nrt.svg"
										/>
									</a>
								</li>
								<li>
									<a href={company.social.instagram} target="_black">
										<Image
											size="xs"
											src="https://res.cloudinary.com/spacejoy/image/upload/v1567093473/shared/instagram_w0u21k.svg"
										/>
									</a>
								</li>
								<li>
									<a href={company.social.pinterest} target="_black">
										<Image
											size="xs"
											src="https://res.cloudinary.com/spacejoy/image/upload/v1567093473/shared/pinterest_q2xvqr.svg"
										/>
									</a>
								</li>
							</FooterNavStyled>
						</nav>
						<h3>DOWNLOAD APP</h3>
						<nav>
							<FooterNavStyled direction="horizontal">
								<li>
									<a href={company.app.ios}>
										<Image
											size="md"
											src="https://res.cloudinary.com/spacejoy/image/upload/c_scale,h_60/v1567249447/shared/appstore_porgmf.png"
										/>
									</a>
								</li>
								<li>
									<a href={company.app.android}>
										<Image
											size="md"
											src="https://res.cloudinary.com/spacejoy/image/upload/c_scale,h_60/v1567249447/shared/playstore_rkjmgk.png"
										/>
									</a>
								</li>
							</FooterNavStyled>
						</nav>
					</div>
					<div className="col-xs-12 col-md-5 align-right">
						<div className="grid">
							<div className="col-xs-3">
								<Image
									size="100px"
									src="https://res.cloudinary.com/spacejoy/image/upload/v1569231120/web/Badge_dpkz2m.svg"
								/>
							</div>
							<div className="col-xs-9">
								<HappinessSealStyled>
									There is really just one thing we want - to instil happiness in the form of a stylish home. Once
									you&apos;ve made the payment, if at any point you feel otherwise, we&apos;ll be happy to rectify. In
									case you still are not convinced we promise to give you, your money back!
								</HappinessSealStyled>
								<div className="grid">
									<div className="col-xs-12">
										<h3>NEED HELP?</h3>
										<nav>
											<FooterNavStyled>
												<li>
													<Image
														size="xs"
														src="https://res.cloudinary.com/spacejoy/image/upload/v1567525045/web/envelope_sem3ud.svg"
														style={{ marginRight: "1rem" }}
													/>

													<a href={`mailto:${company.email.support}?Subject=Need%20Help`} target="_top">
														{company.email.support}
													</a>
												</li>
											</FooterNavStyled>
										</nav>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</FooterStyled>
	);
}

export default index;
