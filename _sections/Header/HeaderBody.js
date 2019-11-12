import Button from "@components/Button";
import DropMenu from "@components/DropMenu";
import Logo from "@components/Logo";
import SVGIcon from "@components/SVGIcon";
import { logout } from "@utils/auth";
import PropTypes from "prop-types";
import React, { useState } from "react";
import styled from "styled-components";
import { Row, Col } from "antd";
import ActiveLink from "./ActiveLink";

const HorizontalListStyled = styled.ul`
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

const MobileHiddenStyled = styled(Col)`
	@media (max-width: 991px) {
		display: none;
	}
	img {
		padding: 20px 0 20px 0;
	}
`;

const MobileVisibleStyled = styled.div`
	@media (min-width: 991px) {
		display: none;
	}
	img {
		padding: 20px 0 20px 0;
	}
`;

const PaddedButton = styled(Button)`
	padding: 26px 0 26px 0;
`;

const MobileNavVisibleStyled = styled.div`
	position: fixed;
	background-color: white;
	width: 100%;
	top: 50px;
	left: 0;
	right: 0;
	box-shadow: 0px 10px 10px 0px ${({ theme }) => theme.colors.mild.black};
	transition: all 0.2s ease-in-out;
	pointer-events: none;
	opacity: 0;
	&.active {
		opacity: 1;
		top: 60px;
		pointer-events: auto;
	}
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

const OverlayStyled = styled.div`
	position: relative;
	&:before {
		opacity: 0;
		content: "";
		position: fixed;
		z-index: -1;
		top: 60px;
		left: 0;
		right: 0;
		background: ${({ theme }) => theme.colors.mild.black};
		transition: opacity 0.2s ease-in-out;
	}
	&.active {
		&:before {
			opacity: 1;
			bottom: 0;
		}
	}
	@media (min-width: 991px) {
		display: none;
	}
`;

const HeaderBody = ({ authVerification }) => {
	const [mobileNavStatus, updateMobileNavStatus] = useState(false);

	const navCenter = (
		<nav>
			{authVerification && authVerification.role === "customer" && (
				<HorizontalListStyled align="left">
					<li>
						<ActiveLink href="/dashboard" as="/designProjects">
							<span>Admin Dashboard</span>
							<small>Be a pro Admin</small>
						</ActiveLink>
					</li>
				</HorizontalListStyled>
			)}
		</nav>
	);

	const navRight = (
		<nav>
			<HorizontalListStyled align="right">
				<li>
					{authVerification && authVerification.role === "customer" ? (
						<DropMenu>
							<DropMenu.Header>
								<ActiveLink href={{ pathname: "/dashboard", query: {} }} as="/dashboard">
									{authVerification.name}
								</ActiveLink>
							</DropMenu.Header>
							<DropMenu.Body>
								<Button size="xs" shape="rounded" variant="secondary" fill="ghost" onClick={logout}>
									Logout
								</Button>
							</DropMenu.Body>
						</DropMenu>
					) : (
						<ActiveLink
							href={{ pathname: "/auth", query: { flow: "login", redirectUrl: "/dashboard" } }}
							as="/auth/login?redirectUrl=/dashboard"
							replace
						>
							Login
						</ActiveLink>
					)}
				</li>
			</HorizontalListStyled>
		</nav>
	);

	const handleClick = () => updateMobileNavStatus(!mobileNavStatus);

	return (
		<Row>
			<Row type="flex" justify="space-around" align="middle">
				<MobileHiddenStyled offset={1} span={3}>
					<ActiveLink href="/" as="/">
						<Logo md />
					</ActiveLink>
				</MobileHiddenStyled>
				<MobileHiddenStyled type="flex" justify="center" align="middle" span={13}>
					{navCenter}
				</MobileHiddenStyled>
				<MobileHiddenStyled align="middle" span={3}>
					{navRight}
				</MobileHiddenStyled>
			</Row>
			<Row>
				<Row type="flex" justify="space-around">
					<MobileVisibleStyled span={18}>
						<ActiveLink href="/" as="/">
							<Logo md />
						</ActiveLink>
					</MobileVisibleStyled>
					<MobileVisibleStyled align="right" span={10}>
						<PaddedButton variant="clean" size="xs" fill="clean" onClick={handleClick}>
							<SVGIcon name="menu" width={20} height={20} fill={mobileNavStatus ? "#e84393" : ""} />
						</PaddedButton>
					</MobileVisibleStyled>
				</Row>
				<Row>
					<MobileNavVisibleStyled span={24} className={`${mobileNavStatus ? "active" : ""}`}>
						{navCenter}
						{navRight}
					</MobileNavVisibleStyled>
				</Row>
				<Row>
					<OverlayStyled className={mobileNavStatus ? "active" : ""} onClick={handleClick} />
				</Row>
			</Row>
		</Row>
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

export default React.memo(HeaderBody);
