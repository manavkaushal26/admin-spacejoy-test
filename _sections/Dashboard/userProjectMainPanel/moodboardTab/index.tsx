import { getMoodboardApi } from "@api/designApi";
import { DetailedDesign } from "@customTypes/dashboardTypes";
import { MoodBoardType } from "@customTypes/moodboardTypes";
import fetcher from "@utils/fetcher";
import { Button } from "antd";
import Router from "next/router";
import React, { useEffect, useState } from "react";
import { CustomDiv } from "../../styled";
import MissingAssetModal from "./MissingAssetModal";
import MoodboardDisplay from "./MoodboardDisplay";

interface MoodboardTabProps {
	setDesignData: React.Dispatch<React.SetStateAction<DetailedDesign>>;
	missingAssets: string[];
	designId: string;
	projectId: string;
	setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const MoodboardTab: (props: MoodboardTabProps) => JSX.Element = ({
	setDesignData,
	designId,
	projectId,
	setLoading,
	missingAssets
}) => {
	const [moodboard, setMoodboard] = useState<MoodBoardType>(null);
	const [addMissingAssetModalVisible, setAddMissingAssetModalVisible] = useState<boolean>(false);
	const goToStore = () => {
		Router.push(
			{ pathname: "/assetstore", query: { designId, projectId } },
			`/assetstore/pid/${projectId}/did/${designId}`
		);
	};
	const toggleAddMissingAssetModal = () => {
		setAddMissingAssetModalVisible(!addMissingAssetModalVisible);
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
		const responseData = await fetcher({ endPoint, method: "GET" });
		if (responseData.statusCode <= 300) {
			setMoodboard(responseData.data);
		}
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
					Manage Missing assets ({missingAssets.length})
				</Button>
			</CustomDiv>
			<CustomDiv width="100%" py="0.5em" overY="scroll">
				<MoodboardDisplay designId={designId} projectId={projectId} moodboard={moodboard} />
			</CustomDiv>
			<MissingAssetModal
				designId={designId}
				setDesignData={setDesignData}
				missingAssets={missingAssets}
				toggleAddMissingAssetModal={toggleAddMissingAssetModal}
				addMissingAssetModalVisible={addMissingAssetModalVisible}
			/>
		</CustomDiv>
	);
};

export default MoodboardTab;
