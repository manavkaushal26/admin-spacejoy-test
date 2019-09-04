import PropTypes from "prop-types";
import React, { PureComponent } from "react";
import styled from "styled-components";
import CommonHeaderBody from "./CommonHeaderBody";

const HeaderStyled = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	z-index: 10;
	justify-content: center;
	align-items: center;
	display: flex;
	&.raised {
		box-shadow: 0 0 10px 0px rgba(0, 0, 0, 0.1);
	}
`;

const TransparentHeaderStyled = styled(HeaderStyled)`
	color: ${({ theme }) => theme.colors.primary};
`;

const SolidHeaderStyled = styled(HeaderStyled)`
	background: ${({ theme }) => theme.colors.bg.light1};
`;

class Header extends PureComponent {
	state = {
		isRaised: false
	};

	componentDidMount = () => {
		window.addEventListener("scroll", this.handleScroll);
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

	render() {
		const { variant } = this.props;
		const { isRaised } = this.state;
		switch (variant) {
			case "transparent":
				return <TransparentHeaderStyled>{CommonHeaderBody()}</TransparentHeaderStyled>;
			case "solid":
				return <SolidHeaderStyled className={isRaised ? "raised" : null}>{CommonHeaderBody()}</SolidHeaderStyled>;
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
