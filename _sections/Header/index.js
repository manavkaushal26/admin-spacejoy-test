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
	background: ${({ theme }) => theme.colors.white};
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	z-index: 10;
	&.raised {
		box-shadow: 0 0 10px 0px ${({ theme }) => theme.colors.mild.black};
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
		if (window.scrollY > 10) {
			this.setState({ isRaised: true });
		}
		if (window.scrollY <= 10) {
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
							<div className="grid text-left align-center">
								<div className="col-10">
									By using spacejoy.com, you agree with our use of cookies to improve performance.{" "}
									<ActiveLink href="/cookies" as="/cookies">
										Cookies Statement
									</ActiveLink>
								</div>
								<div className="col-2">
									<Button
										size="xs"
										variant="clean"
										fill="clean"
										onClick={this.updateCookiePolicyStatus}
										action="CookieClose"
										label="CookieClose"
										event="CookieClose"
										data={{ sectionName: "Cookie Bar" }}
									>
										<SVGIcon name="tick" height="15px" width="15px" fill="white" />
									</Button>
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
