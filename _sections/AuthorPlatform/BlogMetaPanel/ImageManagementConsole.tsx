/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { uploadBlogImage } from "@api/blogApi";
import Image from "@components/Image";
import { BlogImageUploadTypes } from "@customTypes/blogTypes";
import { ImageInterface } from "@customTypes/dashboardTypes";
import { cookieNames } from "@utils/config";
import getCookie from "@utils/getCookie";
import { Card, Col, Empty, Icon, Modal, Row, Select, Upload } from "antd";
import { UploadChangeParam } from "antd/lib/upload";
import { UploadFile } from "antd/lib/upload/interface";
import React, { useState } from "react";
import styled from "styled-components";
import { AuthorPlatformProps } from "..";
import { AUTHOR_ACTIONS } from "../reducer";
import ImagePreview from "./ImagePreview";

const SizeAdjustedModal = styled(Modal)`
	height: 80% !important;
	min-width: 360px;
`;

const ModifiedCard = styled(Card)`
	.ant-card-body {
		height: 100%;
	}
`;

const { Dragger } = Upload;

interface ImageManagementConsole extends AuthorPlatformProps {
	imageConsoleVisible: boolean;
	setImageConsoleVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const ImageManagementConsole: React.FC<ImageManagementConsole> = ({
	state,
	dispatch,
	imageConsoleVisible,
	setImageConsoleVisible,
}) => {
	const [imageType, setImageType] = useState<BlogImageUploadTypes>(BlogImageUploadTypes.Photo);

	const [imageToView, setImageToView] = useState<ImageInterface>(null);
	const [coverImageFileList, setCoverImageFileList] = useState<UploadFile<any>[]>([]);

	const openImagePreview = (image): void => {
		setImageToView(image);
	};

	const imageUploadUrl = uploadBlogImage(state.activeBlog._id, "body");

	const onChange = (info: UploadChangeParam<UploadFile>) => {
		const files = info.fileList;
		const incompleteFiles = files.filter(file => {
			return file.status !== "done";
		});
		if (info.file.status === "done") {
			const { response } = info.file;
			dispatch({
				type: AUTHOR_ACTIONS.SET_ACTIVE_BLOG,
				value: {
					activeBlog: { ...state.activeBlog, images: [...response.data.images] },
				},
			});
		}

		setCoverImageFileList(incompleteFiles);
	};

	const onSelect = (selectedValue): void => {
		setImageType(selectedValue);
	};

	return (
		<SizeAdjustedModal
			title="Blog Image Console"
			visible={imageConsoleVisible}
			footer={null}
			centered
			onCancel={(): void => setImageConsoleVisible(false)}
		>
			<Row>
				<Col span={24}>
					<Dragger
						disabled={!state.activeBlogId}
						supportServerRender
						name="file"
						multiple
						fileList={coverImageFileList}
						action={imageUploadUrl}
						onRemove={(): false => false}
						onChange={onChange}
						headers={{ Authorization: getCookie(null, cookieNames.authToken) }}
						data={{ imgType: imageType }}
						accept="images/*"
					>
						<p className="ant-upload-drag-icon">
							<Icon type="inbox" />
						</p>
						<p className="ant-upload-text">Type of Blog Image</p>

						<p
							className="ant-upload-text"
							onClick={(e): void => {
								e.stopPropagation();
							}}
						>
							<Select value={imageType} onSelect={onSelect} style={{ width: "40%" }}>
								{Object.keys(BlogImageUploadTypes).map(key => {
									return (
										<Select.Option key={key} value={BlogImageUploadTypes[key]}>
											{key}
										</Select.Option>
									);
								})}
							</Select>
						</p>

						<p className="ant-upload-text">Click or drag files to this area to upload</p>
						<p className="ant-upload-hint">Support for a single or bulk upload.</p>
					</Dragger>
				</Col>
				<Col span={24}>
					<Row type="flex" style={{ justifyItems: "stretch" }} align="stretch" gutter={[4, 4]}>
						{state.activeBlog.images.length ? (
							state.activeBlog.images.map(image => {
								return (
									<Col key={image.cdn} md={8} sm={12} lg={6}>
										<Row style={{ height: "100%" }}>
											<ModifiedCard
												onClick={(): void => openImagePreview(image)}
												style={{ height: "100%" }}
												size="small"
												bordered={false}
												hoverable
											>
												<Row style={{ height: "100%" }} justify="center" align="middle" type="flex">
													<Image src={`q_60,w_300/${image.cdn}`} width="100%" />
												</Row>
											</ModifiedCard>
										</Row>
									</Col>
								);
							})
						) : (
							<Col span={24}>
								<Row type="flex" justify="center">
									<Empty description="No Images uploaded yet" />
								</Row>
							</Col>
						)}
					</Row>
				</Col>
			</Row>
			<ImagePreview state={state} dispatch={dispatch} image={imageToView} setImage={setImageToView} />
		</SizeAdjustedModal>
	);
};

export default ImageManagementConsole;
