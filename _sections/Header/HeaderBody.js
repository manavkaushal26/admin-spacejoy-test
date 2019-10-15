import Button from "@components/Button";
import DropMenu from "@components/DropMenu";
import Logo from "@components/Logo";
import SVGIcon from "@components/SVGIcon";
import { logout } from "@utils/auth";
import PropTypes from "prop-types";
import React, { useState } from "react";
import styled from "styled-components";
import ActiveLink from "./ActiveLink";

const HorizontalListStyled = styled.ul`
	text-align: ${({ align }) => align};
	margin: 0;
	padding: 0;
	li {
		line-height: normal;
		text-align: left;
		display: inline-block;
		list-style: none;
		margin: 0 1.5rem;
		&:first-child {
			margin-left: 0;
		}
		&:last-child {
			margin-right: 0;
		}
		span {
			display: block;
			font-weight: bold;
			padding-bottom: 2px;
			& + {
				small {
					color: ${({ theme }) => theme.colors.fc.dark2};
				}
			}
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
	box-shadow: 0px 10px 10px 0px ${({ theme }) => theme.colors.mild.black};
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

const HeaderBody = ({ authVerification }) => {
	const [mobileNavStatus, updateMobileNavStatus] = useState(false);

	const navCenter = (
		<nav>
			<HorizontalListStyled align="left">
				<li>
					<ActiveLink href="/designProjects" as="/designProjects">
						<span>Design Projects</span>
						<small>Explore stunning design layouts</small>
					</ActiveLink>
				</li>
				<li>
					<ActiveLink href="/pricing" as="/pricing">
						<span>Pricing</span>
						<small>Starting From $19</small>
					</ActiveLink>
				</li>
				<li>
					<ActiveLink href="/designMySpace" as="/designMySpace">
						<span>Design My Space</span>
						<small>Express Start</small>
					</ActiveLink>
				</li>
			</HorizontalListStyled>
		</nav>
	);

	const navRight = (
		<nav>
			<HorizontalListStyled align="right">
				<li>
					<ActiveLink href="/faq" as="/faq">
						FAQ
					</ActiveLink>
				</li>
				<li>
					{(authVerification === {} || authVerification.role === "guest") && (
						<ActiveLink
							href={{ pathname: "/auth", query: { flow: "login", redirectUrl: "/dashboard" } }}
							as="/auth/login?redirectUrl=/dashboard"
							replace
						>
							Login
						</ActiveLink>
					)}
					{authVerification.role === "customer" && (
						<DropMenu>
							<DropMenu.Header>
								<ActiveLink href={{ pathname: "/dashboard", query: {} }} as="/dashboard">
									<SVGIcon name="avatar" /> {authVerification.name}
								</ActiveLink>
							</DropMenu.Header>
							<DropMenu.Body>
								<ActiveLink href={{ pathname: "/profile", query: {} }} as="/profile">
									Profile
								</ActiveLink>
								<Button size="xs" shape="rounded" variant="secondary" fill="ghost" onClick={logout}>
									Logout
								</Button>
							</DropMenu.Body>
						</DropMenu>
					)}
				</li>
			</HorizontalListStyled>
		</nav>
	);

	const handleClick = () => updateMobileNavStatus(!mobileNavStatus);

	return (
		<div className="container">
			<div className="grid align-center justify-content-space-between">
				<MobileHiddenStyled className="col-2">
					<ActiveLink href="/" as="/">
						<Logo md />
					</ActiveLink>
				</MobileHiddenStyled>
				<MobileHiddenStyled className="col-7">{navCenter}</MobileHiddenStyled>
				<MobileHiddenStyled className="col-3">{navRight}</MobileHiddenStyled>
				<MobileVisibleStyled className="col-8">
					<ActiveLink href="/" as="/">
						<Logo md />
					</ActiveLink>
				</MobileVisibleStyled>
				<MobileVisibleStyled className="col-4 text-right">
					<Button variant="clean" size="xs" fill="clean" onClick={handleClick}>
						<SVGIcon name="menu" width={20} height={20} fill={mobileNavStatus ? "#e84393" : ""} />
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

HeaderBody.defaultProps = {
	authVerification: {
		name: "",
		role: "guest"
	}
};

HeaderBody.propTypes = {
	authVerification: PropTypes.shape({
		role: PropTypes.string,
		name: PropTypes.string
	})
};

export default HeaderBody;
