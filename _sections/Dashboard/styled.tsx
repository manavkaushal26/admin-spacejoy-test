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