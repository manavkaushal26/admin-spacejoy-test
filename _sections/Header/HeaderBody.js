import Button from "@components/Button";
import Logo from "@components/Logo";
import { logout } from "@utils/auth";
import cookie from "js-cookie";
import React, { useState } from "react";
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
		@media (max-width: 991px) {
			display: block;
			margin: 1.5rem 0;
			text-align: center;
		}
	}
`;

const MobileHiddenStyled = styled.div`
	@media (max-width: 991px) {
		display: none;
	}
`;

const MobileVisibleStyled = styled.div`
	@media (min-width: 991px) {
		display: none;
	}
`;

const MobileNavVisibleStyled = styled.div`
	position: fixed;
	background-color: white;
	width: 100%;
	top: 60px;
	left: 0;
	right: 0;
	a {
		display: block;
	}
	img {
		display: inline-block;
	}
	@media (min-width: 990px) {
		display: block;
	}
`;

const HeaderBody = () => {
	const token = cookie.get("token");

	const [mobileNavStatus, updateMobileNavStatus] = useState(false);

	const navCenter = (
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
	);

	const navRight = (
		<nav>
			<HorizontalListStyled align="right">
				<li>
					<ActiveLink href="/designMySpace" as="/designMySpace">
						Design My Space
					</ActiveLink>
				</li>
				<li>
					{!token && (
						<ActiveLink
							href={{ pathname: "/auth", query: { flow: "login", redirectUrl: "/faq" } }}
							as="/auth/login?redirectUrl=/faq"
							replace
						>
							Login
						</ActiveLink>
					)}
					{token && (
						<Button size="xs" shape="rounded" variant="secondary" fill="ghost" onClick={logout}>
							Logout
						</Button>
					)}
				</li>
			</HorizontalListStyled>
		</nav>
	);

	const handleClick = () => updateMobileNavStatus(!mobileNavStatus);

	return (
		<div className="container">
			<div className="grid align-center justify-content-space-between">
				<MobileHiddenStyled className="col-4">
					<ActiveLink href="/" as="/">
						<Logo md />
					</ActiveLink>
				</MobileHiddenStyled>
				<MobileHiddenStyled className="col-4">{navCenter}</MobileHiddenStyled>
				<MobileHiddenStyled className="col-4">{navRight}</MobileHiddenStyled>
				<MobileVisibleStyled className="col-8">
					<ActiveLink href="/" as="/">
						<Logo md />
					</ActiveLink>
				</MobileVisibleStyled>
				<MobileVisibleStyled className="col-4 text-right">
					<Button size="xs" fill="ghost" onClick={handleClick}>
						MENU
					</Button>
				</MobileVisibleStyled>
				{mobileNavStatus && (
					<MobileNavVisibleStyled className="col-12">
						{navCenter}
						{navRight}
					</MobileNavVisibleStyled>
				)}
			</div>
		</div>
	);
};

export default HeaderBody;