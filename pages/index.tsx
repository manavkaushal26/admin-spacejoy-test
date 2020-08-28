import ForgotPasswordForm from "@sections/Forms/ForgotPasswordForm";
import LoginForm from "@sections/Forms/LoginForm";
import ResetPasswordForm from "@sections/Forms/ResetPasswordForm";
import Layout from "@sections/Layout";
import useAuth, { redirectToLocation } from "@utils/authContext";
import { allowedRoles } from "@utils/constants";
import { Col, Row } from "antd";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import React, { useEffect } from "react";
import { company } from "../_utils/config";

function getHeadingText(flow): JSX.Element {
	switch (flow) {
		case "login":
			return <h3>Welcome</h3>;
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
	flow: string;
	redirectUrl: string;
	token: string;
}

const auth: NextPage<Auth> = ({ flow = "login", redirectUrl, token }) => {
	const { user } = useAuth();

	useEffect(() => {
		if (allowedRoles.includes(user?.role)) {
			redirectToLocation({ pathname: "/launchpad", url: "/launchpad" });
		}
	}, [user]);

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
		<Layout>
			<Head>
				<title>
					{flow} | {company.product}
				</title>
			</Head>
			<Row style={{ paddingTop: "2rem" }} justify='center'>
				<Col xs={24} sm={20} md={20}>
					<Row justify='center'>
						<Col span={12}>
							<Row justify='center'>{getHeadingText(flow)}</Row>
						</Col>
						<Col span={24}>
							{flow === "login" && (
								<div className='col-12'>
									<LoginForm redirectUrl={redirectUrl} />
								</div>
							)}

							{flow === "forgot-password" && (
								<>
									<div className='col-12'>
										<ForgotPasswordForm />
									</div>
									<span>Already have an account? </span>
									{renderLoginLink}
								</>
							)}
							{flow === "reset-password" && <ResetPasswordForm redirectUrl={redirectUrl} token={token} />}
						</Col>
					</Row>
				</Col>
			</Row>
		</Layout>
	);
};

export const getServerSideProps: GetServerSideProps<Auth> = async ({ query: { flow, redirectUrl, token } }) => {
	const flowAsString = (flow || "login") as string;
	const redirectUrlAsString = (redirectUrl || "/launchpad") as string;
	const tokenAsString = (token || null) as string;

	return {
		props: { flow: flowAsString, redirectUrl: redirectUrlAsString, token: tokenAsString },
	};
};

export default auth;
