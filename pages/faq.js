import Layout from "@components/Layout";
import Head from "next/head";
import Link from "next/link";
import { withRouter } from "next/router";
import PropTypes from "prop-types";
import React from "react";

function faq({ stars, isServer }) {
	return (
		<Layout header="solid">
			<Head>
				<title>FAQ {isServer}</title>
			</Head>
			<div className="container">
				<div className="grid">
					<div className="col-xs-12">
						<div>Next stars: {stars}</div>
						<ul>
							<li>
								Lorem ipsum dolor sit amet consectetur, adipisicing elit. Alias voluptatum, obcaecati quasi corporis
								reiciendis est cumque laboriosam autem maxime provident, doloribus, velit dignissimos. Nam porro, beatae
								quae sint corporis enim.
							</li>
							<li>
								<p>
									Lorem ipsum dolor sit amet, consectetur adipisicing elit. Harum ducimus dignissimos ipsum similique
									praesentium. Doloremque aperiam necessitatibus obcaecati voluptatibus mollitia nulla animi libero
									dolorum veniam, culpa eos tempore facilis praesentium?
								</p>
							</li>
							<li>
								<Link href="/" as="/">
									<a href="/">home</a>
								</Link>
							</li>
							<li>
								<Link href="/post?slug=something" as="/post/something">
									<a href="/post/something">post Us</a>
								</Link>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</Layout>
	);
}

faq.getInitialProps = async ({ req }) => {
	const isServer = !!req;
	// const res = await fetch("https://api.github.com/repos/zeit/next.js");
	// const json = await res.json();
	return { stars: 500, isServer };
};

faq.propTypes = {
	isServer: PropTypes.bool.isRequired,
	stars: PropTypes.number.isRequired
};

export default withRouter(faq);
