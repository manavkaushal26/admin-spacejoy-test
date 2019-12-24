import Button from "@components/Button";
import SVGIcon from "@components/SVGIcon";
import cookie from "js-cookie";
import React, { PureComponent } from "react";
import styled from "styled-components";
import ActiveLink from "./ActiveLink";
import HeaderBody from "./HeaderBody";

const CookieStyled = styled.div`
	background: ${({ theme }) => theme.colors.fc.dark1};
	color: white;
	a {
		color: ${({ theme }) => theme.colors.accent};
	}
`;

const HeaderStyled = styled.div`
	border-bottom: 1px #eaeaea solid;
	background: ${({ theme }) => theme.colors.white};
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	z-index: 10;
`;

class Header extends PureComponent {
	state = {
		isRaised: false
	};

	render() {
		const { isRaised } = this.state;
		return (
			<HeaderStyled className={isRaised ? "raised" : null}>
				<HeaderBody {...this.props} />
			</HeaderStyled>
		);
	}
}

export default React.memo(Header);
