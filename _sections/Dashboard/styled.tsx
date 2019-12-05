import { Divider, Tag, Typography } from "antd";
import styled from "styled-components";

const { Text } = Typography;

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
	align?: "center" | "start" | "end" | "baseline" | "stretch" | 'flex-end' | 'flex-start';
	wrap?: "wrap" | "no-wrap" | "wrap-reverse";
	flexGrow?: number;
	maxHeight?: string;
	flexBasis?: string;
	flexDirection?: "row" | "column" | "row-reverse" | "column-reverse";
	whiteSpace?: "pre" | "nowrap" | "normal" | "pre-line" | "pre-wrap";
	minWidth?: string;
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
	flex-wrap: ${({ wrap }) => wrap};
	flex-grow: ${({ flexGrow }) => flexGrow};
	flex-direction: ${({ flexDirection }) => flexDirection};
	max-height: ${({ maxHeight }) => maxHeight};
	white-space: ${({ whiteSpace }) => whiteSpace};
	flex-basis: ${({flexBasis})=>flexBasis};
	min-width: ${({minWidth})=>minWidth};
`;

export const SilentDivider = styled(Divider)`
	margin: 0 0;
`;
