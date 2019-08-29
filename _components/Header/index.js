import Logo from "@components/Logo";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const HeaderStyled = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	z-index: 10;
	height: 55px;
	justify-content: center;
	align-items: center;
	display: flex;
	box-shadow: 0 0 10px 0px rgba(0, 0, 0, 0.1);
`;

const TransparentHeaderStyled = styled(HeaderStyled)`
	color: ${({ theme }) => theme.colors.primary};
`;

const SolidHeaderStyled = styled(HeaderStyled)`
	background: ${({ theme }) => theme.colors.bg.light1};
`;

const HorizontalListStyled = styled.ul`
	margin: 0;
	padding: 0;
	li {
		display: inline-block;
		list-style: none;
		margin-right: 2.5rem;
		&:last-child {
			margin-right: 0rem;
		}
	}
`;

const renderHeaderBody = () => {
	return (
		<div className="container">
			<div className="grid">
				<div className="col-xs-3 align-left">
					<Logo md />
				</div>
				<div className="col-xs-6 align-center">
					<nav>
						<HorizontalListStyled>
							<li>Designs</li>
							<li>Pricing</li>
							<li>FAQs</li>
						</HorizontalListStyled>
					</nav>
				</div>
				<div className="col-xs-3 align-right">
					<nav>
						<HorizontalListStyled>
							<li>Design My Space</li>
							<li>{/* <span>S</span>
								<div className="dropDown">Hi</div> */}</li>
						</HorizontalListStyled>
					</nav>
				</div>
			</div>
		</div>
	);
};

function Header({ variant }) {
	switch (variant) {
		case "transparent":
			return <TransparentHeaderStyled>{renderHeaderBody()}</TransparentHeaderStyled>;
		case "solid":
			return <SolidHeaderStyled>{renderHeaderBody()}</SolidHeaderStyled>;
		default:
			return <SolidHeaderStyled />;
	}
}

Header.propTypes = {
	variant: PropTypes.string
};

Header.defaultProps = {
	variant: "solid"
};

export default Header;
