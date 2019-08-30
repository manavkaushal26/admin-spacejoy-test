import { company } from "@utils/config";
import React from "react";
import styled from "styled-components";

const LogoStyled = styled.img`
	height: 35px;
`;

function Logo(props) {
	if ("md" in props) {
		return <LogoStyled src={company.logo} />;
	}
}

export default Logo;
