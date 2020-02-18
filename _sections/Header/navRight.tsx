import Button from "@components/Button";
import DropMenu from "@components/DropMenu";
import User from "@customTypes/userType";
import { logout } from "@utils/auth";
import { allowedRoles } from "@utils/constants";
import React from "react";
import ActiveLink from "./ActiveLink";
import { HorizontalListStyled } from "./styled";

const navRight = (authVerification: Partial<User>): JSX.Element => (
	<nav>
		<HorizontalListStyled align="right">
			<li>
				{authVerification && allowedRoles.includes(authVerification.role) ? (
					<DropMenu>
						<DropMenu.Header>
							<ActiveLink href="/dashboard" as="/dashboard">
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

export default navRight;
