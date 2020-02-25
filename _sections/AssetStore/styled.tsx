import { Card, Divider, Drawer, Icon, Spin, Slider, Typography, Modal } from "antd";
import styled, { css } from "styled-components";

const { Text } = Typography;

export const ModifiedDivider = styled(Divider)`
	margin: 12px 0;
`;

export const AssetCard = styled(Card)`
	.ant-card-body {
		padding: 0px 0px;
		height: 100%;
	}
	min-height: 150px;
`;

export const StyleCorrectedIcon = styled(Icon)`
	.anticon {
		display: flex;
		justify-content: center;
		align-content: center;
	}
`;

export const FilterCard = styled(Card)`
	.ant-card-body {
		padding: 24px 1rem;
		> * + * {
			margin-top: 10px;
		}
		.ant-typography {
			display: block;
		}
	}
`;

export const FullheightSpin = styled(Spin)`
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
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

export const StyledInput = styled.input<{ error: boolean }>`
	::-webkit-inner-spin-button,
	::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
	width: 100%;
	border: 1px solid rgba(0, 0, 0, 0.1);
	border-radius: 4px;
	border-color: ${({ error }) => (error ? "red" : "")};
`;

export const MarginCorrectedSlider = styled(Slider)`
	margin: 8px 8px;
`;

export const SizeAdjustedModal = styled(Modal)`
	height: 80% !important;
	min-width: 360px;
	width: 75% !important;
`;

export const activeShadows = css`
	transform: translateY(-2px);
	box-shadow: 20px 20px 60px #d9d9d9, -20px -20px 60px #ffffff;
`;
