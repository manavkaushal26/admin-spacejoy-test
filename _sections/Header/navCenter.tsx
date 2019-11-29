import User, { Role } from "@customTypes/userType";
import ActiveLink from "./ActiveLink";
import { HorizontalListStyled } from "./styled";


const navCenter = (authVerification:Partial<User>): JSX.Element => (
    <nav>
        {authVerification && (authVerification.role === Role.admin || authVerification.role === Role.designer || authVerification.role === Role.owner) && (
            <HorizontalListStyled align="left"/>
        )}
    </nav>
);

export default navCenter;