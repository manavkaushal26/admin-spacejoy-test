import User, { Role } from "@customTypes/userType";
import ActiveLink from "./ActiveLink";
import { HorizontalListStyled } from "./styled";


const navCenter = (authVerification:Partial<User>): JSX.Element => (
    <nav>
        {authVerification && authVerification.role === Role.customer && (
            <HorizontalListStyled align="left">
                <li>
                    <ActiveLink href="/dashboard" as="/dashboard">
                        <span>Admin Dashboard</span>
                        <small>Be a pro Admin</small>
                    </ActiveLink>
                </li>
            </HorizontalListStyled>
        )}
    </nav>
);

export default navCenter;