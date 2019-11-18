import styled from "styled-components";
import { Tag } from "antd";

export const MaxHeightDiv = styled.div`
	min-height: 20vh;
	max-height: 85vh;
	overflow-y: scroll;
`;

export const StyledTag = styled(Tag)`
	text-align: center;
	width: 100%;
	overflow: hidden;
	text-overflow: ellipsis;
`;

export const VerticalPaddedDiv = styled.div`
	padding: 15px 0;
`;

export const BottomPaddedDiv = styled.div`
	padding-bottom: 15px;
`;

/**
 * Props Accepted by Customisable div
 */
interface CustomDivProps {
	type?: "flex"|"block"|"grid";
	inline?: boolean;
	overflow?: "hidden"|"scroll";
	overX?: "hidden"|"scroll";
	overY?: "hidden"|"scroll";
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
	textOverflow?: "clip"|"ellipsis"|"initial";
	justifyContent?: "space-around"| "flex-end"| "flex-start"| "space-around"|"space-evenly"|"space-between";
}

export const CustomDiv = styled.div<CustomDivProps>`
	display: ${({ type = "block", inline }) => {
		return `${inline ? `inline-${type}` : type}`;
	}};
	overflow: ${({ overflow = "hidden" }) => {
		return overflow;
	}};
	word-break: initial;
	text-overflow: ${({textOverflow="ellipsis"})=> textOverflow};
	width: ${({ width }) => {
		return width;
	}};
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
	justify-content: ${({justifyContent})=> justifyContent};
`;
