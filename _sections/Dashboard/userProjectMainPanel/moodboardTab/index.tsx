import { getMoodboardApi } from "@api/designApi";
import { DetailedDesign } from "@customTypes/dashboardTypes";
import fetcher from "@utils/fetcher";
import { Button, Row, Col } from "antd";
import Router from "next/router";
import React, { useEffect, useState, useMemo } from "react";
import { MoodboardAsset } from "@customTypes/moodboardTypes";
import CollapsePanel from "antd/lib/collapse/CollapsePanel";
import { CustomDiv } from "../../styled";
import MissingAssetModal from "./MissingAssetModal";
import MoodboardDisplay from "./MoodboardDisplay";

interface MoodboardTabProps {
	setDesignData: React.Dispatch<React.SetStateAction<DetailedDesign>>;
	designId: string;
	projectId: string;
	setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const MoodboardTab: (props: MoodboardTabProps) => JSX.Element = ({ designId, projectId, setLoading }) => {
	const [moodboard, setMoodboard] = useState<MoodboardAsset[]>(null);
	const [addMissingAssetModalVisible, setAddMissingAssetModalVisible] = useState<boolean>(false);
	const goToStore = (): void => {
		Router.push(
			{ pathname: "/assetstore", query: { designId, projectId, entryLocation: Router.pathname } },
			`/assetstore/pid/${projectId}/did/${designId}`
		);
	};
	const toggleAddMissingAssetModal = (): void => {
		setAddMissingAssetModalVisible(!addMissingAssetModalVisible);
	};

	const fetchMoodBoard = async (): Promise<void> => {
		setLoading(true);
		const endPoint = getMoodboardApi(designId);
		const responseData = await fetcher({ endPoint, method: "GET" });
		if (responseData.statusCode <= 300) {
			setMoodboard(responseData.data.moodboard);
		}
		setLoading(false);
	};

	useEffect(() => {
		fetchMoodBoard();
		return (): void => {
			setMoodboard(null);
		};
	}, [designId]);

	const missingAssets = useMemo(() => {
		if (moodboard) {
			return moodboard.filter(assetEntry => !assetEntry.isExistingAsset);
		}
		return [];
	}, moodboard);

	return (
		<Row gutter={[8, 8]} justify="space-between">
			<Col span={12}>
				<Button block type="primary" onClick={goToStore}>
					Open Asset Store
				</Button>
			</Col>
			<Col span={12}>
				<Button block type="default" onClick={toggleAddMissingAssetModal}>
					Manage Missing assets ({missingAssets.length})
				</Button>
			</Col>
			<Col span={24}>
				<MoodboardDisplay designId={designId} projectId={projectId} moodboard={moodboard} />
			</Col>
			<MissingAssetModal
				designId={designId}
				setMoodboard={setMoodboard}
				missingAssets={missingAssets}
				toggleAddMissingAssetModal={toggleAddMissingAssetModal}
				addMissingAssetModalVisible={addMissingAssetModalVisible}
			/>
		</Row>
	);
};

export default MoodboardTab;
