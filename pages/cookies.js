import Divider from "@components/Divider";
import Image from "@components/Image";
import Layout from "@sections/Layout";
import { company } from "@utils/config";
import IndexPageMeta from "@utils/meta";
import Head from "next/head";
import React from "react";

function cookies() {
	return (
		<Layout>
			<Head>
				{IndexPageMeta}
				<title>Cookies | {company.product}</title>
			</Head>
			<div className="container">
				<div className="grid justify-space-around">
					<div className="col-xs-12 col-sm-8">
						<Image src="https://res.cloudinary.com/spacejoy/image/upload/c_scale,q_auto:best,w_1600/v1567610998/web/home-banner_ykstrm.jpg" />
						<h1>Cookie Statement</h1>
						<p>
							{company.product} uses cookies to enhance performance and improve your user experience, to provide certain
							user functionality, as well as to distinguish you from other users when you use our website and other
							products and services.
						</p>
						<Divider />
						<div className="grid ">
							<div className="col-xs-12">
								<h3>What is a cookie?</h3>
								<p>
									A cookie is a small file that is stored locally within the web browser or file system on your computer
									or mobile device. Cookies are used by all websites, and have several different functions. We use the
									following types of cookies:
								</p>
							</div>
						</div>
						<Divider />
						<div className="grid">
							<div className="col-xs-7 col-bleed ">
								<div className="col-xs-12">
									<h3>Functionality cookies</h3>
									<p>
										These are cookies that are required for the operation of our services. They include, for example,
										cookies that enable you to log into secure areas of our website and access {company.product}{" "}
										information.
									</p>
								</div>
								<div className="col-xs-12">
									<h3>Analytics Cookies</h3>
									<p>
										These cookies are important for our website to get statistics, estimate audience size, gain insight
										into the use of our website and to help improve the services we provide to our users. You can find
										more information about the individual cookies we use and the purposes for which we use them in the
										table below:
									</p>
								</div>
							</div>
							<div className="col-xs-5">
								<h3>Third Parties Cookies</h3>
								<p>
									Third Parties We also work with third parties that provide services we use for promoting and
									maintaining our services. Some of these allow us to test and ensure that our services are performing
									well. Others measure the impact and performance of our advertising, or allow us to track referrals
									from our affiliates. Please read our partner&apos;s privacy policies (linked below) to ensure that
									you&apos;re comfortable with how they use cookies. We have also provided links to opt out of their
									services if you like and wherever applicable on about the individual cookies we use and the purposes
									for which we use them in the table below:
								</p>
							</div>
						</div>
						<h3>Double Click</h3>
						<p>
							Overflow uses Google DoubleClick to measure the effectiveness of its online marketing campaigns. <br />
							<a rel="noopener noreferrer" href="https://policies.google.com/technologies/ads" target="_blank">
								How Google uses cookies in advertising
							</a>
							<br />
							<a rel="noopener noreferrer" href="https://support.google.com/ads/answer/7395996" target="_blank">
								Opt-out of Double-click cookies
							</a>
						</p>
						<h3>Facebook</h3>
						<p>
							Facebook provides certain site functionality, help us to place advertising on Facebook, and help us to
							track the performance of advertisements that we place on Facebook. <br />
							<a rel="noopener noreferrer" href="https://policies.google.com/technologies/ads" target="_blank">
								How Google uses cookies in advertising
							</a>
							<br />
							<a rel="noopener noreferrer" href="https://support.google.com/ads/answer/7395996" target="_blank">
								Opt-out of Double-click cookies
							</a>
							<br />
							<a rel="noopener noreferrer" href="https://policies.google.com/privacy" target="_blank">
								Google Privacy Policy
							</a>
							<br />
							<a rel="noopener noreferrer" href="https://tools.google.com/dlpage/gaoptout?hl=e" target="_blank">
								How to Opt-out
							</a>
						</p>
						<h3>Google Analytics</h3>
						<p>
							From time to time {company.product} services, including mobile apps, use Google Analytics. This is a web
							analytics service provided by Google, Inc. Google Analytics sets a cookie in order to evaluate use of
							those services and compile a report for us. <br />
							<a rel="noopener noreferrer" href="https://policies.google.com/privacy" target="_blank">
								Google Privacy Policy
							</a>
							<br />
							<a rel="noopener noreferrer" href="https://tools.google.com/dlpage/gaoptout?hl=e" target="_blank">
								How to Opt-out
							</a>
						</p>
					</div>
				</div>
			</div>
		</Layout>
	);
}

export default cookies;
