import PropTypes from "prop-types";
import React, { PureComponent } from "react";
import styled from "styled-components";

const ExpandStyled = styled.div`
	text-align: center;
	display: none;
	position: absolute;
	right: 0rem;
	top: 3rem;
	padding: 0 0.75rem;
	background: white;
	border-radius: 5px;
	width: 150px;
	border-top: 1px solid ${({ theme }) => theme.colors.bg.dark2};
	box-shadow: 0 0px 10px 0px rgba(0, 0, 0, 0.1);
	&:before {
		content: "";
		position: absolute;
		top: -0.4rem;
		right: 1.5rem;
		height: 0.75rem;
		width: 0.75rem;
		background: white;
		transform: rotate(45deg);
		border-top: 1px solid ${({ theme }) => theme.colors.bg.dark2};
		border-left: 1px solid ${({ theme }) => theme.colors.bg.dark2};
	}
	&:after {
		content: "";
		position: absolute;
		top: -1.5rem;
		right: 0rem;
		left: 0;
		height: 1.5rem;
	}
	ul {
		margin: 0;
		padding: 0;
		li {
			display: block;
			padding: 0.75rem 0rem;
			margin: 0;
			border-bottom: 1px solid rgba(0, 0, 0, 0.05);
			&:last-child {
				border-bottom: none;
			}
		}
	}
`;

const DropMenuStyled = styled.div`
	position: relative;
	&:hover {
		${ExpandStyled} {
			display: block;
		}
	}
`;

class DropMenu extends PureComponent {
	static Header = ({ children }) => <div>{children}</div>;

	static Body = ({ children }) => (
		<ul>
			{React.Children.map(children, child => (
				<li>{child}</li>
			))}
		</ul>
	);

	render() {
		const { children } = this.props;
		return (
			<DropMenuStyled>
				{children[0]}
				<ExpandStyled>{children[1]}</ExpandStyled>
			</DropMenuStyled>
		);
	}
}

DropMenu.propTypes = {
	children: PropTypes.node.isRequired
};

export default DropMenu;
