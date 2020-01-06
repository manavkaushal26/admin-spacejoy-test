import { CustomDiv, AddOnAfterWithoutPadding } from "@sections/Dashboard/styled";
import fetcher from "@utils/fetcher";
import { Button, List, message, Modal, Typography } from "antd";
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
	toggleAddMissingAssetModal
}) => {
	const [assetUrl, setAssetUrl] = useState<string>("");
	const [loading, setLoading] = useState(false);
	const assetUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
		const {
			target: { value }
		} = e;
		setAssetUrl(value);
	};

	const addAsset = async () => {
		if (assetUrl) {
			setLoading(true);
			const endpoint = getMoodboardApi(designId);
			const response = await fetcher({
				endPoint: endpoint,
				method: "POST",
				body: {
					data: {
						assets: [],
						assetUrls: [assetUrl]
					}
				}
			});
			if (response.statusCode <= 300) {
				setMoodboard(response.data.moodboard);
				setAssetUrl("");
				message.success("Asset added successfully");
			}
			setLoading(false);
		}
	};

	return (
		<Modal
			title="Add Missing Asset"
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
				<List
					header={<Text strong>Added Asset URL&apos;s</Text>}
					bordered
					dataSource={missingAssets}
					renderItem={asset => (
						<List.Item>
							<a style={{ width: "100%" }} href={`${asset.externalUrl}`}>
								{asset.externalUrl}
							</a>
						</List.Item>
					)}
				/>
			</ChildSpacedDiv>
		</Modal>
	);
};

export default MissingAssetModal;
