import Layout from "@sections/Layout";
import { redirectToLocation, withAuthSync } from "@utils/auth";
import { company, page } from "@utils/config";
import IndexPageMeta from "@utils/meta";
import fetch from "isomorphic-unfetch";
import nextCookie from "next-cookies";
import Head from "next/head";
import PropTypes from "prop-types";
import React from "react";

const profile = ({ isServer, _id, name, email, role }) => {
	return (
		<Layout header="solid" isServer={isServer}>
			<Head>
				{IndexPageMeta}
				<title>Profile | {company.product}</title>
			</Head>
			<div className="container">
				<div className="grid">
					<div className="col-xs-12 text-center">
						<h3>ID: {_id}</h3>
						<p>name: {name}</p>
						<p>email: {email}</p>
						<p>role: {role}</p>
					</div>
				</div>
			</div>
		</Layout>
	);
};

profile.getInitialProps = async ctx => {
	const { token } = nextCookie(ctx);
	const isServer = !!ctx.req;
	const endPoint = "/auth/check";

	const redirectOnError = () => redirectToLocation("/auth/login", ctx.res);

	try {
		const response = await fetch(page.apiBaseUrl + endPoint, {
			method: "GET",
			headers: {
				Authorization: token
			}
		});
		if (response.status >= 200) {
			const responseData = await response.json();
			return { ...responseData, isServer };
		}
		return await redirectOnError();
	} catch (error) {
		return redirectOnError();
	}
};

profile.defaultProps = {
	_id: "",
	name: "",
	email: "",
	role: ""
};

profile.propTypes = {
	isServer: PropTypes.bool.isRequired,
	_id: PropTypes.string,
	name: PropTypes.string,
	email: PropTypes.string,
	role: PropTypes.string
};

export default withAuthSync(profile);
