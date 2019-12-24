import User, { Role } from "@customTypes/userType";
import ActiveLink from "./ActiveLink";
import { HorizontalListStyled } from "./styled";
import { allowedRoles } from "@utils/constants";

const navCenter = (authVerification: Partial<User>): JSX.Element => (
	<nav>{authVerification && allowedRoles.includes(authVerification.role) && <HorizontalListStyled align="left" />}</nav>
);

export default navCenter;
