import { AuthContext } from "@context/AuthStorage";
import Layout from "@sections/Layout";
import { withAuthSync } from "@utils/auth";
import { company } from "@utils/config";
import IndexPageMeta from "@utils/meta";
import Head from "next/head";
import React from "react";

const profile = () => {
	return (
		<Layout>
			<Head>
				{IndexPageMeta}
				<title>Profile | {company.product}</title>
			</Head>
			<div className="container">
				<div className="grid">
					<div className="col-xs-12 text-center">
						<AuthContext.Consumer>
							{value => (
								<button type="button" onClick={value.updateState}>
									{JSON.stringify(value.state.isAuthorized)}
								</button>
							)}
						</AuthContext.Consumer>
					</div>
				</div>
			</div>
		</Layout>
	);
};

export default withAuthSync(profile);
