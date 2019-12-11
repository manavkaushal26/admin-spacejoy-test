import User, { Role } from "@customTypes/userType";
import ActiveLink from "./ActiveLink";
import { HorizontalListStyled } from "./styled";

const navCenter = (authVerification: Partial<User>): JSX.Element => (
	<nav>
		{authVerification &&
			(authVerification.role === Role.Admin ||
				authVerification.role === Role.Designer ||
				authVerification.role === Role.Owner) && <HorizontalListStyled align="left" />}
	</nav>
);

export default navCenter;
