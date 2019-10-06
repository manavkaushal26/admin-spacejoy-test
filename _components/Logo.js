import { company } from "@utils/config";
import React from "react";
import styled from "styled-components";
import Image from "./Image";

const LogoStyled = styled(Image)`
	height: 30px;
`;

function Logo(props) {
	if ("md" in props) {
		return <LogoStyled src={company.logo} alt="Spacejoy Logo" />;
	}
}

export default Logo;
