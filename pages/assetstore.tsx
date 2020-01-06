import { getMetaDataApi, getMoodboardApi } from "@api/designApi";
import User from "@customTypes/userType";
import AssetCartModal from "@sections/AssetStore/assetCart";
import AssetMainPanel from "@sections/AssetStore/assetMainpanel";
import Sidebar from "@sections/AssetStore/assetSidepanel";
import { CustomDiv, MaxHeightDiv } from "@sections/Dashboard/styled";
import PageLayout from "@sections/Layout";
import { withAuthSync, withAuthVerification } from "@utils/auth";
import { company } from "@utils/config";
import fetcher from "@utils/fetcher";
import IndexPageMeta from "@utils/meta";
import { Button, message, Spin } from "antd";
import { NextPageContext } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useReducer } from "react";
import styled from "styled-components";
import { MoodboardAsset } from "@customTypes/moodboardTypes";
import { assetStoreInitialState, ASSET_ACTION_TYPES, reducer } from "../_sections/AssetStore/reducer";

interface AssetStoreProps {
	isServer: boolean;
	authVerification: Partial<User>;
	designId: string;
	assetEntryId: string;
	projectId: string;
}

const ParentContainer = styled.div`
	display: flex;
	flex-wrap: wrap;

	> * {
		flex-grow: 1;
		flex-shrink: 1;
	}
`;
const SidebarContainer = styled.div`
	flex-basis: 35ch;
	flex-grow: 1;
	@media only screen and (max-width: 768px) {
		flex-basis: 30ch;
	}
`;
const MainContentContainer = styled.div`
	flex-basis: 0;
	flex-grow: 999;
	min-width: 50%;
`;

const AssetStore = ({
	isServer,
	authVerification,
	projectId,
	designId,
	assetEntryId
}: AssetStoreProps): JSX.Element => {
	const [state, dispatch] = useReducer(reducer, assetStoreInitialState);
	const Router = useRouter();

	const fetchMetaData = async (): Promise<void> => {
		const endpoint = getMetaDataApi();
		const response = await fetcher({ endPoint: endpoint, method: "GET" });
		if (response.statusCode === 200) {
			dispatch({ type: ASSET_ACTION_TYPES.METADATA, value: response.data });
		}
	};

	const fetchMoodBoard = async (): Promise<void> => {
		dispatch({ type: ASSET_ACTION_TYPES.LOADING_STATUS, value: true });
		const endPoint = getMoodboardApi(designId);
		const responseData = await fetcher({ endPoint, method: "GET" });
		if (responseData.statusCode <= 300) {
			dispatch({ type: ASSET_ACTION_TYPES.MOODBOARD, value: responseData.data.moodboard });
		}
		dispatch({ type: ASSET_ACTION_TYPES.LOADING_STATUS, value: false });
	};

	useEffect(() => {
		if (assetEntryId) {
			message.warn("In Recommendation Selection Mode");
		} else message.warn("Primary Asset Selection mode");
	}, [assetEntryId]);

	useEffect(() => {
		fetchMetaData();
		fetchMoodBoard();
	}, []);

	const addRemoveAsset: (action: "ADD" | "DELETE", assetId: string, aeid?: string) => void = async (
		action,
		assetId,
		aeid = ""
	) => {
		dispatch({ type: ASSET_ACTION_TYPES.LOADING_STATUS, value: true });

		const endpoint = getMoodboardApi(designId, aeid);
		let response: { status: string; data: { moodboard: MoodboardAsset[] } } = null;
		if (action === "ADD") {
			response = await fetcher({
				endPoint: endpoint,
				method: "POST",
				body: {
					data: {
						assets: [assetId],
						assetUrls: []
					}
				}
			});
		} else if (action === "DELETE") {
			response = await fetcher({
				endPoint: endpoint,
				method: "DELETE",
				body: {
					data: {
						assets: [assetId],
						assetUrls: []
					}
				}
			});
		}
		if (response.data.moodboard) {
			dispatch({ type: ASSET_ACTION_TYPES.MOODBOARD, value: response.data.moodboard });
		}
		dispatch({ type: ASSET_ACTION_TYPES.LOADING_STATUS, value: false });
	};

	const goToButtonClick = (): void => {
		if (assetEntryId) {
			Router.push(
				{ pathname: "/assetstore", query: { designId, projectId } },
				`/assetstore/pid/${projectId}/did/${designId}`
			);
			return;
		}
		Router.push(
			{ pathname: "/dashboard", query: { designId, pid: projectId } },
			`/dashboard/pid/${projectId}/did/${designId}`
		);
	};

	const toggleCart = (): void => {
		dispatch({ type: ASSET_ACTION_TYPES.TOGGLE_CART, value: null });
	};

	return (
		<PageLayout isServer={isServer} authVerification={authVerification}>
			<Head>
				<title>Asset Store | {company.product}</title>
				{IndexPageMeta}
			</Head>
			<Spin spinning={state.loading}>
				<ParentContainer>
					<SidebarContainer>
						<MaxHeightDiv>
							<CustomDiv px="0.5rem" width="100%" overY="scroll">
								<CustomDiv py="0.5rem" width="100%">
									<Button icon="rollback" onClick={goToButtonClick} block type="primary">
										{assetEntryId ? "Go to Primary Asset Selection" : " Go to Dashboard"}
									</Button>
								</CustomDiv>
								<CustomDiv py="0.5rem" width="100%">
									<Button onClick={toggleCart} block type="default">
										Open Cart
									</Button>
								</CustomDiv>
								<Sidebar state={state} dispatch={dispatch} metaData={state.metaData} />
							</CustomDiv>
						</MaxHeightDiv>
					</SidebarContainer>
					<MainContentContainer>
						<MaxHeightDiv>
							<CustomDiv flexDirection="column" width="100%" px="0.5rem">
								<AssetMainPanel
									projectId={projectId}
									dispatch={dispatch}
									state={state}
									assetEntryId={assetEntryId}
									designId={designId}
									moodboard={state.moodboard}
									addRemoveAsset={addRemoveAsset}
								/>
							</CustomDiv>
						</MaxHeightDiv>
					</MainContentContainer>
				</ParentContainer>
			</Spin>
			{state.moodboard && (
				<AssetCartModal
					designId={designId}
					projectId={projectId}
					dataLoading={state.loading}
					addRemoveAsset={addRemoveAsset}
					cartOpen={state.cartOpen}
					dispatch={dispatch}
					moodboard={state.moodboard}
					selectedAssetId={assetEntryId}
				/>
			)}
		</PageLayout>
	);
};

AssetStore.getInitialProps = (
	ctx: NextPageContext
): {
	isServer: boolean;
	authVerification: Partial<User>;
	projectId: string;
	designId: string;
	assetEntryId: string;
} => {
	const {
		req,
		query: { designId: did, assetEntryId: aeid, projectId: pid }
	} = ctx;
	const isServer = !!req;
	const authVerification = {
		name: "",
		email: ""
	};

	const designId: string = did as string;
	const assetEntryId: string = aeid as string;
	const projectId: string = pid as string;
	return { isServer, authVerification, projectId, designId, assetEntryId };
};

export default withAuthVerification(withAuthSync(AssetStore));
