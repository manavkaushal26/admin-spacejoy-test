import styled from "styled-components";
import { Tag, Typography } from "antd";

const { Text } = Typography;

export const StyledTag = styled(Tag)`
	text-transform: capitalize;
	text-align: center;
`;

export const CapitalizedText = styled(Text)`
	text-transform: capitalize;
`;
