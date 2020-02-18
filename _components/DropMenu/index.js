import PropTypes from "prop-types";
import React, { PureComponent } from "react";
import styled from "styled-components";

const ExpandStyled = styled.div`
	text-align: center;
	display: none;
	position: absolute;
	right: 0rem;
	top: 3rem;
	background: white;
	border-radius: 5px;
	max-width: 300px;
	box-shadow: 0 -3px 6px 2px ${({ theme }) => theme.colors.mild.black};
	&:before {
		content: "";
		position: absolute;
		top: -0.5rem;
		right: 1.5rem;
		height: 1rem;
		width: 1rem;
		background: ${({ theme }) => theme.colors.bg.light2};
		transform: rotate(45deg);
	}
	&:after {
		content: "";
		position: absolute;
		top: -1.75rem;
		right: 0rem;
		left: 0;
		height: 1.75rem;
	}
	ul {
		margin: 0;
		padding: 0;
		li {
			display: block;
			padding: 0.85rem 1.15rem;
			margin: 0;
			&:first-child {
				color: ${({ theme }) => theme.colors.fc.dark2};
				border-radius: 5px 5px 0 0;
				background: ${({ theme }) => theme.colors.bg.light2};
			}
			&:last-child {
				border-radius: 0 0 5px 5px;
				text-transform: uppercase;
				background: ${({ theme }) => theme.colors.bg.light2};
				button {
					color: ${({ theme }) => theme.colors.red};
				}
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
	static Header = ({ children }) => <>{children}</>;

	static Body = ({ children }) => (
		<ExpandStyled>
			<ul>
				{React.Children.map(children, child => (
					<li>{child}</li>
				))}
			</ul>
		</ExpandStyled>
	);

	render() {
		const { children } = this.props;
		return <DropMenuStyled>{children}</DropMenuStyled>;
	}
}

DropMenu.propTypes = {
	children: PropTypes.node.isRequired,
};

export default DropMenu;
