import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const StepperWrapper = styled.div`
	margin: 1rem 0;
	border-radius: 5px;
	padding: 1rem 0;
	display: flex;
	/* background: ${({ theme }) => theme.colors.bg.light1}; */
`;

const StepTitle = styled.span`
	margin-top: 0.5rem;
	display: inline-block;
	font-family: inherit;
	font-size: 0.8em;
`;

const StepCount = styled.div`
	cursor: pointer;
	position: relative;
	height: 20px;
	width: 70px;
	line-height: 29px;
	height: 29px;
	margin: auto;
	z-index: 1;
	border: 1px solid ${({ theme }) => theme.colors.fc.dark2};
	&.active {
		border: 1px solid ${({ theme }) => theme.colors.accent};
		color: ${({ theme }) => theme.colors.accent};
		font-weight: bold;
		&:after,
		&:before {
			border-top: 1px solid ${({ theme }) => theme.colors.accent};
		}
		& + {
			${StepTitle} {
				color: ${({ theme }) => theme.colors.accent};
			}
		}
	}
	&:after,
	&:before {
		content: "";
		position: absolute;
		top: 14px;
		width: 200px;
		border-top: 1px dashed ${({ theme }) => theme.colors.bg.dark1};
	}
	&:before {
		right: -200px;
	}
	&:after {
		left: -200px;
	}
`;

const StepBlock = styled.div`
	overflow: hidden;
	flex: 1;
	&:first-child {
		${StepCount} {
			&:after {
				display: none;
			}
		}
	}
	&:last-child {
		${StepCount} {
			&:before {
				display: none;
			}
		}
	}
`;

function index({ children }) {
	return <StepperWrapper>{children}</StepperWrapper>;
}

index.Step = ({ title, description, isActive, onClick }) => (
	<StepBlock>
		<StepCount className={isActive ? "active" : ""} onClick={onClick}>
			{title}
		</StepCount>
		<StepTitle>{description}</StepTitle>
	</StepBlock>
);

index.Step.propTypes = {
	title: PropTypes.string,
	description: PropTypes.string,
	isActive: PropTypes.bool,
	onClick: PropTypes.func
};

index.Step.defaultProps = {
	title: "",
	description: "",
	isActive: false,
	onClick: () => {}
};

index.propTypes = {
	children: PropTypes.node.isRequired
};

export default index;
