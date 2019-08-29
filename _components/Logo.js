import React from "react";
import styled from "styled-components";

const LogoStyled = styled.img`
	height: 35px;
`;

function Logo(props) {
	if ("md" in props) {
		return <LogoStyled src="https://res.cloudinary.com/spacejoy/image/upload/v1567082857/shared/logo_hcs7lo.png" />;
	}
}

export default Logo;
