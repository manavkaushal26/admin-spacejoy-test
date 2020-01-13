import Image from "@components/Image";
import { Modal } from "antd";
import React from "react";
import styled from "styled-components";

interface ImageDisplayModal {
	previewVisible: boolean;
	handleCancel: () => void;
	previewImage: string;
	altText: string;
	cdn?: boolean;
}

const SizeAdjustedModal = styled(Modal)`
	width: 80% !important;
	min-width: 360px;
`;

const ImageDisplayModal: React.FC<ImageDisplayModal> = ({
	previewImage,
	previewVisible,
	handleCancel,
	altText,
	cdn
}) => {
	return (
		<SizeAdjustedModal visible={previewVisible} footer={null} onCancel={handleCancel}>
			{cdn ? (
				<Image width="100%" alt={altText} src={previewImage} />
			) : (
				<img alt={altText} style={{ width: "100%" }} src={previewImage} />
			)}
		</SizeAdjustedModal>
	);
};

export default ImageDisplayModal;
