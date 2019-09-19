import Image from "@components/Image";
import cookie from "js-cookie";
import PropTypes from "prop-types";
import React, { PureComponent } from "react";
import styled from "styled-components";
import ActiveLink from "./ActiveLink";
import CommonHeaderBody from "./CommonHeaderBody";

const CookieStyled = styled.div`
	background: ${({ theme }) => theme.colors.fc.dark1};
	color: white;
	a {
		color: ${({ theme }) => theme.colors.primary1};
	}
`;

const HeaderStyled = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	z-index: 10;
	&.raised {
		box-shadow: 0 0 10px 0px rgba(0, 0, 0, 0.1);
	}
`;

const TransparentHeaderStyled = styled(HeaderStyled)`
	color: ${({ theme }) => theme.colors.primary1};
`;

const SolidHeaderStyled = styled(HeaderStyled)`
	background: ${({ theme }) => theme.colors.bg.light1};
`;

class Header extends PureComponent {
	state = {
		isRaised: false,
		cookieStatus: true
	};

	componentDidMount = () => {
		window.addEventListener("scroll", this.handleScroll);
		this.setState({ cookieStatus: cookie.get("cookie-policy") });
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

	updateCookieStatus = () => {
		cookie.set("cookie-policy", true, { expires: 30 });
		this.setState({ cookieStatus: true });
	};

	render() {
		const { variant } = this.props;
		const { isRaised, cookieStatus } = this.state;
		switch (variant) {
			case "transparent":
				return <TransparentHeaderStyled>{CommonHeaderBody()}</TransparentHeaderStyled>;
			case "solid":
				return (
					<SolidHeaderStyled className={isRaised ? "raised" : null}>
						{!cookieStatus && (
							<CookieStyled className="text-center">
								<div className="container">
									<div className="grid">
										<div className="col-xs-10">
											By using spacejoy.com, you agree with our use of cookies to improve performance.{" "}
											<ActiveLink href="/cookies" as="/cookies">
												Cookies Statement
											</ActiveLink>
										</div>
										<div className="col-xs-2">
											<Image
												onClick={this.updateCookieStatus}
												size="16px"
												src="https://res.cloudinary.com/spacejoy/image/upload/v1568567510/web/cancel_dl7sw1.svg"
												style={{ cursor: "pointer" }}
											/>
										</div>
									</div>
								</div>
							</CookieStyled>
						)}
						{CommonHeaderBody()}
					</SolidHeaderStyled>
				);
			default:
				return <SolidHeaderStyled />;
		}
	}
}

Header.propTypes = {
	variant: PropTypes.string
};

Header.defaultProps = {
	variant: "solid"
};

export default Header;
