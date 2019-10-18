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
	}
`;

const ListActiveStyled = styled(ListStyled)`
	&.neutral {
		svg {
			path {
				fill: ${({ theme }) => theme.colors.fc.dark3};
			}
		}
	}
	&.positive {
		svg {
			path {
				fill: ${({ theme }) => theme.colors.green};
			}
		}
	}
	&.negative {
		svg {
			path {
				fill: ${({ theme }) => theme.colors.red};
			}
		}
	}
`;

const DotStyled = styled.span`
	display: inline-block;
	height: ${({ height }) => height / 2}px;
	width: ${({ width }) => width / 2}px;
	background: ${({ theme }) => theme.colors.fc.light2};
	margin-right: 1rem;
	border-radius: 10px;
	position: relative;
	top: -1px;
`;

function BenefitList({ children }) {
	return <ListWrapperStyled>{children}</ListWrapperStyled>;
}

BenefitList.Item = ({ children, icon, nature }) => (
	<ListActiveStyled className={nature}>
		{icon !== "dot" && <SVGIcon name={icon} height={12} width={12} />}
		{icon === "dot" && <DotStyled name={icon} height={12} width={12} />}
		<span>{children}</span>
	</ListActiveStyled>
);

BenefitList.Item.defaultProps = {
	children: null,
	icon: "dot",
	nature: "neutral"
};

BenefitList.Item.propTypes = {
	children: PropTypes.node,
	icon: PropTypes.string,
	nature: PropTypes.string
};

BenefitList.defaultProps = {
	children: null
};

BenefitList.propTypes = {
	children: PropTypes.node
};

export default BenefitList;
