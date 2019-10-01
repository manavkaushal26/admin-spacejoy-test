import PropTypes from "prop-types";
import React, { PureComponent } from "react";
import styled from "styled-components";

const WildCardStyled = styled.div`
	position: relative;
	border-color: ${({ theme }) => theme.colors.bg.light2};
	border-width: 1px;
	border-style: solid;
	height: 100%;
	padding-top: 5rem;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: space-between;
`;

class WildCard extends PureComponent {
	render() {
		const { children } = this.props;
		return <WildCardStyled>{children}</WildCardStyled>;
	}
}

WildCard.propTypes = {
	children: PropTypes.node.isRequired
};

export default WildCard;
