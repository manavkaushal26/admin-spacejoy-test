import Image from "@components/Image";
import { Modal } from "antd";
import React from "react";
import styled from "styled-components";
import { BiggerButtonCarousel } from "@sections/Dashboard/styled";

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
						<Image width="100%" key={image} alt={altText} nolazy src={`q_100/${image}`} />
					) : (
						<img alt={altText} key={image} style={{ width: "100%" }} src={image} />
					);
				})}
			</BiggerButtonCarousel>
		</SizeAdjustedModal>
	);
};

export default ImageSlideshowModal;
