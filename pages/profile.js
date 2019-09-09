import Layout from "@sections/Layout";
import { withAuthSync } from "@utils/auth";
import fetch from "isomorphic-unfetch";
import Router from "next/router";
import PropTypes from "prop-types";
import React from "react";

const profile = ({ id, avatarUrl, name, email, bio }) => {
	return (
		<Layout>
			<img src={avatarUrl} alt="Avatar" />
			<h1>
				{name}
				{id}
			</h1>
			<p>{bio}</p>
			<p>{email}</p>
		</Layout>
	);
};

profile.getInitialProps = async ctx => {
	const token = "4476416";
	const apiUrl = `https://api.github.com/user/${token}`;

	const redirectOnError = () =>
		typeof window !== "undefined"
			? Router.push("/auth/login?redirectUrl=faq")
			: ctx.res.writeHead(302, { Location: "/auth/login" }).end();

	try {
		const response = await fetch(apiUrl, {
			credentials: "include",
			headers: {
				Authorization: JSON.stringify({ token })
			}
		});

		if (response.status >= 200) {
			const js = await response.json();
			const { id, name, email, bio } = js;
			const avatarUrl = js.avatar_url;
			return { id, avatarUrl, name, email, bio };
		}
		return await redirectOnError();
	} catch (error) {
		// Implementation or Network error
		return redirectOnError();
	}
};

profile.defaultProps = {
	email: ""
};

profile.propTypes = {
	name: PropTypes.string.isRequired,
	id: PropTypes.number.isRequired,
	avatarUrl: PropTypes.string.isRequired,
	bio: PropTypes.string.isRequired,
	email: PropTypes.string
};

export default withAuthSync(profile);
