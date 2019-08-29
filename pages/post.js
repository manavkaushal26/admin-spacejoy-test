import Layout from "@components/Layout";
import Link from "next/link";
import PropTypes from "prop-types";
import React, { PureComponent } from "react";

class Post extends PureComponent {
	render() {
		const { slug } = this.props;
		return (
			<Layout header="transparent">
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

Post.getInitialProps = async ({ query: { slug } }) => {
	return { slug };
};

Post.propTypes = {
	slug: PropTypes.string.isRequired
};
export default Post;
