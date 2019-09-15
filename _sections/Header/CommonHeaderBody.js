import Button from "@components/Button";
import Logo from "@components/Logo";
import { logout } from "@utils/auth";
import cookie from "js-cookie";
import React from "react";
import styled from "styled-components";
import ActiveLink from "./ActiveLink";

const HorizontalListStyled = styled.ul`
	text-align: ${({ align }) => align};
	margin: 0;
	padding: 0;
	li {
		display: inline-block;
		list-style: none;
		margin: 0 1.5rem;
		&:first-child {
			margin-left: 0;
		}
		&:last-child {
			margin-right: 0;
		}
	}
`;

const CommonHeaderBody = () => {
	const token = cookie.get("token");

	return (
		<div className="container">
			<div className="grid align-center justify-content-space-between">
				<div className="col-sm-12 col-md-4">
					<ActiveLink href="/" as="/">
						<Logo md />
					</ActiveLink>
				</div>
				<div className="col-sm-12 col-md-4 ">
					<nav>
						<HorizontalListStyled align="center">
							<li>
								<ActiveLink href="/designProjects" as="/designProjects">
									Design Projects
								</ActiveLink>
							</li>
							<li>
								<ActiveLink href="/faq" as="/faq">
									FAQ
								</ActiveLink>
							</li>
							<li>
								<ActiveLink href="/pricing" as="/pricing">
									Pricing
								</ActiveLink>
							</li>
						</HorizontalListStyled>
					</nav>
				</div>
				<div className="col-sm-12 col-md-4 ">
					<HorizontalListStyled align="right">
						<li>
							<ActiveLink href="/designMySpace" as="/designMySpace">
								Design My Space
							</ActiveLink>
						</li>
						<li>
							{!token && (
								<>
									<ActiveLink
										href={{ pathname: "/auth", query: { flow: "login", redirectUrl: "/faq" } }}
										as="/auth/login?redirectUrl=/faq"
										replace
									>
										Login /
									</ActiveLink>
									<ActiveLink
										href={{ pathname: "/auth", query: { flow: "signup", redirectUrl: "/faq" } }}
										as="/auth/signup?redirectUrl=/faq"
										replace
									>
										{" "}
										Signup
									</ActiveLink>
								</>
							)}
							{token && <Button onClick={logout}>Logout</Button>}
						</li>
					</HorizontalListStyled>
				</div>
			</div>
		</div>
	);
};

export default CommonHeaderBody;
