import { editDesignApi } from "@api/pipelineApi";
import { DetailedDesign } from "@customTypes/dashboardTypes";
import { CustomDiv, AddOnAfterWithoutPadding } from "@sections/Dashboard/styled";
import fetcher from "@utils/fetcher";
import { Button, Input, List, message, Modal, Typography } from "antd";
import React, { ChangeEvent, useState } from "react";
import styled from "styled-components";

const { Text } = Typography;
const { Search } = Input;
const ChildSpacedDiv = styled.div`
	> * + * {
		margin-top: 1rem;
	}
`;

interface MissingAssetModal {
	designId: string;
	setDesignData: React.Dispatch<React.SetStateAction<DetailedDesign>>;
	missingAssets: string[];
	toggleAddMissingAssetModal: () => void;
	addMissingAssetModalVisible: boolean;
}

const MissingAssetModal: React.FC<MissingAssetModal> = ({
	designId,
	missingAssets,
	addMissingAssetModalVisible,
	setDesignData,
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
			const endpoint = editDesignApi(designId);
			const response = await fetcher({
				endPoint: endpoint,
				method: "PUT",
				body: {
					data: {
						missingAssetUrls: [assetUrl, ...missingAssets]
					}
				}
			});
			if (response.statusCode <= 300) {
				setDesignData(response.data);
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
							<a style={{ width: "100%" }} href={`${asset}`}>
								{asset}
							</a>
						</List.Item>
					)}
				/>
			</ChildSpacedDiv>
		</Modal>
	);
};

export default MissingAssetModal;
