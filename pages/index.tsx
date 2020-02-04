import ForgotPasswordForm from "@sections/Forms/ForgotPasswordForm";
import LoginForm from "@sections/Forms/LoginForm";
import ResetPasswordForm from "@sections/Forms/ResetPasswordForm";
import Layout from "@sections/Layout";
import Head from "next/head";
import Link from "next/link";
import React, { useEffect } from "react";
import { allowedRoles } from "@utils/constants";
import { NextPage } from "next";
import User, { Role } from "@customTypes/userType";
import { withAuthVerification, redirectToLocation } from "../_utils/auth";
import { company } from "../_utils/config";

function getHeadingText(flow): JSX.Element {
	switch (flow) {
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
			return <></>;
	}
}

interface Auth {
	isServer: boolean;
	flow: string;
	redirectUrl: string;
	authVerification: Partial<User>;
	token: string;
}

const auth: NextPage<Auth> = ({ isServer, authVerification, flow = "login", redirectUrl, token }) => {
	useEffect(() => {
		if (allowedRoles.includes(authVerification.role)) {
			redirectToLocation({ pathname: "/launchpad", url: "/launchpad" });
		}
	}, [authVerification]);

	const renderLoginLink = (
		<Link
			href={{ pathname: "/auth", query: { flow: "login", redirectUrl } }}
			as={redirectUrl ? `/auth/login?redirectUrl=${redirectUrl}` : "/auth/login"}
			replace
		>
			<a href={redirectUrl ? `/auth/login?redirectUrl=${redirectUrl}` : "/auth/login"}>Login</a>
		</Link>
	);

	return (
		<Layout isServer={isServer} authVerification={authVerification}>
			<Head>
				<title>
					{flow} | {company.product}
				</title>
			</Head>
			<div className="container">
				<div className="grid text-center">
					<div className="col-12 col-sm-8 col-md-6 col-lg-4">
						<div className="col-12">{getHeadingText(flow)}</div>
						{flow === "login" && (
							<div className="col-12">
								<LoginForm redirectUrl={redirectUrl} />
							</div>
						)}

						{flow === "forgot-password" && (
							<>
								<div className="col-12">
									<ForgotPasswordForm />
								</div>
								<span>Already have an account? </span>
								{renderLoginLink}
							</>
						)}
						{flow === "reset-password" && <ResetPasswordForm redirectUrl={redirectUrl} token={token} />}
					</div>
				</div>
			</div>
		</Layout>
	);
};

auth.getInitialProps = async ({ req, query: { flow, redirectUrl, token } }): Promise<Auth> => {
	const isServer = !!req;
	const authVerification = {
		name: "",
		role: Role.Guest,
	};

	const flowAsString = flow as string;
	const redirectUrlAsString = redirectUrl as string;
	const tokenAsString = token as string;

	return { isServer, flow: flowAsString, redirectUrl: redirectUrlAsString, authVerification, token: tokenAsString };
};

export default withAuthVerification(auth);
