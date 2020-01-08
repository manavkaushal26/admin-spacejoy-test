import User from "@customTypes/userType";
import { allowedRoles } from "@utils/constants";
import React from "react";
import { HorizontalListStyled } from "./styled";

const navCenter = (authVerification: Partial<User>): JSX.Element => (
	<nav>{authVerification && allowedRoles.includes(authVerification.role) && <HorizontalListStyled align="left" />}</nav>
);

export default navCenter;
