import { PhaseInternalNames } from "@customTypes/dashboardTypes";
import { Status } from "@customTypes/userType";
import { Button, Carousel, Col, Divider, Input, Tag, Typography } from "antd";
import styled, { css, FlattenSimpleInterpolation } from "styled-components";

const { Text, Paragraph } = Typography;

export const FontCorrectedPre = styled.pre`
	font-family: inherit;
`;

export const getTagColor = (text: string): string => {
	switch (text) {
		case Status.active:
		case PhaseInternalNames.requirement:
			return "blue";
		case Status.pending:
		case PhaseInternalNames.designRender:
			return "orange";
		case Status.inactive:
		case PhaseInternalNames.onHold:
			return "";
		case Status.suspended:
		case PhaseInternalNames.suspended:
			return "magenta";
		case Status.closed:
		case PhaseInternalNames.rejected:
			return "red";
		case Status.completed:
		case PhaseInternalNames.designReady:
		case PhaseInternalNames.deliveryCompleted:
			return "green";
		case PhaseInternalNames.designConcept:
			return "purple";
		case PhaseInternalNames.modelling:
		case PhaseInternalNames.design3D:
			return "cyan";
		case PhaseInternalNames.designsInRevision:
			return "gold";
		case PhaseInternalNames.shop:
			return "geekblue";
		default:
			return "#595959";
	}
};

export const BiggerButtonCarousel = styled(Carousel)`
	> .slick-dots li button {
		background: #f5296e;
		height: 8px !important;
		width: 20px;
	}
	> .slick-dots {
		bottom: 15px;
	}
	> .slick-dots li.slick-active button {
		background: #f5296e;
		width: 28px;
	}
`;

export const MaxHeightDiv = styled.div`
	min-height: 20vh;
	height: calc(100vh - 70px);
	overflow-y: scroll !important;
`;

export const StyledTag = styled(Tag)`
	text-transform: capitalize;
	text-align: center;
`;

export const VerticalPaddedDiv = styled.div`
	padding: 1rem 0;
`;

export const BottomPaddedDiv = styled.div`
	padding-bottom: 1rem;
`;

interface ModifiedTextProps {
	textTransform?: "uppercase" | "lowercase" | "capitalize";
}

export const ModifiedText = styled(Text)<ModifiedTextProps>`
	text-overflow: ellipsis;
	overflow: hidden;
	text-transform: ${({ textTransform }): string => textTransform};
`;

export const AddOnAfterWithoutPadding = styled(Input)`
	.ant-input-group-addon {
		padding: 0px;
	}
	.ant-btn {
		height: 30px;
	}
`;

/**
 * Props Accepted by Customisable div
 */
interface CustomDivProps {
	type?: "flex" | "block" | "grid";
	inline?: boolean;
	overflow?: "hidden" | "scroll" | "visible";
	overX?: "hidden" | "scroll";
	overY?: "hidden" | "scroll";
	height?: string;
	width?: string;
	/** Padding-x */
	px?: string;
	/** Padding-y */
	py?: string;
	/** margin-x */
	mx?: string;
	/** margin-y */
	my?: string;
	/** padding-bottom */
	pb?: string;
	/** padding-top */
	pt?: string;
	/** padding-right */
	pr?: string;
	/** padding-left */
	pl?: string;

	/** margin-bottom */
	mb?: string;
	/** margin-top */
	mt?: string;
	/** margin-right */
	mr?: string;
	/** margin-left */
	ml?: string;
	/** Text overflow */
	textOverflow?: "clip" | "ellipsis" | "initial";
	justifyContent?:
		| "space-around"
		| "flex-end"
		| "flex-start"
		| "space-evenly"
		| "space-between"
		| "baseline"
		| "center"
		| "stretch";
	textTransform?: "capitalize" | "uppercase" | "lowercase";
	align?: "center" | "start" | "end" | "baseline" | "stretch" | "flex-end" | "flex-start";
	flexWrap?: "wrap" | "no-wrap" | "wrap-reverse";
	flexGrow?: number;
	maxHeight?: string;
	flexBasis?: string;
	flexDirection?: "row" | "column" | "row-reverse" | "column-reverse";
	whiteSpace?: "pre" | "nowrap" | "normal" | "pre-line" | "pre-wrap";
	minWidth?: string;
	maxWidth?: string;
	cursor?: string;
}

