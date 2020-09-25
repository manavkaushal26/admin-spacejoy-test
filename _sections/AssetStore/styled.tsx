import { Card, Divider, Drawer, Input, Modal, Slider, Spin } from "antd";
import styled, { css } from "styled-components";

export const ModifiedDivider = styled(Divider)`
	margin: 12px 0;
`;

export const AssetCard = styled(Card)`
	.ant-card-body {
		padding: 0px 0px;
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
	.ant-drawer-wrapper-body {
		display: flex;
		flex-direction: column;
		height: 100%;
		.ant-drawer-body {
			flex-grow: 1;
		}
	}
`;

export const StyledInput = styled(Input)<{ error: boolean }>`
	::-webkit-inner-spin-button,
	::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
	width: 100%;
	border: 1px solid rgba(0, 0, 0, 0.1);
	border-radius: 4px;
	border-color: ${({ error }): string => (error ? "red" : "")};
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
