import Image from "@components/Image";
import cookie from "js-cookie";
import React, { PureComponent } from "react";
import styled from "styled-components";
import ActiveLink from "./ActiveLink";
import HeaderBody from "./HeaderBody";

const CookieStyled = styled.div`
	background: ${({ theme }) => theme.colors.fc.dark1};
	color: white;
	a {
		color: ${({ theme }) => theme.colors.primary1};
	}
`;

const HeaderStyled = styled.div`
	background: ${({ theme }) => theme.colors.bg.light1};
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	z-index: 10;
	&.raised {
		box-shadow: 0 0 10px 0px rgba(0, 0, 0, 0.1);
	}
`;

class Header extends PureComponent {
	state = {
		isRaised: false,
		cookiePolicyStatus: true
	};

	componentDidMount = () => {
		window.addEventListener("scroll", this.handleScroll);
		this.setState({ cookiePolicyStatus: cookie.get("cookie-policy") });
	};

	componentWillUnmount = () => {
		window.removeEventListener("scroll", this.handleScroll);
	};

	handleScroll = () => {
		if (window.scrollY > 65) {
			this.setState({ isRaised: true });
		}
		if (window.scrollY <= 65) {
			this.setState({ isRaised: false });
		}
	};

	updateCookiePolicyStatus = () => {
		cookie.set("cookie-policy", true, { expires: 30 });
		this.setState({ cookiePolicyStatus: true });
	};

	render() {
		const { isRaised, cookiePolicyStatus } = this.state;
		return (
			<HeaderStyled className={isRaised ? "raised" : null}>
				{!cookiePolicyStatus && (
					<CookieStyled className="text-center">
						<div className="container">
							<div className="grid">
								<div className="col-10">
									By using spacejoy.com, you agree with our use of cookies to improve performance.{" "}
									<ActiveLink href="/cookies" as="/cookies">
										Cookies Statement
									</ActiveLink>
								</div>
								<div className="col-2">
									<Image
										onClick={this.updateCookiePolicyStatus}
										size="16px"
										src="https://res.cloudinary.com/spacejoy/image/upload/v1568567510/web/cancel_dl7sw1.svg"
										style={{ cursor: "pointer" }}
									/>
								</div>
							</div>
						</div>
					</CookieStyled>
				)}
				<HeaderBody {...this.props} />
			</HeaderStyled>
		);
	}
}

export default Header;
