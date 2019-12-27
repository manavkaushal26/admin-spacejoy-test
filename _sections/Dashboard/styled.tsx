import { Divider, Tag, Typography, Col, Icon, Button } from "antd";
import styled, { css } from "styled-components";
import { Status } from "@customTypes/userType";
import { PhaseInternalNames } from "@customTypes/dashboardTypes";

const { Text, Paragraph } = Typography;

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
		case PhaseInternalNames.design3D:
			return "cyan";
		case PhaseInternalNames.designsInRevision:
			return "yellow";
		case PhaseInternalNames.shop:
			return "geekblue";
		default:
			return "#595959";
	}
};

export const MaxHeightDiv = styled.div`
	min-height: 20vh;
	height: calc(100vh - 60px);
	display: flex;
	flex-direction: row;
	justify-content: stretch;
	align-content: stretch;
	overflow-y: scroll !important;
`;

export const StyledTag = styled(Tag)`
	text-transform: capitalize;
	text-align: center;
`;

export const VerticalPaddedDiv = styled.div`
	padding: 15px 0;
`;

export const BottomPaddedDiv = styled.div`
	padding-bottom: 15px;
`;

interface ModifiedTextProps {
	textTransform?: "uppercase" | "lowercase" | "capitalize";
}

export const ModifiedText = styled(Text)<ModifiedTextProps>`
	text-overflow: ellipsis;
	overflow: hidden;
	text-transform: ${({ textTransform }) => textTransform};
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
	display: ${({ type = "block", inline }) => {
		return `${inline ? `inline-${type}` : type}`;
	}};
	overflow: ${({ overflow }) => overflow};
	overflow-x: ${({ overX }) => overX};
	overflow-y: ${({ overY }) => overY};
	word-break: initial;
	text-overflow: ${({ textOverflow = "ellipsis" }) => textOverflow};
	height: ${({ height }) => height};
	width: ${({ width }) => {
		return width;
	}};
	text-transform: ${({ textTransform }) => textTransform};
	/* Padding */
	padding-left: ${({ px }) => px};
	padding-right: ${({ px }) => px};
	padding-top: ${({ py }) => py};
	padding-bottom: ${({ py }) => py};
	padding-top: ${({ pt }) => pt};
	padding-bottom: ${({ pb }) => pb};
	padding-right: ${({ pr }) => pr};
	padding-left: ${({ pl }) => pl};
	/* Margin */
	margin-left: ${({ mx }) => mx};
	margin-right: ${({ mx }) => mx};
	margin-top: ${({ my }) => my};
	margin-bottom: ${({ my }) => my};
	margin-top: ${({ mt }) => mt};
	margin-bottom: ${({ mb }) => mb};
	margin-right: ${({ mr }) => mr};
	margin-left: ${({ ml }) => ml};
	justify-content: ${({ justifyContent }) => justifyContent};
	align-items: ${({ align }) => align};
	flex-wrap: ${({ flexWrap }) => flexWrap};
	flex-grow: ${({ flexGrow }) => flexGrow};
	flex-direction: ${({ flexDirection }) => flexDirection};
	max-height: ${({ maxHeight }) => maxHeight};
	white-space: ${({ whiteSpace }) => whiteSpace};
	flex-basis: ${({ flexBasis }) => flexBasis};
	min-width: ${({ minWidth }) => minWidth};
	max-width: ${({ maxWidth }) => maxWidth};
	cursor: ${({ cursor }) => cursor};
`;

export const SilentDivider = styled(Divider)`
	margin: 0 0;
`;

export const StepsContainer = styled(CustomDiv)`
	> * + * {
		margin-top: 1em;
	}
	padding: 1rem;

	> *:last-child {
		margin-bottom: 1em;
	}
`;

export const ShadowDiv = styled.div<{ active: boolean }>`
	box-shadow: 0px 2px 16px #999ba81f;
	transition: all 0.3s;
	display: flex;
	justify-content: space-between;
	${({ active }) => {
			return active
				? css`
						box-shadow: 0px 4px 32px #999ba85f;
				  `
				: null;
		}}
		:hover {
		cursor: pointer;
		box-shadow: 0px 4px 32px #999ba85f;
	}
	> * {
		cursor: default;
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
export const FitIcon = styled(Icon)`
	display: flex;
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

export const StatusButton = styled(Button)<{ status: Status }>`
	:disabled {
		:hover {
			${({ status }) => {
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
		${({ status }) => {
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
