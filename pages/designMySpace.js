import Layout from "@components/Layout";
import Head from "next/head";
import Link from "next/link";
import PropTypes from "prop-types";
import React, { PureComponent } from "react";

class designMySpace extends PureComponent {
	render() {
		const { slug, isServer } = this.props;
		return (
			<Layout header="transparent">
				<Head>
					<title>Design My Space {isServer}</title>
				</Head>
				<div className="container">
					<div className="grid">
						<div className="col-xs-12">
							<h1>My blog Post #{slug}</h1>
							<p>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
								dolore magna aliqua.
							</p>
							<ul>
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
}

designMySpace.getInitialProps = async ({ req, query: { slug } }) => {
	const isServer = !!req;
	return { isServer, slug };
};

designMySpace.propTypes = {
	isServer: PropTypes.bool.isRequired,
	slug: PropTypes.string.isRequired
};
export default designMySpace;
