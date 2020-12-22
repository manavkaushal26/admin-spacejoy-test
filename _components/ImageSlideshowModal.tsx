import Image from "@components/Image";
import { BiggerButtonCarousel } from "@sections/Dashboard/styled";
import { Modal } from "antd";
import React from "react";
import styled from "styled-components";

interface ImageSlideshowModal {
	previewVisible: boolean;
	handleCancel: () => void;
	previewImages: string[];
	altText: string;
	cdn?: boolean;
}

const SizeAdjustedModal = styled(Modal)`
	width: 80% !important;
	min-width: 360px;
`;

const ImageSlideshowModal: React.FC<ImageSlideshowModal> = ({
	previewImages,
	previewVisible,
	handleCancel,
	altText,
	cdn,
}) => {
	return (
		<SizeAdjustedModal visible={previewVisible} footer={null} onCancel={handleCancel}>
			<BiggerButtonCarousel slidesToShow={1} slidesToScroll={1} autoplay>
				{previewImages.map(image => {
					return cdn ? (
						<Image width='100%' key={image} alt={altText} src={`${image}`} />
					) : (
						<img alt={altText} key={image} style={{ width: "100%" }} src={image} />
					);
				})}
			</BiggerButtonCarousel>
		</SizeAdjustedModal>
	);
};

export default ImageSlideshowModal;
