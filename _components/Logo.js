import React from "react";
import styled from "styled-components";

const LogoStyled = styled.img`
	height: 25px;
`;

function Logo(props) {
	if ("md" in props) {
		return <LogoStyled src="https://res.cloudinary.com/spacejoy/image/upload/v1567070358/shared/logo_msn0nh.png" />;
	}
}

export default Logo;
