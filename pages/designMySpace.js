import DesignMySpaceForm from "@components/forms/DesignMySpaceForm";
import Layout from "@components/Layout";
import Head from "next/head";
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
							<h1>Submit A Design Request </h1>
							<p>#{slug}</p>
							<DesignMySpaceForm />
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
