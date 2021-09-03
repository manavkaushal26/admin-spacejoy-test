import { deleteUploadedBlogImage } from "@api/blogApi";
import Image from "@components/Image";
import { DesignImgTypes, ImageInterface } from "@customTypes/dashboardTypes";
import { getValueSafely } from "@utils/commonUtils";
import { cloudinary } from "@utils/config";
import fetcher from "@utils/fetcher";
import { Button, Col, Modal, notification, Row, Typography } from "antd";
import React, { useState } from "react";
import styled from "styled-components";
import { AuthorPlatformProps } from "..";
import { AUTHOR_ACTIONS } from "../reducer";

interface ImagePreview extends AuthorPlatformProps {
	image: ImageInterface;
	setImage: React.Dispatch<React.SetStateAction<ImageInterface>>;
}

const { Text } = Typography;

const StyledBorderlessModal = styled(Modal)`
	.ant-modal-body {
		padding: 0px;
		.ant-col {
			position: relative;
		}
	}
	max-width: 80vw;
`;

const FullHeightRight = styled.div`
	height: 100%;
	padding: 1rem 1rem;
	overflow-x: hidden;
	overflow-y: scroll;
`;

const ImagePreview: React.FC<ImagePreview> = ({ state, dispatch, image, setImage }) => {
	const [loading, setLoading] = useState<boolean>(false);
	const onDeleteButtonClick = async (): Promise<void> => {
		setLoading(true);
		const endPoint = deleteUploadedBlogImage(state.activeBlog._id, image._id);
		const response = await fetcher({ endPoint, method: "DELETE" });
		if (response.statusCode <= 300 && response.status === "success") {
			notification.success({ message: "Deleted Successfully" });
			setLoading(false);

			setImage(null);
		} else {
			notification.error({ message: response.message || response.data });
			setLoading(false);
		}
	};

	const onButtonClick = (type: "cover" | "social" | "panaroma"): void => {
		if (type === "cover") {
			if (image.imgType !== DesignImgTypes.Render) {
				notification.error({ message: "Can't set Panorama photo as Cover Image" });
				return;
			}
			dispatch({
				type: AUTHOR_ACTIONS.UPDATE_COVER_IMAGE,
				value: {
					activeBlog: {
						coverImg: image.img,
						coverImgCdn: image.cdn,
					},
				},
			});
			notification.success({ message: "Successfully Set" });
		}
		if (type === "social") {
			if (image.imgType !== DesignImgTypes.Render) {
				notification.error({ message: "Can't set Panorama photo as Social Image" });
				return;
			}
			dispatch({
				type: AUTHOR_ACTIONS.UPDATE_SOCIAL_IMAGE,
				value: {
					activeBlog: {
						socialImgCdn: image.cdn,
					},
				},
			});
			notification.success({ message: "Successfully Set" });
		}
		if (type === "panaroma") {
			if (image.imgType !== DesignImgTypes.Panorama) {
				notification.error({ message: "Please select a Panorama photo" });
				return;
			}
			dispatch({
				type: AUTHOR_ACTIONS.UPDATE_IMAGE_360,
				value: {
					activeBlog: {
						image360Cdn: image.cdn,
					},
				},
			});
			notification.success({ message: "Successfully Set" });
		}
	};

	const imageCdn = getValueSafely(() => image.cdn, "");
	const imageType = getValueSafely(() => image.imgType, DesignImgTypes.Render);
	return (
		<StyledBorderlessModal
			visible={!!image}
			onCancel={(): void => setImage(null)}
			closable={false}
			footer={null}
			centered
			width='auto'
		>
			<Row>
				<Col sm={24} md={16}>
					{imageCdn && <Image width='100%' alt='Blog Image' src={`${imageCdn}`} />}
				</Col>
				<Col sm={24} md={8}>
					<FullHeightRight>
						<Row justify='center' align='middle' gutter={[8, 8]}>
							{imageType === DesignImgTypes.Render && (
								<>
									<Col>
										<Row justify='center'>
											<Text copyable={{ text: `${cloudinary.baseDeliveryURL}/w_800/${imageCdn}` }}>
												Click Icon to copy URL to Image
											</Text>
										</Row>
									</Col>
									<Col span={24}>
										<Button
											disabled={state.activeBlog.coverImgCdn === imageCdn}
											{...(state.activeBlog.coverImgCdn === imageCdn && { icon: "check-circle" })}
											onClick={(): void => onButtonClick("cover")}
											block
										>
											Set as Cover Image
										</Button>
									</Col>
									<Col span={24}>
										<Button
											disabled={state.activeBlog.socialImgCdn === imageCdn}
											{...(state.activeBlog.socialImgCdn === imageCdn && { icon: "check-circle" })}
											onClick={(): void => onButtonClick("social")}
											block
										>
											Set as Social Image
										</Button>
									</Col>
								</>
							)}
							{imageType === DesignImgTypes.Panorama && (
								<Col span={24}>
									<Button onClick={(): void => onButtonClick("panaroma")} block>
										Set as Panorama
									</Button>
								</Col>
							)}
							<Col span={24}>
								<Button loading={loading} onClick={onDeleteButtonClick} type='primary' danger block>
									Delete Image
								</Button>
							</Col>
						</Row>
					</FullHeightRight>
				</Col>
			</Row>
		</StyledBorderlessModal>
	);
};

export default React.memo(ImagePreview);
