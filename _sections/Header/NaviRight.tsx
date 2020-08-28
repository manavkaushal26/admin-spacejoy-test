import Button from "@components/Button";
import DropMenu from "@components/DropMenu";
import User from "@customTypes/userType";
import { allowedRoles } from "@utils/constants";
import React from "react";
import ActiveLink from "./ActiveLink";
import { HorizontalListStyled } from "./styled";

interface NavRight {
	authVerification: Partial<User>;
	logout: () => Promise<void>;
}
const NavRight: React.FC<NavRight> = ({ authVerification, logout }) => {
	return (
		<nav>
			<HorizontalListStyled align='right'>
				<li>
					{authVerification && allowedRoles.includes(authVerification.role) ? (
						<DropMenu>
							<DropMenu.Header>
								<ActiveLink href='/dashboard' as='/dashboard'>
									{authVerification.name}
								</ActiveLink>
							</DropMenu.Header>
							<DropMenu.Body>
								<Button size='xs' shape='rounded' variant='secondary' fill='ghost' onClick={logout}>
									Logout
								</Button>
							</DropMenu.Body>
						</DropMenu>
					) : (
						<ActiveLink
							href={{ pathname: "/auth", query: { flow: "login", redirectUrl: "/dashboard" } }}
							as='/auth/login?redirectUrl=/dashboard'
							replace
						>
							Login
						</ActiveLink>
					)}
				</li>
			</HorizontalListStyled>
		</nav>
	);
};

export default NavRight;
