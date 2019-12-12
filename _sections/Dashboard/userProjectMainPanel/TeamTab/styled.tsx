import styled from "styled-components";
import { Button, Col, Card } from "antd";

styled;

export const StyledButton = styled(Button)<{ fullwidth: boolean }>`
	width: ${({ fullwidth }) => (fullwidth ? "100%" : null)};
`;

export const GreyColumn = styled(Col)`
	background-color: #f2f4f6;
`;

export const NoBodyCard = styled(Card)`
	flex-basis: 11ch;
	.ant-card-head {
		position: relative;
		> .ant-card-head-wrapper > .ant-card-extra {
			position: absolute;
			top: 4px;
			right: 4px;
			padding: 0px;
			align-self: normal;
		}
	}
	.ant-card-body {
		display: none;
	}
`;
