import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import SVGIcon from "./SVGIcon";

const ListWrapperStyled = styled.ul`
	margin: 0;
	padding: 0;
`;

const ListStyled = styled.li`
	list-style: none;
	position: relative;
	margin: 0.25rem 0;
	svg {
		margin-right: 0.5rem;
		padding: 2px;
	}
`;

const ListActiveStyled = styled(ListStyled)`
	svg {
		background: ${({ theme }) => theme.colors.green};
		border-radius: 7px;
		path {
			fill: white;
		}
	}
`;

const ListInActiveStyled = styled(ListStyled)`
	color: ${({ theme }) => theme.colors.fc.dark3};
	svg {
		path {
			fill: ${({ theme }) => theme.colors.fc.dark3};
		}
	}
`;

function BenefitList({ children }) {
	return <ListWrapperStyled>{children}</ListWrapperStyled>;
}

BenefitList.Active = ({ children }) => (
	<ListActiveStyled>
		<SVGIcon name="tick" height="14" width="14" />
		<small>{children}</small>
	</ListActiveStyled>
);

BenefitList.InActive = ({ children }) => (
	<ListInActiveStyled>
		<SVGIcon name="cross" height="14" width="14" />
		<small>{children}</small>
	</ListInActiveStyled>
);

BenefitList.Active.defaultProps = {
	children: null
};

BenefitList.Active.propTypes = {
	children: PropTypes.node
};

BenefitList.InActive.defaultProps = {
	children: null
};

BenefitList.InActive.propTypes = {
	children: PropTypes.node
};

BenefitList.defaultProps = {
	children: null
};

BenefitList.propTypes = {
	children: PropTypes.node
};

export default BenefitList;