export const CustomDiv = styled.div<CustomDivProps>`
	display: ${({ type = "block", inline }): string => {
		return `${inline ? `inline-${type}` : type}`;
	}};
	overflow: ${({ overflow }): string => overflow};
	overflow-x: ${({ overX }): string => overX};
	overflow-y: ${({ overY }): string => overY};
	word-break: initial;
	text-overflow: ${({ textOverflow = "ellipsis" }): string => textOverflow};
	height: ${({ height }): string => height};
	width: ${({ width }): string => {
		return width;
	}};
	text-transform: ${({ textTransform }): string => textTransform};
	/* Padding */
	padding-left: ${({ px }): string => px};
	padding-right: ${({ px }): string => px};
	padding-top: ${({ py }): string => py};
	padding-bottom: ${({ py }): string => py};
	padding-top: ${({ pt }): string => pt};
	padding-bottom: ${({ pb }): string => pb};
	padding-right: ${({ pr }): string => pr};
	padding-left: ${({ pl }): string => pl};
	/* Margin */
	margin-left: ${({ mx }): string => mx};
	margin-right: ${({ mx }): string => mx};
	margin-top: ${({ my }): string => my};
	margin-bottom: ${({ my }): string => my};
	margin-top: ${({ mt }): string => mt};
	margin-bottom: ${({ mb }): string => mb};
	margin-right: ${({ mr }): string => mr};
	margin-left: ${({ ml }): string => ml};
	justify-content: ${({ justifyContent }): string => justifyContent};
	align-items: ${({ align }): string => align};
	flex-wrap: ${({ flexWrap }): string => flexWrap};
	flex-grow: ${({ flexGrow }): number => flexGrow};
	flex-direction: ${({ flexDirection }): string => flexDirection};
	max-height: ${({ maxHeight }): string => maxHeight};
	white-space: ${({ whiteSpace }): string => whiteSpace};
	flex-basis: ${({ flexBasis }): string => flexBasis};
	min-width: ${({ minWidth }): string => minWidth};
	max-width: ${({ maxWidth }): string => maxWidth};
	cursor: ${({ cursor }): string => cursor};
`;

export const SilentDivider = styled(Divider)`
	margin: 0 0 !important;
	border-top-color: #e8e8e8;
`;

export const StepsContainer = styled(CustomDiv)`
	> * + * {
		margin-top: 2rem;
	}
	padding: 1rem;

	> *:last-child {
		margin-bottom: 2em;
	}
`;

export const Form = styled.div`
	> * + * {
		margin-top: 1rem;
	}
	label {
		padding: 0px 0.5rem;
		flex-basis: 15ch;
	}
	label + * {
		flex-basis: 50ch;
		display: inline;
		flex-grow: 1;
	}
`;

export const BorderedParagraph = styled(Paragraph)`
	border: 1px #d9d9d9 solid;
	border-radius: 4px;
	padding: 8px 8px;
	background-color: white;
	white-space: break-spaces;
	div[role="button"] {
		display: inline-flex !important;
	}
	textarea.ant-input:focus {
		border: none;
		box-shadow: none;
	}
`;

export const EndCol = styled(Col)`
	display: flex;
	justify-content: flex-end;
`;

export const CustomUl = styled.ul`
	list-style-type: none;
	margin-left: 0px;
	padding-left: 1rem;
	text-indent: -1rem;
	li:before {
		content: "-";
		padding-right: 4px;
	}
`;

export const SilentButton = styled(Button)`
	padding: 0px;
	height: auto;
`;

export const StatusButton = styled(Button)<{ status: Status }>`
	:disabled {
		:hover {
			${({ status }): FlattenSimpleInterpolation => {
				return (
					status === Status.completed &&
					css`
						background-color: #d0fcbd;
						border-color: #d0fcbd;
					`
				);
			}};
			color: rgba(0, 0, 0, 0.65);
		}
		${({ status }): FlattenSimpleInterpolation => {
			return (
				status === Status.completed &&
				css`
					background-color: #d0fcbd;
					border-color: #d0fcbd;
				`
			);
		}};
		color: rgba(0, 0, 0, 0.65);
	}
`;
export const ShadowDiv = styled.div<{ active?: boolean }>`
	box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.4);
	transition: all 0.3s;
	${({ active }): FlattenSimpleInterpolation => {
		return active
			? css`
					box-shadow: 0px 4px 32px rgba(0, 0, 0, 0.4);
			  `
			: null;
	}}
	:hover {
		cursor: pointer;
		box-shadow: 0px 4px 32px rgba(0, 0, 0, 0.4);
	}
	> * {
		cursor: default;
	}
`;
