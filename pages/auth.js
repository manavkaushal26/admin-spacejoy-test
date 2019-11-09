import ForgotPasswordForm from "@sections/Forms/ForgotPasswordForm";
import LoginForm from "@sections/Forms/LoginForm";
import ResetPasswordForm from "@sections/Forms/ResetPasswordForm";
import SignupForm from "@sections/Forms/SignupForm";
import Layout from "@sections/Layout";
import { withAuthVerification } from "@utils/auth";
import { company } from "@utils/config";
import IndexPageMeta from "@utils/meta";
import Head from "next/head";
import Link from "next/link";
import PropTypes from "prop-types";
import React from "react";

function getHeadingText(flow) {
	switch (flow) {
		case "signup":
			return <h3>Signup To Unlock Your Stunning Room</h3>;
		case "login":
			return <h3>Welcome Back</h3>;
		case "forgot-password":
			return (
				<>
					<h3>Forgot Password?</h3>
					<p>No Worries. We’ll email you instructions to reset your password.</p>
				</>
			);
		case "reset-password":
			return (
				<>
					<h3>Set New Password</h3>
					<p>This Link will be active for next 30 Mins</p>
				</>
			);
		default:
			return "";
	}
}

function auth({ isServer, authVerification, flow, redirectUrl, token }) {
	const renderLoginLink = (
		<Link
			href={{ pathname: "/auth", query: { flow: "login", redirectUrl } }}
			as={redirectUrl ? `/auth/login?redirectUrl=${redirectUrl}` : "/auth/login"}
		>
			<a href={redirectUrl ? `/auth/login?redirectUrl=${redirectUrl}` : "/auth/login"}>Login</a>
		</Link>
	);

	const renderSignupLink = (
		<Link
			href={{ pathname: "/auth", query: { flow: "signup", redirectUrl } }}
			as={redirectUrl ? `/auth/signup?redirectUrl=${redirectUrl}` : "/auth/signup"}
		>
			<a href={redirectUrl ? `/auth/signup?redirectUrl=${redirectUrl}` : "/auth/signup"}>Signup</a>
		</Link>
	);

	const renderForgotPasswordLink = (
		<Link
			href={{ pathname: "/auth", query: { flow: "forgot-password", redirectUrl } }}
			as={redirectUrl ? `/auth/forgot-password?redirectUrl=${redirectUrl}` : "/auth/signup"}
		>
			<a href={redirectUrl ? `/auth/forgot-password?redirectUrl=${redirectUrl}` : "/auth/signup"}>Forgot Password?</a>
		</Link>
	);

	return (
		<Layout isServer={isServer} authVerification={authVerification}>
			<Head>
				{IndexPageMeta}
				<title>
					{flow} | {company.product}
				</title>
			</Head>
			<div className="container">
				<div className="grid text-center">
					<div className="col-12 col-sm-8 col-md-4">
						<div className="col-12">{getHeadingText(flow)}</div>
						<div className="col-12">
							{flow === "login" && <LoginForm redirectUrl={redirectUrl} />}
							{flow === "signup" && <SignupForm redirectUrl={redirectUrl} />}
							{flow === "forgot-password" && <ForgotPasswordForm redirectUrl={redirectUrl} />}
							{flow === "reset-password" && <ResetPasswordForm redirectUrl={redirectUrl} token={token} />}
						</div>
						<div className="col-12">
							{flow === "signup" && (
								<>
									<span>Already have an account? </span>
									{renderLoginLink}
								</>
							)}
							{flow === "login" && (
								<>
									<span>Create new Account </span>
									{renderSignupLink}
									<br />
									{renderForgotPasswordLink}
								</>
							)}
							{flow === "forgot-password" && (
								<>
									<span>Create new Account </span>
									{renderSignupLink}
									<br />
									<span>Already have an account? </span>
									{renderLoginLink}
								</>
							)}
						</div>
					</div>
				</div>
			</div>
		</Layout>
	);
}

auth.getInitialProps = async ({ req, query: { flow, redirectUrl, token } }) => {
	const isServer = !!req;
	return { isServer, flow, redirectUrl, token };
};

auth.defaultProps = {
	flow: "",
	redirectUrl: "",
	token: "",
	authVerification: {}
};

auth.propTypes = {
	isServer: PropTypes.bool.isRequired,
	authVerification: PropTypes.shape({}),
	token: PropTypes.string,
	flow: PropTypes.string,
	redirectUrl: PropTypes.string
};

export default withAuthVerification(auth);
