import { getMoodboardApi, getAddRemoveAssetApi } from "@api/designApi";
import { MoodBoardType } from "@customTypes/moodboardTypes";
import fetcher from "@utils/fetcher";
import { Button, Modal, Input } from "antd";
import Router from "next/router";
import React, { useEffect, useState } from "react";
import { CustomDiv } from "../../styled";
import MoodboardDisplay from "./MoodboardDisplay";

interface MoodboardTabProps {
	designId: string;
	projectId: string;
	setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const MoodboardTab: (props: MoodboardTabProps) => JSX.Element = ({ designId, projectId, setLoading }) => {
	const [moodboard, setMoodboard] = useState<MoodBoardType>(null);
	const [addMissingAssetModalVisible, setAddMissingAssetModalVisible] = useState<boolean>(false);
	const [assetUrl, setAssetUrl] = useState<string>("");
	const goToStore = () => {
		Router.push(
			{ pathname: "/assetstore", query: { designId, projectId } },
			`/assetstore/pid/${projectId}/did/${designId}`
		);
	};

	useEffect(() => {
		fetchMoodBoard();
		return () => {
			setMoodboard(null);
		};
	}, [designId]);

	const fetchMoodBoard = async () => {
		setLoading(true);
		const endPoint = getMoodboardApi(designId);
		const responseData = await fetcher({ endPoint: endPoint, method: "GET" });
		if (responseData.data) {
			setMoodboard(responseData.data);
		}
		setLoading(false);
	};

	const toggleAddMissingAssetModal = () => {
		setAddMissingAssetModalVisible(!addMissingAssetModalVisible);
	};

	const assetUrlChange = e => {
		const {
			target: { value }
		} = e;
		setAssetUrl(value);
	};

	const addAsset = async () => {
		setLoading(true);
		const endpoint = getAddRemoveAssetApi(designId, null);
		await fetcher({
			endPoint: endpoint,
			method: "POST",
			body: {
				data: {
					assetArr: [],
					retailLink: assetUrl
				}
			}
		});
		toggleAddMissingAssetModal();
		setLoading(false);
	};

	return (
		<CustomDiv type="flex" width="100%" flexWrap="wrap" overY="scroll">
			<CustomDiv width="50%" pr="8px" justifyContent="center">
				<Button block type="primary" onClick={goToStore}>
					Open Asset Store
				</Button>
			</CustomDiv>
			<CustomDiv width="50%" pl="8px" justifyContent="center">
				<Button block type="default" onClick={toggleAddMissingAssetModal}>
					Add Missing Asset
				</Button>
			</CustomDiv>
			<CustomDiv width="100%" py="0.5em" overY="scroll">
				<MoodboardDisplay designId={designId} projectId={projectId} moodboard={moodboard} />
			</CustomDiv>
			<Modal
				title="Add Missing Asset"
				onCancel={toggleAddMissingAssetModal}
				onOk={addAsset}
				visible={addMissingAssetModalVisible}
			>
				<Input onChange={assetUrlChange} />
			</Modal>
		</CustomDiv>
	);
};

export default MoodboardTab;
