import { CustomDiv, AddOnAfterWithoutPadding } from "@sections/Dashboard/styled";
import fetcher from "@utils/fetcher";
import { Button, List, message, Modal, Typography, Row, Col, Icon, Spin, Popconfirm } from "antd";
import React, { ChangeEvent, useState } from "react";
import styled from "styled-components";
import { MoodboardAsset } from "@customTypes/moodboardTypes";
import { getMoodboardApi } from "@api/designApi";

const { Text } = Typography;

const ChildSpacedDiv = styled.div`
	> * + * {
		margin-top: 1rem;
	}
`;

interface MissingAssetModal {
	designId: string;
	setMoodboard: React.Dispatch<React.SetStateAction<MoodboardAsset[]>>;
	missingAssets: MoodboardAsset[];
	toggleAddMissingAssetModal: () => void;
	addMissingAssetModalVisible: boolean;
}

const MissingAssetModal: React.FC<MissingAssetModal> = ({
	designId,
	missingAssets,
	addMissingAssetModalVisible,
	setMoodboard,
	toggleAddMissingAssetModal,
}) => {
	const [assetUrl, setAssetUrl] = useState<string>("");
	const [loading, setLoading] = useState(false);
	const [deleteLoading, setDeleteLoading] = useState(false);
	const assetUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
		const {
			target: { value },
		} = e;
		setAssetUrl(value);
	};

	const addAsset = async (): Promise<void> => {
		if (assetUrl) {
			setLoading(true);
			const endpoint = getMoodboardApi(designId);
			const response = await fetcher({
				endPoint: endpoint,
				method: "POST",
				body: {
					data: {
						assets: [],
						assetUrls: [assetUrl],
					},
				},
			});
			if (response.statusCode <= 300) {
				setMoodboard(response.data.moodboard);
				setAssetUrl("");
				message.success("Product URL added successfully");
			}
			setLoading(false);
		}
	};

	const removeAsset = async (missingAssetUrl): Promise<void> => {
		setDeleteLoading(true);
		const endpoint = getMoodboardApi(designId);
		const response = await fetcher({
			endPoint: endpoint,
			method: "DELETE",
			body: {
				data: {
					assets: [],
					assetUrls: [missingAssetUrl],
				},
			},
		});
		if (response.statusCode <= 300) {
			setMoodboard(response.data.moodboard);
			message.success("Product URL deleted successfully");
		}
		setDeleteLoading(false);
	};

	return (
		<Modal
			title="Add Missing Product"
			onCancel={toggleAddMissingAssetModal}
			footer={null}
			visible={addMissingAssetModalVisible}
		>
			<ChildSpacedDiv>
				<Text strong>Add missing Asset</Text>
				<CustomDiv>
					<Text>Copy the URL for the missing product into the below textbox</Text>
				</CustomDiv>

				<AddOnAfterWithoutPadding
					onChange={assetUrlChange}
					onPressEnter={addAsset}
					value={assetUrl}
					addonAfter={
						<Button loading={loading} type="primary" onClick={addAsset}>
							Add
						</Button>
					}
				/>
				<Spin spinning={deleteLoading}>
					<List
						header={<Text strong>Added Product URL&apos;s</Text>}
						bordered
						dataSource={missingAssets}
						renderItem={(asset): JSX.Element => (
							<List.Item>
								<Row type="flex" style={{ width: "100%" }}>
									<Col span={22}>
										<a
											style={{ width: "100%" }}
											target="_blank"
											rel="noopener noreferrer"
											href={`${asset.externalUrl}`}
										>
											{asset.externalUrl}
										</a>
									</Col>
									<Col span={1}>
										<Row align="middle" justify="center" type="flex">
											<Popconfirm
												title="Delete Missing Asset URL?"
												onConfirm={(): Promise<void> => removeAsset(asset.externalUrl)}
											>
												<Icon type="delete" />
											</Popconfirm>
										</Row>
									</Col>
								</Row>
							</List.Item>
						)}
					/>
				</Spin>
			</ChildSpacedDiv>
		</Modal>
	);
};

export default MissingAssetModal;
