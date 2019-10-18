import Image from "@components/Image";
import List from "@components/List";
import SVGIcon from "@components/SVGIcon";
import { cloudinary, company } from "@utils/config";
import Link from "next/link";
import React from "react";
import styled from "styled-components";

const FooterStyled = styled.footer`
	padding: 4rem 0;
	font-size: 0.9rem;
	background-color: ${({ theme }) => theme.colors.white};
`;

const HappinessSealStyled = styled.div`
	font-size: 0.8rem;
`;

function index() {
	return (
		<FooterStyled>
			<div className="container">
				<div className="grid">
					<div className="col-xs-12 col-md-3">
						<h3>QUICK LINKS</h3>
						<nav>
							<List>
								<li>
									<a href="https://www.blog.spacejoy.com/">Blog</a>
								</li>
								<li>
									<Link href="/checkout" as="/checkout">
										<a href="/checkout">Privacy Policy</a>
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
							</List>
						</nav>
					</div>
					<div className="col-xs-12 col-md-4 align-center">
						<h3>CONNECT WITH US</h3>
						<nav>
							<List direction="horizontal">
								<li>
									<a href={company.social.facebook} target="_black">
										<SVGIcon name="fb" height={18} width={18} />
									</a>
								</li>
								<li>
									<a href={company.social.twitter} target="_black">
										<SVGIcon name="tw" height={18} width={18} />
									</a>
								</li>
								<li>
									<a href={company.social.linkedin} target="_black">
										<SVGIcon name="li" height={18} width={18} />
									</a>
								</li>
								<li>
									<a href={company.social.instagram} target="_black">
										<SVGIcon name="insta" height={18} width={18} />
									</a>
								</li>
								<li>
									<a href={company.social.pinterest} target="_black">
										<SVGIcon name="pi" height={18} width={18} />
									</a>
								</li>
							</List>
						</nav>
						<h3>DOWNLOAD APP</h3>
						<nav>
							<List direction="horizontal">
								<li>
									<a href={company.app.ios}>
										<Image
											width="100px"
											src={`${cloudinary.baseDeliveryURL}/image/upload/c_scale,h_60/v1571050296/shared/app-store_dvz21i.png`}
											alt="app store"
										/>
									</a>
								</li>
								<li>
									<a href={company.app.android}>
										<Image
											width="100px"
											src={`${cloudinary.baseDeliveryURL}/image/upload/c_scale,h_60/v1571050296/shared/play-store_ncfocx.png`}
											alt="play store"
										/>
									</a>
								</li>
							</List>
						</nav>
					</div>
					<div className="col-xs-12 col-md-5 align-right">
						<div className="grid">
							<div className="col-xs-3">
								<Image
									width="100px"
									src={`${cloudinary.baseDeliveryURL}/image/upload/v1571295673/web/Your_vision_badge_njvfdz.svg`}
								/>
							</div>
							<div className="col-xs-9">
								<HappinessSealStyled>
									Once you&apos;ve made the payment, if at any point you feel you&apos;re not happy with our services,
									we&apos;ll rectify till you love what you see. In case you still are not convinced we promise to give
									you your money back! There is just one thing we want - to instill happiness in the form of a stylish
									home.
								</HappinessSealStyled>
								<div className="grid">
									<div className="col-xs-12">
										<h3>NEED HELP?</h3>
										<nav>
											<List>
												<li>
													<SVGIcon name="envelope" height={14} width={20} style={{ marginRight: "0.5rem" }} />
													<a href={`mailto:${company.email.support}?Subject=Need%20Help`} target="_top">
														{company.email.support}
													</a>
												</li>
											</List>
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
