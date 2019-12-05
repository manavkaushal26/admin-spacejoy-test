import { Card, Divider, Drawer, Icon, Spin } from "antd";
import styled from "styled-components";

export const ModifiedDivider = styled(Divider)`
	margin: 12px 0;
`;

export const AssetCard = styled(Card)`
	.ant-card-body {
		padding: 0px 0px;
		height: 100%;
	}
`;

export const StyleCorrectedIcon = styled(Icon)`
	.anticon {
		display: flex;
		justify-content: center;
		align-content: center;
	}
`;

export const FullheightSpin = styled(Spin)`
	&.ant-spin-nested-loading {
		width: 100%;
		height: 100%;
		.ant-spin-container {
			width: 100%;
			height: 100%;
		}
	}
`;

export const GreyDrawer = styled(Drawer)`
	.ant-drawer-content {
		background: white;
	}
	.ant-drawer-wrapper-body {
		background: white;
		display: flex;
		flex-direction: column;
		height: 100%;
		.ant-drawer-body {
			flex-grow: 1;
		}
	}
`;
