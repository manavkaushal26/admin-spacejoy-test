import User from "@customTypes/userType";
import { allowedRoles } from "@utils/constants";
import React from "react";
import Button from "@components/Button";
import { Typography } from "antd";
import styled from "styled-components";
import { HorizontalListStyled } from "./styled";
import ActiveLink from "./ActiveLink";

const { Text } = Typography;

const StyledText = styled(Text)`
	transition: all 0.3s;
	:hover {
		color: #40a9ff;
	}
`;

const navCenter = (authVerification: Partial<User>): JSX.Element => (
	<nav>
		{authVerification && allowedRoles.includes(authVerification.role) && (
			<HorizontalListStyled align="left">
				<li>
					<ActiveLink href="/launchpad" as="/launchpad">
						<Button raw>
							<StyledText className="nav-item" strong>
								Go to Launchpad
							</StyledText>
						</Button>
					</ActiveLink>
				</li>
			</HorizontalListStyled>
		)}
	</nav>
);

export default navCenter;
