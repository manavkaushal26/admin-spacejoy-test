import DesignMySpaceForm from "@components/forms/DesignMySpaceForm";
import Layout from "@components/Layout";
import Head from "next/head";
import PropTypes from "prop-types";
import React, { PureComponent } from "react";

class designMySpace extends PureComponent {
	render() {
		const { plan, isServer } = this.props;
		return (
			<Layout header="solid">
				<Head>
					<title>Design My Space {isServer}</title>
				</Head>
				<div className="container">
					<div className="grid justify-space-around">
						<div className="col-xs-12 col-sm-6 col-md-4">
							<h1>Submit A Design Request </h1>
							<p>#{plan}</p>
							<DesignMySpaceForm />
						</div>
					</div>
				</div>
			</Layout>
		);
	}
}

designMySpace.getInitialProps = async ({ req, query: { plan } }) => {
	const isServer = !!req;
	return { isServer, plan };
};

designMySpace.defaultProps = {
	plan: ""
};

designMySpace.propTypes = {
	isServer: PropTypes.bool.isRequired,
	plan: PropTypes.string
};

export default designMySpace;
