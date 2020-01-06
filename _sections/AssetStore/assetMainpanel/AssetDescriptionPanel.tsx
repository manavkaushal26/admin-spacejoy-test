import { getSingleAssetApi } from "@api/designApi";
import Image from "@components/Image";
import { SingleAssetType, MoodboardAsset } from "@customTypes/moodboardTypes";
import { AssetAction, ASSET_ACTION_TYPES } from "@sections/AssetStore/reducer";
import { CustomDiv, SilentDivider } from "@sections/Dashboard/styled";
import { getValueSafely } from "@utils/commonUtils";
import fetcher from "@utils/fetcher";
import { Button, Icon, message, Popconfirm, Typography } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import { FullheightSpin, GreyDrawer } from "../styled";

const { Title, Text } = Typography;

const CenteredTitle = styled(Title)`
	text-align: center;
`;

interface AssetDescriptionPanelProps {
	assetId: string;
	addRemoveAsset: (action: "ADD" | "DELETE", assetId: string, assetEntryId?: string) => void;
	moodboard: MoodboardAsset[];
	designId: string;
	assetEntryId: string;
	projectId: string;
	dispatch: React.Dispatch<AssetAction>;
	dataLoading: boolean;
}

const AssetDescriptionPanel: (props: AssetDescriptionPanelProps) => JSX.Element = ({
	addRemoveAsset,
	assetId,
	moodboard,
	designId,
	assetEntryId,
	projectId,
	dispatch,
	dataLoading
}) => {
	const [singleAssetData, setSingleAssetData] = useState<SingleAssetType>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const fetchAndPopulate = async (): Promise<void> => {
		setLoading(true);
		const endpoint = getSingleAssetApi(assetId);
		const responseData = await fetcher({ endPoint: endpoint, method: "GET" });
		if (responseData.statusCode <= 300) {
			setSingleAssetData(responseData.data);
		}
		setLoading(false);
	};

	const moodboardAssetIdMap = useMemo(() => {
		setLoading(true);
		if (moodboard) {
			if (assetEntryId) {
				setLoading(false);
				return moodboard
					.filter(asset => asset.isExistingAsset)
					.find(elem => {
						return elem.asset._id === assetEntryId;
					})
					.recommendations.reduce((acc, currRecommendation) => {
						return { ...acc, [currRecommendation._id]: currRecommendation._id };
					}, {});
			}
			setLoading(false);
			return moodboard
				.filter(asset => asset.isExistingAsset)
				.reduce((acc, currAsset) => {
					return { ...acc, [currAsset.asset._id]: currAsset.asset._id };
				}, {});
		}
		setLoading(false);
		return {};
	}, [moodboard, assetEntryId]);

	useEffect(() => {
		if (assetId) {
			fetchAndPopulate();
			return (): void => {};
		}
		return (): void => {
			setSingleAssetData(null);
		};
	}, [assetId]);
	const Router = useRouter();
	const assetInMoodboard = !!moodboardAssetIdMap[assetId];
	const onButtonClick = async (): Promise<void> => {
		setLoading(true);
		if (assetInMoodboard && !assetEntryId) {
			const primaryAssetId = moodboardAssetIdMap[assetId];
			Router.push(
				{ pathname: "/assetstore", query: { designId, assetEntryId: primaryAssetId, projectId } },
				`/assetstore/pid/${projectId}/did/${designId}/aeid/${primaryAssetId}`
			);
			await dispatch({ type: ASSET_ACTION_TYPES.SELECTED_ASSET, value: null });
		} else {
			await addRemoveAsset("ADD", assetId, assetEntryId);
			message.success(assetEntryId ? "Added Recommendation" : "Added Primary Asset");
		}
		setLoading(false);
	};

	const onRemoveClick = async (): Promise<void> => {
		setLoading(true);
		await addRemoveAsset("DELETE", moodboardAssetIdMap[assetId], assetEntryId);
		message.success(assetEntryId ? "Removed Recommendation" : "Removed Primary Asset");
		setLoading(false);
	};

	const closeDrawer = (): void => {
		dispatch({ type: ASSET_ACTION_TYPES.SELECTED_ASSET, value: null });
	};

	const buttonText = assetInMoodboard ? "Add Recommendations" : "Add to Design";

	return (
		<GreyDrawer onClose={closeDrawer} width={360} visible={!!assetId}>
			<FullheightSpin spinning={loading || dataLoading}>
				{singleAssetData && (
					<CustomDiv height="100%" type="flex" flexDirection="column" width="100%" px="16px" overY="scroll">
						<CustomDiv type="flex" justifyContent="center">
							<Image height="200px" src={`q_100,h_200/${singleAssetData.cdn}`} />
						</CustomDiv>
						<CustomDiv pt="0.5em" type="flex" justifyContent="center">
							<CenteredTitle level={3}>{singleAssetData.name}</CenteredTitle>
						</CustomDiv>
						<SilentDivider />

						<CustomDiv py="0.5em" type="flex" justifyContent="baseline" align="baseline">
							<CustomDiv type="flex" pr="5px">
								<Icon type="dollar-circle" theme="filled" />
							</CustomDiv>
							<CustomDiv>
								<Text type="secondary">Cost: $</Text> <Text strong>{singleAssetData.price}</Text>
							</CustomDiv>
						</CustomDiv>
						<SilentDivider />

						<CustomDiv py="0.5em" type="flex" justifyContent="baseline" align="baseline">
							<CustomDiv type="flex" pr="5px">
								<Icon type="drag" />
							</CustomDiv>
							<CustomDiv>
								<Text type="secondary">Dimensions</Text>
								<CustomDiv py="0.25em">
									<CustomDiv>
										<Text>Width: </Text>
										<Text>
											{getValueSafely<string | number>(() => (singleAssetData.dimension.width * 12).toFixed(2), "N/A")}{" "}
											Inches
										</Text>
									</CustomDiv>
									<CustomDiv>
										<Text>Height: </Text>
										<Text>
											{getValueSafely<string | number>(() => (singleAssetData.dimension.height * 12).toFixed(2), "N/A")}{" "}
											Inches
										</Text>
									</CustomDiv>
									<CustomDiv>
										<Text>Depth: </Text>
										<Text>
											{getValueSafely<string | number>(() => (singleAssetData.dimension.depth * 12).toFixed(2), "N/A")}{" "}
											Inches
										</Text>
									</CustomDiv>
								</CustomDiv>
							</CustomDiv>
						</CustomDiv>
						<SilentDivider />
						<CustomDiv py="0.5em" type="flex" justifyContent="baseline" align="baseline">
							<CustomDiv type="flex" pr="5px">
								<Icon type="link" />
							</CustomDiv>
							<CustomDiv>
								<Text type="secondary">
									<a
										target="_blank"
										rel="noopener noreferrer"
										href={getValueSafely(() => singleAssetData.retailLink, "#")}
									>
										{getValueSafely(() => singleAssetData.retailer.name, "N/A")}
									</a>
								</Text>
							</CustomDiv>
						</CustomDiv>
						<CustomDiv flexGrow={1} type="flex" flexDirection="column" justifyContent="flex-end">
							{assetInMoodboard && (
								<CustomDiv py="0.5em" width="100%">
									<Popconfirm title="Are you sure?" onConfirm={onRemoveClick} okText="Yes" cancelText="Cancel">
										<Button block type="danger">
											Remove Asset
										</Button>
									</Popconfirm>
								</CustomDiv>
							)}
							{!assetInMoodboard && assetEntryId && (
								<CustomDiv py="0.5em" width="100%">
									<Button block type="primary" loading={loading} onClick={onButtonClick}>
										Add as Recommendation
									</Button>
								</CustomDiv>
							)}
							{!assetEntryId && (
								<CustomDiv py="0.5em" width="100%">
									<Button block type="primary" loading={loading} onClick={onButtonClick}>
										{buttonText}
									</Button>
								</CustomDiv>
							)}
						</CustomDiv>
					</CustomDiv>
				)}
			</FullheightSpin>
		</GreyDrawer>
	);
};

export default AssetDescriptionPanel;
