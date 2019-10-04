import ForgotPasswordForm from "@sections/Forms/ForgotPasswordForm";
import LoginForm from "@sections/Forms/LoginForm";
import SignupForm from "@sections/Forms/SignupForm";
import Layout from "@sections/Layout";
import { company } from "@utils/config";
import IndexPageMeta from "@utils/meta";
import Head from "next/head";
import Link from "next/link";
import PropTypes from "prop-types";
import React from "react";

function getHeadingText(flow) {
	switch (flow) {
		case "signup":
			return "Signup To Unlock Your Stunning Room";
		case "login":
			return "Welcome Back";
		case "forgot-password":
			return (
				<span>
					Forgot Password? No Worries. <br />
					We’ll email you instructions to reset your password.
				</span>
			);
		default:
			return "";
	}
}

function auth({ isServer, flow, redirectUrl }) {
	return (
		<Layout isServer={isServer}>
			<Head>
				{IndexPageMeta}
				<title>
					{flow} | {company.product}
				</title>
			</Head>
			<div className="container">
				<div className="grid text-center">
					<div className="col-12 col-sm-8 col-md-4">
						<div className="col-12">
							<h3>{getHeadingText(flow)}</h3>
						</div>
						<div className="col-xs-12">
							{flow === "login" && <LoginForm redirectUrl={redirectUrl} />}
							{flow === "signup" && <SignupForm redirectUrl={redirectUrl} />}
							{flow === "forgot-password" && <ForgotPasswordForm redirectUrl={redirectUrl} />}
						</div>
						<div className="col-xs-12">
							{flow === "signup" && (
								<>
									<span>Already have an account? </span>
									<Link href={{ pathname: "/auth", query: { flow: "login", redirectUrl: "" } }} as="/auth/login">
										<a>Login</a>
									</Link>
								</>
							)}
							{flow === "login" && (
								<>
									<span>Create new Account </span>
									<Link href={{ pathname: "/auth", query: { flow: "signup", redirectUrl: "" } }} as="/auth/signup">
										<a>Signup</a>
									</Link>
									<br />
									<Link
										href={{ pathname: "/auth", query: { flow: "forgot-password", redirectUrl: "/auth/login" } }}
										as="/auth/forgot-password?redirectUrl=/auth/login"
									>
										<a>Forgot Password?</a>
									</Link>
								</>
							)}
							{flow === "forgot-password" && (
								<>
									<span>Create new Account </span>
									<Link href={{ pathname: "/auth", query: { flow: "signup", redirectUrl: "" } }} as="/auth/signup">
										<a>Signup</a>
									</Link>
									<br />
									<span>Already have an account? </span>
									<Link href={{ pathname: "/auth", query: { flow: "login", redirectUrl: "" } }} as="/auth/login">
										<a>Login</a>
									</Link>
								</>
							)}
						</div>
					</div>
				</div>
			</div>
		</Layout>
	);
}

auth.getInitialProps = async ({ req, query: { flow, redirectUrl } }) => {
	const isServer = !!req;
	return { isServer, flow, redirectUrl };
};

auth.defaultProps = {
	flow: "",
	redirectUrl: ""
};

auth.propTypes = {
	isServer: PropTypes.bool.isRequired,
	flow: PropTypes.string,
	redirectUrl: PropTypes.string
};

export default auth;
